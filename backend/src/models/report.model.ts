// Report entity types

export type ReportType = 'gstr1' | 'tally_xml' | 'excel' | 'csv' | 'hsn_summary' | 'state_summary';
export type ReportStatus = 'pending' | 'generating' | 'completed' | 'failed';

export interface Report {
    id: string;
    user_id: string;
    report_type: ReportType;
    file_name: string;
    file_path: string;
    file_size?: number;
    status: ReportStatus;
    error_message?: string;
    upload_ids: string[];
    period_from?: Date;
    period_to?: Date;
    gstin?: string;
    created_at: Date;
    completed_at?: Date;
}

export interface ReportListItem {
    id: string;
    report_type: ReportType;
    file_name: string;
    status: ReportStatus;
    period_from?: Date;
    period_to?: Date;
    created_at: Date;
}

export interface GenerateReportDTO {
    report_type: ReportType;
    upload_ids: string[];
    gstin?: string;
    period_from?: Date;
    period_to?: Date;
    options?: ReportOptions;
}

export interface ReportOptions {
    include_hsn_summary?: boolean;
    include_state_wise?: boolean;
    include_platform_wise?: boolean;
    company_name?: string;
    financial_year?: string;
}

// Report type configurations
export const REPORT_TYPES: { type: ReportType; label: string; description: string; extension: string }[] = [
    {
        type: 'gstr1',
        label: 'GSTR-1 JSON',
        description: 'GST Return JSON file for upload to GST Portal',
        extension: '.json'
    },
    {
        type: 'tally_xml',
        label: 'Tally XML',
        description: 'Tally Prime compatible XML for import',
        extension: '.xml'
    },
    {
        type: 'excel',
        label: 'Excel Report',
        description: 'Detailed Excel workbook with all transactions',
        extension: '.xlsx'
    },
    {
        type: 'csv',
        label: 'CSV Export',
        description: 'Simple CSV file for spreadsheet import',
        extension: '.csv'
    },
    {
        type: 'hsn_summary',
        label: 'HSN Summary',
        description: 'HSN-wise tax summary report',
        extension: '.xlsx'
    },
    {
        type: 'state_summary',
        label: 'State-wise Summary',
        description: 'State-wise IGST/CGST/SGST breakdown',
        extension: '.xlsx'
    },
];

// Helper to get report filename
export function generateReportFileName(type: ReportType, gstin?: string): string {
    const date = new Date();
    const timestamp = date.toISOString().slice(0, 10).replace(/-/g, '');
    const config = REPORT_TYPES.find(r => r.type === type);
    const extension = config?.extension || '.txt';
    const prefix = gstin ? `${gstin}_` : '';

    return `${prefix}${type}_${timestamp}${extension}`;
}
