import { db } from '../../db/db';
import { users } from '../../db/schema/users';
import { userSessions } from '../../db/schema/user_session';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Generate a secure passive hash for session tracking
 */
function generatePassiveHash(): string {
  return crypto.randomBytes(32).toString('hex');
}

// 🔐 Register
export async function registerUser(data: {
  username: string;
  password: string;
  mobileNumber: string;
  type?: 'admin' | 'selector';
}) {
  // hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db
    .insert(users)
    .values({
      username: data.username,
      password: hashedPassword,
      mobileNumber: data.mobileNumber,
      type: data.type ?? 'selector',
    });

  const user = await db.query.users.findFirst({
    where: eq(users.username, data.username),
  });

  return user;
}

import { exams } from '../../db/schema/exam';

// 🔑 Login with Session Management
export async function loginUser(username: string, password: string, examName?: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error('Invalid password');
  }

  // ✅ CHECK FOR EXISTING ACTIVE SESSION FOR THIS USER (BROWSER/DEVICE CHECK) - FIRST!
  if (user.type === 'selector') {
    const userActiveSession = await db.query.userSessions.findFirst({
      where: and(
        eq(userSessions.userId, user.id),
        eq(userSessions.isActive, true)
      ),
    });

    if (userActiveSession) {
      throw new Error('You are already logged in from another browser or device. Please log out first.');
    }
  }

  let examId: number | undefined;

  if (user.type === 'selector') {
    if (!examName) {
      throw new Error('An examination must be selected to continue');
    }

    // Validate and get examId
    const exam = await db.query.exams.findFirst({
      where: eq(exams.examName, examName),
    });

    if (!exam) {
      throw new Error('The selected examination was not found or is no longer active');
    }
    examId = exam.id;
    const examBodyName = exam.examBodyName;

    // ✅ CHECK FOR EXISTING ACTIVE SESSION FOR THIS EXAM (BY OTHER USERS)
    const existingExamSession = await db.query.userSessions.findFirst({
      where: and(
        eq(userSessions.examId, examId),
        eq(userSessions.isActive, true)
      ),
    });

    if (existingExamSession && existingExamSession.userId !== user.id) {
      throw new Error('Another user is already logged into this exam.');
    }

    // create JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        type: user.type, // admin / selector
        examId: examId,
        examName: user.type === 'selector' ? examName : undefined,
        examBodyName: user.type === 'selector' ? examBodyName : undefined,
      },
      JWT_SECRET,
      { expiresIn: '1d' },
    );

    // ✅ CREATE NEW EXAM SESSION FOR SELECTOR
    const passiveHash = generatePassiveHash();
    await db.insert(userSessions).values({
      userId: user.id,
      examId: examId,
      isActive: true,
      passiveHash: passiveHash,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        type: user.type,
        examId: examId,
        examName: user.type === 'selector' ? examName : undefined,
        examBodyName: user.type === 'selector' ? examBodyName : undefined,
      },
    };
  }

  // create JWT for admin
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      type: user.type,
    },
    JWT_SECRET,
    { expiresIn: '1d' },
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      type: user.type,
    },
  };
}

// 👤 Get User Profile
export async function getUserById(id: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Remove sensitive data (like password) before returning
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// 🔓 Logout - Clear Active Session
export async function logoutUser(userId: number, examId?: number) {
  try {
    if (examId) {
      // For selectors, deactivate the specific exam session
      await db
        .update(userSessions)
        .set({ isActive: false })
        .where(
          and(
            eq(userSessions.userId, userId),
            eq(userSessions.examId, examId),
            eq(userSessions.isActive, true)
          )
        );
    } else {
      // For admins or general logout, deactivate all user sessions
      await db
        .update(userSessions)
        .set({ isActive: false })
        .where(
          and(
            eq(userSessions.userId, userId),
            eq(userSessions.isActive, true)
          )
        );
    }
  } catch (err) {
    console.error('Error clearing session:', err);
    // Don't throw - logout should succeed even if session clearing fails
  }
}

// 💥 Force Logout - Clear All Active Sessions for a User after verifying credentials
export async function forceLogoutUser(username: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error('Invalid password');
  }

  // Deactivate all sessions for this user
  await logoutUser(user.id);

  return { message: 'All sessions cleared successfully' };
}
