import { Request, Response } from 'express';
import { registerUser, loginUser, getUserById, logoutUser, forceLogoutUser } from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

// Register API
export async function register(req: Request, res: Response) {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      message: 'User created',
      user,
    });
  } catch (err: unknown) {
    console.error('Error during registration:', err);
    res.status(400).json({ error: err instanceof Error ? err.message : 'Unknown error', fullError: String(err), errKeys: typeof err === 'object' && err ? Object.keys(err) : [] });
  }
}

// Login API
export async function login(req: Request, res: Response) {
  try {
    const { username, password, examName } = req.body;

    const result = await loginUser(username, password, examName);

    let redirectUrl = '/';
    if (result.user.type === 'admin') {
      redirectUrl = '/admin';
    } else if (result.user.type === 'selector') {
      redirectUrl = '/selectorControl';
    }

    res.json({ ...result, redirectUrl });
  } catch (err: unknown) {
    console.error('Error during login:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(401).json({ error: message });
  }
}

// Profile API
export async function profile(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch fresh user data from DB
    const user = await getUserById(req.user.id);

    res.json({
      user: {
        ...user,
        examId: req.user.examId,
        examName: req.user.examName, // Include examName from token session
        examBodyName: req.user.examBodyName, // Include examBodyName from token session
      },
    });
  } catch (err: unknown) {
    console.error('Error fetching profile:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

// Logout API
export async function logout(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Clear the user's active session from the database
    await logoutUser(req.user.id, req.user.examId);

    res.json({
      message: 'Logged out successfully',
    });
  } catch (err: unknown) {
    console.error('Error during logout:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

// Force Logout API (Unauthenticated)
export async function forceLogout(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await forceLogoutUser(username, password);

    res.json(result);
  } catch (err: unknown) {
    console.error('Error during force logout:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(401).json({ error: message });
  }
}
