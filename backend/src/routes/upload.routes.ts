import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { BadRequestError } from '../middleware/error.middleware';
import { query } from '../config/database';
import { processFile } from '../services/file.service';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_DIR || './uploads');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['.pdf', '.csv', '.xlsx', '.xls', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed: PDF, CSV, Excel, JSON'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
    },
});

// Upload file
router.post('/', authenticate, upload.single('file'), async (req: AuthRequest, res, next) => {
    try {
        if (!req.file) {
            throw BadRequestError('No file uploaded');
        }

        const { platform_name = 'Unknown' } = req.body;
        const uploadId = uuidv4();

        // Save upload record
        await query(
            `INSERT INTO uploads (id, user_id, file_name, file_path, file_type, platform_name, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [
                uploadId,
                req.user!.id,
                req.file.originalname,
                req.file.path,
                path.extname(req.file.originalname).toLowerCase(),
                platform_name,
                'pending',
            ]
        );

        // Process file asynchronously
        processFile(uploadId, req.file.path, platform_name).catch(console.error);

        res.status(201).json({
            success: true,
            data: {
                id: uploadId,
                fileName: req.file.originalname,
                platform: platform_name,
                status: 'pending',
            },
        });
    } catch (error) {
        next(error);
    }
});

// Get user uploads
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const result = await query(
            `SELECT id, file_name, file_type, platform_name, status, created_at
       FROM uploads
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
            [req.user!.id]
        );

        res.json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        next(error);
    }
});

// Get upload status
router.get('/:id/status', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const result = await query(
            `SELECT id, file_name, status, platform_name, created_at, processed_at
       FROM uploads
       WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.user!.id]
        );

        if (result.rows.length === 0) {
            throw BadRequestError('Upload not found');
        }

        res.json({
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
});

// Get transactions for an upload
router.get('/:id/transactions', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const result = await query(
            `SELECT t.* FROM transactions t
       JOIN uploads u ON t.upload_id = u.id
       WHERE t.upload_id = $1 AND u.user_id = $2
       ORDER BY t.transaction_date DESC`,
            [req.params.id, req.user!.id]
        );

        res.json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
