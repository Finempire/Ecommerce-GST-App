// Upload entity types

export type UploadStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type FileType = '.pdf' | '.csv' | '.xlsx' | '.xls' | '.json';

export type PlatformName =
    | 'Amazon'
    | 'Flipkart'
    | 'Meesho'
    | 'Myntra'
    | 'Glowroad'
    | 'Jio Mart'
    | 'LimeRoad'
    | 'Snapdeal'
    | 'Shop 101'
    | 'Paytm'
    | 'Bank Statement'
    | 'Unknown';

export interface Upload {
    id: string;
    user_id: string;
    file_name: string;
    file_path: string;
    file_type: FileType;
    file_size?: number;
    platform_name: PlatformName;
    status: UploadStatus;
    error_message?: string;
    transaction_count?: number;
    processed_at?: Date;
    created_at: Date;
}

export interface UploadListItem {
    id: string;
    file_name: string;
    file_type: FileType;
    platform_name: PlatformName;
    status: UploadStatus;
    transaction_count?: number;
    created_at: Date;
}

export interface CreateUploadDTO {
    user_id: string;
    file_name: string;
    file_path: string;
    file_type: FileType;
    file_size?: number;
    platform_name: PlatformName;
}

export interface UploadStatusResponse {
    id: string;
    file_name: string;
    status: UploadStatus;
    platform_name: PlatformName;
    error_message?: string;
    transaction_count?: number;
    created_at: Date;
    processed_at?: Date;
}

// Supported platforms configuration
export const SUPPORTED_PLATFORMS: { name: PlatformName; label: string; icon: string }[] = [
    { name: 'Amazon', label: 'Amazon Seller Central', icon: '🛒' },
    { name: 'Flipkart', label: 'Flipkart Seller Hub', icon: '📦' },
    { name: 'Meesho', label: 'Meesho Supplier', icon: '🛍️' },
    { name: 'Myntra', label: 'Myntra Partner', icon: '👗' },
    { name: 'Glowroad', label: 'Glowroad Reseller', icon: '✨' },
    { name: 'Jio Mart', label: 'JioMart Seller', icon: '📱' },
    { name: 'LimeRoad', label: 'LimeRoad Seller', icon: '🍋' },
    { name: 'Snapdeal', label: 'Snapdeal Seller', icon: '📸' },
    { name: 'Shop 101', label: 'Shop101', icon: '🏪' },
    { name: 'Paytm', label: 'Paytm Mall', icon: '💳' },
    { name: 'Bank Statement', label: 'Bank Statement PDF', icon: '🏦' },
];
