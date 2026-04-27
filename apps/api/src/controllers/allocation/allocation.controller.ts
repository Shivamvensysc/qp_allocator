import { Request, Response } from 'express';
import { getExamAllocationData, executeFullRandomization, resolveTie, getAllocationHistory } from './allocation.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export async function getExamData(req: AuthRequest, res: Response) {
  try {
    const examId = parseInt(req.query.examId as string);
    const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;
    const shiftId = req.query.shiftId ? parseInt(req.query.shiftId as string) : undefined;
    
    if (isNaN(examId)) return res.status(400).json({ error: "Invalid examId" });

    const data = await getExamAllocationData(examId, subjectId, shiftId);
    res.json(data);
  } catch (err: unknown) {
    console.error('Error fetching exams:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

export async function randomize(req: AuthRequest, res: Response) {
  try {
    const { subjectId, shiftId, examId, iterationIndex } = req.body;
    const userId = req.user!.id;
    // Prefer examId from body for flexibility, fallback to user session
    const targetExamId = examId || req.user!.examId;

    if (!targetExamId) return res.status(400).json({ error: "No exam context found" });

    const result = await executeFullRandomization({
      subjectId: parseInt(subjectId),
      shiftId: parseInt(shiftId),
      userId,
      examId: parseInt(targetExamId),
      iterationIndex: iterationIndex !== undefined ? parseInt(iterationIndex) : undefined
    });

    res.json(result);
  } catch (err: unknown) {
    console.error('Error during randomization:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

export async function resolveTieHandler(req: AuthRequest, res: Response) {
  try {
    const { subjectId, shiftId, candidates } = req.body;
    const userId = req.user!.id;

    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ error: "No candidates provided for resolution" });
    }

    const result = await resolveTie({
      subjectId: parseInt(subjectId),
      shiftId: parseInt(shiftId),
      candidates,
      userId
    });

    res.json(result);
  } catch (err: unknown) {
    console.error('Error in tie resolution:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

export async function getHistory(req: AuthRequest, res: Response) {
  try {
    const examId = req.query.examId ? parseInt(req.query.examId as string) : undefined;
    const history = await getAllocationHistory(examId);
    res.json({ history });
  } catch (err: unknown) {
    console.error('Error fetching allocation history:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}
