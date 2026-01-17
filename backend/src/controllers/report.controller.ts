import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth.middleware';
import { query } from '../config/database';
import { BadRequestError } from '../middleware/error.middleware';
import { generateTallyXML } from '../services/tally.service';
import { generateGSTR1 } from '../services/gstr.service';
import { generateCSV, generateJSON } from '../services/export.service';

// Types
interface GenerateReportBody {
    upload_ids: string[];
    report_type: 'tally_xml' | 'gstr1_json' | 'csv' | 'summary';
    date_from?: string;
    date_to?: string;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Get upload count
        const uploadsResult = await query(
            'SELECT COUNT(*) as count FROM uploads WHERE user_id = $1',
            [req.user!.id]
        );

        // Get transaction stats
        const transactionsResult = await query(
            `SELECT 
                COUNT(*) as total_transactions,
                COALESCE(SUM(taxable_value), 0) as total_taxable_value,
                COALESCE(SUM(igst + cgst + sgst), 0) as total_gst
             FROM transactions t
             JOIN uploads u ON t.upload_id = u.id
             WHERE u.user_id = $1`,
            [req.user!.id]
        );

        // Get recent uploads
        const recentResult = await query(
            `SELECT id, file_name, platform_name, status, created_at
             FROM uploads
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT 5`,
            [req.user!.id]
        );

        const stats = transactionsResult.rows[0];

        res.json({
            success: true,
            data: {
                total_uploads: parseInt(uploadsResult.rows[0].count) || 0,
                total_transactions: parseInt(stats.total_transactions) || 0,
                total_taxable_value: parseFloat(stats.total_taxable_value) || 0,
                total_gst: parseFloat(stats.total_gst) || 0,
                recent_uploads: recentResult.rows,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Generate a report from selected uploads
 */
export const generateReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { upload_ids, report_type, date_from, date_to } = req.body as GenerateReportBody;

        if (!upload_ids || !Array.isArray(upload_ids) || upload_ids.length === 0) {
            throw BadRequestError('upload_ids array is required');
        }

        if (!['tally_xml', 'gstr1_json', 'csv', 'summary'].includes(report_type)) {
            throw BadRequestError('Invalid report type');
        }

        const reportId = uuidv4();

        // Get transactions for selected uploads
        const transactionsResult = await query(
            `SELECT t.*, u.platform_name 
             FROM transactions t
             JOIN uploads u ON t.upload_id = u.id
             WHERE t.upload_id = ANY($1) AND u.user_id = $2
             ORDER BY t.transaction_date`,
            [upload_ids, req.user!.id]
        );

        const transactions = transactionsResult.rows;

        if (transactions.length === 0) {
            throw BadRequestError('No transactions found for the selected uploads');
        }

        let fileContent: string;
        let fileName: string;
        let contentType: string;

        switch (report_type) {
            case 'tally_xml':
                fileContent = generateTallyXML(transactions);
                fileName = `tally_export_${Date.now()}.xml`;
                contentType = 'application/xml';
                break;

            case 'gstr1_json':
                fileContent = generateGSTR1(transactions);
                fileName = `gstr1_${Date.now()}.json`;
                contentType = 'application/json';
                break;

            case 'csv':
                fileContent = generateCSV(transactions);
                fileName = `transactions_${Date.now()}.csv`;
                contentType = 'text/csv';
                break;

            case 'summary':
                fileContent = generateJSON(transactions);
                fileName = `summary_${Date.now()}.json`;
                contentType = 'application/json';
                break;

            default:
                throw BadRequestError('Invalid report type');
        }

        // Save report record
        await query(
            `INSERT INTO reports (id, user_id, report_type, file_name, file_content, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [reportId, req.user!.id, report_type, fileName, fileContent]
        );

        res.json({
            success: true,
            data: {
                id: reportId,
                fileName,
                reportType: report_type,
                transactionCount: transactions.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get list of user reports
 */
export const getReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await query(
            `SELECT id, report_type, file_name, created_at
             FROM reports
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
 * Download a report
 */
export const downloadReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await query(
            `SELECT file_name, file_content, report_type
             FROM reports
             WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.user!.id]
        );

        if (result.rows.length === 0) {
            throw BadRequestError('Report not found');
        }

        const report = result.rows[0];
        let contentType = 'text/plain';

        if (report.file_name.endsWith('.xml')) {
            contentType = 'application/xml';
        } else if (report.file_name.endsWith('.json')) {
            contentType = 'application/json';
        } else if (report.file_name.endsWith('.csv')) {
            contentType = 'text/csv';
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${report.file_name}"`);
        res.send(report.file_content);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a report
 */
export const deleteReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await query(
            'DELETE FROM reports WHERE id = $1 AND user_id = $2 RETURNING id',
            [req.params.id, req.user!.id]
        );

        if (result.rows.length === 0) {
            throw BadRequestError('Report not found or already deleted');
        }

        res.json({
            success: true,
            message: 'Report deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
