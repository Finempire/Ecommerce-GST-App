import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error('❌ Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
};

export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Common errors
export const BadRequestError = (message: string) => new ApiError(message, 400);
export const UnauthorizedError = (message: string = 'Unauthorized') => new ApiError(message, 401);
export const ForbiddenError = (message: string = 'Forbidden') => new ApiError(message, 403);
export const NotFoundError = (message: string = 'Not Found') => new ApiError(message, 404);
export const ConflictError = (message: string) => new ApiError(message, 409);
