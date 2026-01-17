// Uploads API Service

import apiClient, { ApiResponse } from './client';

export interface Upload {
    id: string;
    file_name: string;
    file_type: string;
    platform_name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    transaction_count?: number;
    error_message?: string;
    created_at: string;
    processed_at?: string;
}

export interface Transaction {
    id: string;
    order_id: string;
    transaction_date: string;
    description: string;
    quantity: number;
    sale_price: number;
    taxable_value: number;
    gst_rate: number;
    igst: number;
    cgst: number;
    sgst: number;
    hsn_code: string;
    state_code: string;
    product_name?: string;
    platform_name?: string;
}

export interface UploadResponse {
    id: string;
    fileName: string;
    platform: string;
    status: string;
}

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
    | 'Bank Statement';

export const PLATFORMS: { name: PlatformName; label: string; icon: string }[] = [
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

export const uploadsApi = {
    /**
     * Upload a file for processing
     */
    async uploadFile(file: File, platformName: string): Promise<ApiResponse<UploadResponse>> {
        return apiClient.uploadFile<UploadResponse>('/uploads', file, {
            platform_name: platformName,
        });
    },

    /**
     * Get list of user uploads
     */
    async getUploads(): Promise<ApiResponse<Upload[]>> {
        return apiClient.get<Upload[]>('/uploads');
    },

    /**
     * Get upload status by ID
     */
    async getUploadStatus(uploadId: string): Promise<ApiResponse<Upload>> {
        return apiClient.get<Upload>(`/uploads/${uploadId}/status`);
    },

    /**
     * Get transactions for an upload
     */
    async getTransactions(uploadId: string): Promise<ApiResponse<Transaction[]>> {
        return apiClient.get<Transaction[]>(`/uploads/${uploadId}/transactions`);
    },

    /**
     * Poll for upload completion
     */
    async pollUploadStatus(uploadId: string, onUpdate: (status: Upload) => void, interval = 2000): Promise<Upload> {
        return new Promise((resolve, reject) => {
            const checkStatus = async () => {
                try {
                    const response = await this.getUploadStatus(uploadId);

                    if (response.success && response.data) {
                        onUpdate(response.data);

                        if (response.data.status === 'completed' || response.data.status === 'failed') {
                            resolve(response.data);
                        } else {
                            setTimeout(checkStatus, interval);
                        }
                    } else {
                        reject(new Error('Failed to get upload status'));
                    }
                } catch (error) {
                    reject(error);
                }
            };

            checkStatus();
        });
    },
};

export default uploadsApi;
