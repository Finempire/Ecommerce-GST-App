import { Response, NextFunction } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth.middleware';
import { BadRequestError } from '../middleware/error.middleware';
import { query } from '../config/database';
import { processFile } from '../services/file.service';

/**
 * Upload and process a file
 */
export const uploadFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
};

/**
 * Get list of user uploads
 */
export const getUploads = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
};

/**
 * Get status of a specific upload
 */
export const getUploadStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        console.log(`[DEBUG] Fetching status for upload: ${req.params.id} user: ${req.user!.id}`);
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
};

/**
 * Get transactions for an upload
 */
export const getUploadTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
};

/**
 * Delete an upload
 */
export const deleteUpload = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await query(
            'DELETE FROM uploads WHERE id = $1 AND user_id = $2 RETURNING id',
            [req.params.id, req.user!.id]
        );

        if (result.rows.length === 0) {
            throw BadRequestError('Upload not found or already deleted');
        }

        res.json({
            success: true,
            message: 'Upload deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
