// Transaction entity types

export interface Transaction {
    id: string;
    upload_id: string;
    order_id: string;
    transaction_date: Date;
    description: string;
    quantity: number;
    unit_price: number;
    sale_price: number;
    taxable_value: number;
    gst_rate: number;
    igst: number;
    cgst: number;
    sgst: number;
    cess: number;
    hsn_code: string;
    state_code: string;
    customer_name?: string;
    customer_gstin?: string;
    product_name?: string;
    sku?: string;
    platform_name?: string;
    invoice_number?: string;
    created_at: Date;
}

export interface TransactionSummary {
    total_transactions: number;
    total_taxable_value: number;
    total_igst: number;
    total_cgst: number;
    total_sgst: number;
    total_sale_value: number;
    total_quantity: number;
}

export interface TransactionFilter {
    upload_id?: string;
    platform_name?: string;
    state_code?: string;
    gst_rate?: number;
    hsn_code?: string;
    from_date?: Date;
    to_date?: Date;
    limit?: number;
    offset?: number;
}

export interface ParsedTransaction {
    order_id: string;
    transaction_date: Date;
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
    customer_name?: string;
    product_name?: string;
    sku?: string;
    invoice_number?: string;
}

// GST rate slabs
export const GST_RATES = [0, 5, 12, 18, 28] as const;
export type GSTRate = typeof GST_RATES[number];

// Transaction type for GSTR returns
export type TransactionType = 'B2B' | 'B2CS' | 'B2CL' | 'CDNR' | 'EXPORT';

export interface GSTBreakdown {
    taxable_value: number;
    gst_rate: number;
    igst: number;
    cgst: number;
    sgst: number;
    cess: number;
    total_tax: number;
    total_value: number;
}

// Helper to calculate transaction summary
export function calculateTransactionSummary(transactions: Transaction[]): TransactionSummary {
    return transactions.reduce(
        (acc, txn) => ({
            total_transactions: acc.total_transactions + 1,
            total_taxable_value: acc.total_taxable_value + txn.taxable_value,
            total_igst: acc.total_igst + txn.igst,
            total_cgst: acc.total_cgst + txn.cgst,
            total_sgst: acc.total_sgst + txn.sgst,
            total_sale_value: acc.total_sale_value + txn.sale_price,
            total_quantity: acc.total_quantity + txn.quantity,
        }),
        {
            total_transactions: 0,
            total_taxable_value: 0,
            total_igst: 0,
            total_cgst: 0,
            total_sgst: 0,
            total_sale_value: 0,
            total_quantity: 0,
        }
    );
}
