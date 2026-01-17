// Export all API modules

export { apiClient, type ApiResponse, type ApiError } from './client';
export { authApi, type User, type AuthResponse, type LoginCredentials, type RegisterData } from './auth';
export { uploadsApi, type Upload, type Transaction, type UploadResponse, PLATFORMS } from './uploads';
export { reportsApi, type Report, type ReportType, type DashboardStats, REPORT_TYPES } from './reports';
