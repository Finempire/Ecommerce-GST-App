import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from './error.middleware';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: 'admin' | 'ca' | 'business';
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw UnauthorizedError('No token provided');
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'default-secret';

        const decoded = jwt.verify(token, secret) as {
            id: string;
            email: string;
            role: 'admin' | 'ca' | 'business';
        };

        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(UnauthorizedError('Invalid token'));
        } else if (error instanceof jwt.TokenExpiredError) {
            next(UnauthorizedError('Token expired'));
        } else {
            next(error);
        }
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(UnauthorizedError());
        }

        if (!roles.includes(req.user.role)) {
            return next(ForbiddenError('Insufficient permissions'));
        }

        next();
    };
};
