import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as reportController from '../controllers/report.controller';

const router = Router();

// Routes
router.get('/dashboard', authenticate, reportController.getDashboardStats);
router.post('/generate', authenticate, reportController.generateReport);
router.get('/', authenticate, reportController.getReports);
router.get('/:id/download', authenticate, reportController.downloadReport);
router.delete('/:id', authenticate, reportController.deleteReport);

export default router;

