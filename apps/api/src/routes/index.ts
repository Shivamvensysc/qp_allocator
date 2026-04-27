import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';
import { register, login, profile, logout, forceLogout } from '../controllers/auth/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

import { getExams, createExam, getExamById, updateExamStatus, updateExam } from '../controllers/exam/exam.controller';

import { getExamData, randomize, resolveTieHandler, getHistory } from '../controllers/allocation/allocation.controller';
import { getUsersByType } from '../controllers/user/user.controller';

const router = Router();

router.get('/health', healthCheck);
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, profile);
router.post('/logout', authenticate, logout);
router.post('/force-logout', forceLogout);

// User Routes
router.get('/users', authenticate, getUsersByType);

// Exam Routes
router.get('/exams', getExams);
router.get('/exams/:id', authenticate, getExamById);
router.post('/exams', authenticate, createExam);
router.put('/exams/:id', authenticate, updateExam);
router.patch('/exams/:id/status', authenticate, updateExamStatus);

// Allocation Routes
router.get('/allocations/data', authenticate, getExamData);
router.post('/allocations/randomize', authenticate, randomize);
router.post('/allocations/resolve-tie', authenticate, resolveTieHandler);
router.get('/allocations/history', authenticate, getHistory);

export default router;
