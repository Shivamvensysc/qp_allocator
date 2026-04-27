import { Response } from 'express';
import { db } from '../../db/db';
import { exams } from '../../db/schema/exam';
import { shifts } from '../../db/schema/shift';
import { subjects } from '../../db/schema/subject';
import { shiftSubjects } from '../../db/schema/shiftSubject';
import { iterations } from '../../db/schema/iteration';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { eq, and, inArray } from 'drizzle-orm';
import { sql } from "drizzle-orm";   

export async function getExams(req: AuthRequest, res: Response) {
  try {
    const allExams = await db.select().from(exams);

    const allShifts = await db.select().from(shifts);
    const allSubjects = await db.select().from(subjects);

    const examsWithCounts = allExams.map(exam => ({
      ...exam,
      shiftCount: allShifts.filter(s => s.examId === exam.id).length,
      subjectCount: allSubjects.filter(sub => sub.examId === exam.id).length
    }));


    res.json({ exams: examsWithCounts });
  } catch (err: unknown) {
    console.error('Error fetching exams:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

export async function createExam(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { exam, shifts: shiftsData, subjects: subjectsData } = req.body;

  let examId: number = 0;
  try {
    await db.transaction(async (tx) => {
      // 1. Insert Exam
      const [insertedExam] = await tx.insert(exams).values({
        ...exam,
        createdBy: userId,
        createdAt: new Date(),
      });
      examId = insertedExam.insertId;

      // 2. Insert Shifts
      const shiftIds: number[] = [];
      for (const shift of shiftsData) {
        const [insertedShift] = await tx.insert(shifts).values({
          ...shift,
          examId,
          createdBy: userId,
          createdAt: new Date(),
        });
        shiftIds.push(insertedShift.insertId);
      }

      // 3. Insert Subjects and link to Shifts
      for (const subject of subjectsData) {
        const { shiftIndex, ...subjectFields } = subject;
        const [insertedSubject] = await tx.insert(subjects).values({
          ...subjectFields,
          examId,
          createdBy: userId,
          createdAt: new Date(),
        });
        const subjectId = insertedSubject.insertId;

        // Link to shift if provided
        if (typeof shiftIndex === 'number' && shiftIds[shiftIndex]) {
          await tx.insert(shiftSubjects).values({
            ssId: shiftIds[shiftIndex], // Mapping shiftId to ss_id as per schema
            subjectId,
            createdBy: userId,
            createdAt: new Date(),
          });
        }
      }
    });

    res.status(201).json({ message: 'Exam created successfully', id: examId });
  } catch (err: unknown) {
    console.error('Error creating exam:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

export async function getExamById(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const examId = parseInt(id as string);

  if (isNaN(examId)) {
    return res.status(400).json({ error: 'Invalid exam ID' });
  }

  try {
    // Using standard select for maximum compatibility
    const [exam] = await db.select().from(exams).where(eq(exams.id, examId)).limit(1);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const examShifts = await db.select().from(shifts).where(eq(shifts.examId, examId));
    const examSubjects = await db.select().from(subjects).where(eq(subjects.examId, examId));
    // const examShifts = await db.select().from(shifts).where(eq(shifts.examId, examId));
    // const examSubjects = await db.select().from(subjects).where(eq(subjects.examId, examId));

    // Fetch only relevant shift mappings for these subjects
    const subjectIds = examSubjects.map(s => s.id);
    let mappings: any[] = [];

    if (subjectIds.length > 0) {
      mappings = await db.select()
        .from(shiftSubjects)
        .where(
          and(
            eq(shiftSubjects.isDeleted, false),
            inArray(shiftSubjects.subjectId, subjectIds)
          )
        );
    }

    res.json({
      exam,
      shifts: examShifts,
      subjects: examSubjects.map(sub => ({
        ...sub,
        mappings: mappings.filter(m => m.subjectId === sub.id)
      }))
    });
  } catch (err: unknown) {
    console.error('Error fetching exam details:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

export async function updateExamStatus(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { status } = req.body;
  const examId = parseInt(id as string);

  if (isNaN(examId)) {
    return res.status(400).json({ error: 'Invalid exam ID' });
  }

  try {
    await db.update(exams)
      .set({ status })
      .where(eq(exams.id, examId));

    res.json({ message: 'Exam status updated successfully' });
  } catch (err: unknown) {
    console.error('Error updating exam status:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

export async function updateExam(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const examId = parseInt(id as string);
  const userId = req.user?.id;

  if (isNaN(examId)) {
    return res.status(400).json({ error: 'Invalid exam ID' });
  }
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { exam, shifts: shiftsData, subjects: subjectsData } = req.body;

  try {
    await db.transaction(async (tx) => {
      // 1. Update Core Exam
      await tx.update(exams)
        .set({
          ...exam,
          // Since we are updating, we don't need to set createdBy or createdAt again
        })
        .where(eq(exams.id, examId));

      // 2. Clear existing associations to avoid conflicts IF shifts/subjects are provided
      if (shiftsData !== undefined || subjectsData !== undefined) {
        // We manually clear shift_subjects mapping for these subjects first
        const existingSubjects = await tx.select().from(subjects).where(eq(subjects.examId, examId));
        const existingSubjectIds = existingSubjects.map(s => s.id);

        if (existingSubjectIds.length > 0) {
          const existingShiftSubjects = await tx.select().from(shiftSubjects).where(inArray(shiftSubjects.subjectId, existingSubjectIds));
          const existingShiftSubjectIds = existingShiftSubjects.map(ss => ss.id);

          if (existingShiftSubjectIds.length > 0) {
            await tx.delete(iterations).where(inArray(iterations.ssId, existingShiftSubjectIds));
          }

          await tx.delete(shiftSubjects).where(inArray(shiftSubjects.subjectId, existingSubjectIds));
        }

        // 3. Delete existing shifts & subjects
        await tx.delete(shifts).where(eq(shifts.examId, examId));
        await tx.delete(subjects).where(eq(subjects.examId, examId));

        // 4. Re-insert Shifts
        const shiftIds: number[] = [];
        if (shiftsData) {
          for (const shift of shiftsData) {
            const [insertedShift] = await tx.insert(shifts).values({
              ...shift,
              examId,
              createdBy: userId,
              createdAt: new Date(),
            });
            shiftIds.push(insertedShift.insertId);
          }
        }

        // 5. Re-insert Subjects and link to Shifts
        if (subjectsData) {
          for (const subject of subjectsData) {
            const { shiftIndex, ...subjectFields } = subject;
            const [insertedSubject] = await tx.insert(subjects).values({
              ...subjectFields,
              examId,
              createdBy: userId,
              createdAt: new Date(),
            });
            const subjectId = insertedSubject.insertId;

            // Link to shift if provided
            if (typeof shiftIndex === 'number' && shiftIds[shiftIndex]) {
              await tx.insert(shiftSubjects).values({
                ssId: shiftIds[shiftIndex],
                subjectId,
                createdBy: userId,
                createdAt: new Date(),
              });
            }
          }
        }
      }
    });

    res.json({ message: 'Exam updated successfully', id: examId });
  } catch (err: unknown) {
    console.error('Error updating exam:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

