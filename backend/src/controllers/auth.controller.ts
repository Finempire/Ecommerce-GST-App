import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { BadRequestError, ConflictError, UnauthorizedError } from '../middleware/error.middleware';

// Types
interface RegisterBody {
    email: string;
    password: string;
    name: string;
    whatsapp_number?: string;
    role?: string;
}

interface LoginBody {
    email?: string;
    password: string;
    whatsapp_number?: string;
}

interface ForgotPasswordBody {
    email: string;
}

interface ResetPasswordBody {
    token: string;
    new_password: string;
}

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, whatsapp_number, role = 'business' } = req.body as RegisterBody;

        // Validate input
        if (!email || !password || !name) {
            throw BadRequestError('Email, password, and name are required');
        }

        // Check if user exists
        const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            throw ConflictError('User with this email already exists');
        }

        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Create user
        const userId = uuidv4();
        await query(
            `INSERT INTO users (id, email, name, password_hash, whatsapp_number, role, subscription_plan, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
            [userId, email, name, password_hash, whatsapp_number || null, role, 'free_trial']
        );

        // Generate token
        const token = jwt.sign(
            { id: userId, email, role },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: { id: userId, email, name, role },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login user with email/whatsapp and password
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, whatsapp_number } = req.body as LoginBody;

        // Find user
        let userQuery: string;
        let params: string[];

        if (email) {
            userQuery = 'SELECT * FROM users WHERE email = $1';
            params = [email];
        } else if (whatsapp_number) {
            userQuery = 'SELECT * FROM users WHERE whatsapp_number = $1';
            params = [whatsapp_number];
        } else {
            throw BadRequestError('Email or WhatsApp number is required');
        }

        const result = await query(userQuery, params);
        const user = result.rows[0];

        if (!user) {
            throw UnauthorizedError('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw UnauthorizedError('Invalid credentials');
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    subscription_plan: user.subscription_plan,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Initiate password reset - sends reset token
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as ForgotPasswordBody;

        if (!email) {
            throw BadRequestError('Email is required');
        }

        // Check if user exists
        const result = await query('SELECT id, name FROM users WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            // Generate reset token
            const resetToken = uuidv4();
            const expiry = new Date(Date.now() + 3600000); // 1 hour

            await query(
                'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
                [resetToken, expiry, email]
            );

            // TODO: Send email with reset link using email service
            console.log(`Password reset token for ${email}: ${resetToken}`);
        }

        // Always return success to prevent email enumeration
        res.json({
            success: true,
            message: 'If an account exists with this email, a reset link has been sent.',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reset password using token
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, new_password } = req.body as ResetPasswordBody;

        if (!token || !new_password) {
            throw BadRequestError('Token and new password are required');
        }

        // Find user with valid reset token
        const result = await query(
            'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
            [token]
        );

        if (result.rows.length === 0) {
            throw BadRequestError('Invalid or expired reset token');
        }

        // Hash new password
        const password_hash = await bcrypt.hash(new_password, 10);

        // Update password and clear reset token
        await query(
            'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL, updated_at = NOW() WHERE id = $2',
            [password_hash, result.rows[0].id]
        );

        res.json({
            success: true,
            message: 'Password has been reset successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            throw UnauthorizedError('Not authenticated');
        }

        const result = await query(
            'SELECT id, email, name, role, subscription_plan, gstin, business_name, whatsapp_number, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            throw BadRequestError('User not found');
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
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const { name, gstin, business_name, whatsapp_number } = req.body;

        if (!userId) {
            throw UnauthorizedError('Not authenticated');
        }

        await query(
            `UPDATE users SET 
                name = COALESCE($1, name),
                gstin = COALESCE($2, gstin),
                business_name = COALESCE($3, business_name),
                whatsapp_number = COALESCE($4, whatsapp_number),
                updated_at = NOW()
             WHERE id = $5`,
            [name, gstin, business_name, whatsapp_number, userId]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        next(error);
    }
};
