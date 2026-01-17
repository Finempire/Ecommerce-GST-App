// Reports API Service

import apiClient, { ApiResponse } from './client';

export type ReportType = 'gstr1' | 'tally_xml' | 'excel' | 'csv' | 'hsn_summary' | 'state_summary';

export interface Report {
    id: string;
    report_type: ReportType;
    file_name: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    period_from?: string;
    period_to?: string;
    created_at: string;
}

export interface GenerateReportRequest {
    report_type: ReportType;
    upload_ids: string[];
    gstin?: string;
    period_from?: string;
    period_to?: string;
    options?: {
        include_hsn_summary?: boolean;
        include_state_wise?: boolean;
        company_name?: string;
    };
}

export interface DashboardStats {
    total_uploads: number;
    total_transactions: number;
    total_taxable_value: number;
    total_gst: number;
    recent_uploads: {
        id: string;
        file_name: string;
        platform_name: string;
        status: string;
        created_at: string;
    }[];
}

export const REPORT_TYPES: { type: ReportType; label: string; description: string; icon: string }[] = [
    {
        type: 'gstr1',
        label: 'GSTR-1 JSON',
        description: 'GST Return JSON for portal upload',
        icon: '📊'
    },
    {
        type: 'tally_xml',
        label: 'Tally XML',
        description: 'Tally Prime compatible import file',
        icon: '📁'
    },
    {
        type: 'excel',
        label: 'Excel Report',
        description: 'Detailed Excel workbook',
        icon: '📗'
    },
    {
        type: 'csv',
        label: 'CSV Export',
        description: 'Simple CSV for spreadsheets',
        icon: '📋'
    },
    {
        type: 'hsn_summary',
        label: 'HSN Summary',
        description: 'HSN-wise tax summary',
        icon: '📑'
    },
    {
        type: 'state_summary',
        label: 'State-wise Summary',
        description: 'State-wise GST breakdown',
        icon: '🗺️'
    },
];

export const reportsApi = {
    /**
     * Generate a new report
     */
    async generateReport(request: GenerateReportRequest): Promise<ApiResponse<Report>> {
        return apiClient.post<Report>('/reports/generate', request);
    },

    /**
     * Get list of user reports
     */
    async getReports(): Promise<ApiResponse<Report[]>> {
        return apiClient.get<Report[]>('/reports');
    },

    /**
     * Download a report file
     */
    async downloadReport(reportId: string, filename: string): Promise<void> {
        return apiClient.downloadFile(`/reports/${reportId}/download`, filename);
    },

    /**
     * Get dashboard statistics
     */
    async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
        return apiClient.get<DashboardStats>('/reports/dashboard');
    },

    /**
     * Generate GSTR-1 quickly from uploads
     */
    async generateGSTR1(uploadIds: string[], gstin?: string): Promise<ApiResponse<Report>> {
        return this.generateReport({
            report_type: 'gstr1',
            upload_ids: uploadIds,
            gstin,
        });
    },

    /**
     * Generate Tally XML from uploads
     */
    async generateTallyXML(uploadIds: string[]): Promise<ApiResponse<Report>> {
        return this.generateReport({
            report_type: 'tally_xml',
            upload_ids: uploadIds,
        });
    },
};

export default reportsApi;
