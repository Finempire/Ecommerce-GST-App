interface Transaction {
    id: string;
    order_id: string;
    transaction_date: Date | string;
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

export function generateCSV(transactions: Transaction[]): string {
    const headers = [
        'Order ID',
        'Date',
        'Platform',
        'Product',
        'HSN Code',
        'Quantity',
        'Sale Price',
        'Taxable Value',
        'GST Rate',
        'IGST',
        'CGST',
        'SGST',
        'Total Tax',
        'State Code',
    ];

    const rows = transactions.map((txn) => [
        txn.order_id,
        formatDate(txn.transaction_date),
        txn.platform_name || '',
        escapeCSV(txn.product_name || txn.description),
        txn.hsn_code,
        txn.quantity,
        txn.sale_price.toFixed(2),
        txn.taxable_value.toFixed(2),
        `${txn.gst_rate}%`,
        txn.igst.toFixed(2),
        txn.cgst.toFixed(2),
        txn.sgst.toFixed(2),
        (txn.igst + txn.cgst + txn.sgst).toFixed(2),
        txn.state_code,
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csvContent;
}

export function generateJSON(transactions: Transaction[]): string {
    // Generate summary JSON
    const summary = {
        generated_at: new Date().toISOString(),
        total_transactions: transactions.length,

        // Total amounts
        totals: {
            sale_price: roundTo2(transactions.reduce((sum, t) => sum + t.sale_price, 0)),
            taxable_value: roundTo2(transactions.reduce((sum, t) => sum + t.taxable_value, 0)),
            igst: roundTo2(transactions.reduce((sum, t) => sum + t.igst, 0)),
            cgst: roundTo2(transactions.reduce((sum, t) => sum + t.cgst, 0)),
            sgst: roundTo2(transactions.reduce((sum, t) => sum + t.sgst, 0)),
            total_tax: roundTo2(transactions.reduce((sum, t) => sum + t.igst + t.cgst + t.sgst, 0)),
        },

        // GST Rate wise summary
        gst_rate_summary: getGSTRateSummary(transactions),

        // HSN wise summary
        hsn_summary: getHSNSummary(transactions),

        // State wise summary
        state_summary: getStateSummary(transactions),

        // Platform wise summary
        platform_summary: getPlatformSummary(transactions),

        // Monthly summary
        monthly_summary: getMonthlySummary(transactions),

        // Transaction details
        transactions: transactions.map((t) => ({
            order_id: t.order_id,
            date: formatDate(t.transaction_date),
            description: t.description,
            hsn_code: t.hsn_code,
            quantity: t.quantity,
            sale_price: roundTo2(t.sale_price),
            taxable_value: roundTo2(t.taxable_value),
            gst_rate: t.gst_rate,
            igst: roundTo2(t.igst),
            cgst: roundTo2(t.cgst),
            sgst: roundTo2(t.sgst),
            state_code: t.state_code,
            platform: t.platform_name,
        })),
    };

    return JSON.stringify(summary, null, 2);
}

function getGSTRateSummary(transactions: Transaction[]) {
    const grouped: Record<number, { count: number; taxable: number; tax: number }> = {};

    for (const txn of transactions) {
        if (!grouped[txn.gst_rate]) {
            grouped[txn.gst_rate] = { count: 0, taxable: 0, tax: 0 };
        }
        grouped[txn.gst_rate].count++;
        grouped[txn.gst_rate].taxable += txn.taxable_value;
        grouped[txn.gst_rate].tax += txn.igst + txn.cgst + txn.sgst;
    }

    return Object.entries(grouped).map(([rate, data]) => ({
        rate: `${rate}%`,
        transaction_count: data.count,
        taxable_value: roundTo2(data.taxable),
        total_tax: roundTo2(data.tax),
    }));
}

function getHSNSummary(transactions: Transaction[]) {
    const grouped: Record<string, { count: number; quantity: number; taxable: number; tax: number }> = {};

    for (const txn of transactions) {
        const hsn = txn.hsn_code || 'UNKNOWN';
        if (!grouped[hsn]) {
            grouped[hsn] = { count: 0, quantity: 0, taxable: 0, tax: 0 };
        }
        grouped[hsn].count++;
        grouped[hsn].quantity += txn.quantity;
        grouped[hsn].taxable += txn.taxable_value;
        grouped[hsn].tax += txn.igst + txn.cgst + txn.sgst;
    }

    return Object.entries(grouped)
        .map(([hsn, data]) => ({
            hsn_code: hsn,
            transaction_count: data.count,
            total_quantity: data.quantity,
            taxable_value: roundTo2(data.taxable),
            total_tax: roundTo2(data.tax),
        }))
        .sort((a, b) => b.taxable_value - a.taxable_value);
}

function getStateSummary(transactions: Transaction[]) {
    const stateNames: Record<string, string> = {
        '01': 'Jammu & Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab',
        '04': 'Chandigarh', '05': 'Uttarakhand', '06': 'Haryana',
        '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
        '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh',
        '13': 'Nagaland', '14': 'Manipur', '15': 'Mizoram',
        '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam',
        '19': 'West Bengal', '20': 'Jharkhand', '21': 'Odisha',
        '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
        '27': 'Maharashtra', '29': 'Karnataka', '30': 'Goa',
        '32': 'Kerala', '33': 'Tamil Nadu', '36': 'Telangana',
        '37': 'Andhra Pradesh',
    };

    const grouped: Record<string, { count: number; taxable: number; igst: number; cgst: number; sgst: number }> = {};

    for (const txn of transactions) {
        const state = txn.state_code || 'UNKNOWN';
        if (!grouped[state]) {
            grouped[state] = { count: 0, taxable: 0, igst: 0, cgst: 0, sgst: 0 };
        }
        grouped[state].count++;
        grouped[state].taxable += txn.taxable_value;
        grouped[state].igst += txn.igst;
        grouped[state].cgst += txn.cgst;
        grouped[state].sgst += txn.sgst;
    }

    return Object.entries(grouped)
        .map(([code, data]) => ({
            state_code: code,
            state_name: stateNames[code] || 'Unknown',
            transaction_count: data.count,
            taxable_value: roundTo2(data.taxable),
            igst: roundTo2(data.igst),
            cgst: roundTo2(data.cgst),
            sgst: roundTo2(data.sgst),
        }))
        .sort((a, b) => b.taxable_value - a.taxable_value);
}

function getPlatformSummary(transactions: Transaction[]) {
    const grouped: Record<string, { count: number; sales: number; tax: number }> = {};

    for (const txn of transactions) {
        const platform = txn.platform_name || 'Unknown';
        if (!grouped[platform]) {
            grouped[platform] = { count: 0, sales: 0, tax: 0 };
        }
        grouped[platform].count++;
        grouped[platform].sales += txn.sale_price;
        grouped[platform].tax += txn.igst + txn.cgst + txn.sgst;
    }

    return Object.entries(grouped)
        .map(([platform, data]) => ({
            platform,
            transaction_count: data.count,
            total_sales: roundTo2(data.sales),
            total_tax: roundTo2(data.tax),
        }))
        .sort((a, b) => b.total_sales - a.total_sales);
}

function getMonthlySummary(transactions: Transaction[]) {
    const grouped: Record<string, { count: number; sales: number; tax: number }> = {};

    for (const txn of transactions) {
        const date = new Date(txn.transaction_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!grouped[monthKey]) {
            grouped[monthKey] = { count: 0, sales: 0, tax: 0 };
        }
        grouped[monthKey].count++;
        grouped[monthKey].sales += txn.sale_price;
        grouped[monthKey].tax += txn.igst + txn.cgst + txn.sgst;
    }

    return Object.entries(grouped)
        .map(([month, data]) => ({
            month,
            transaction_count: data.count,
            total_sales: roundTo2(data.sales),
            total_tax: roundTo2(data.tax),
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
}

// Utility functions
function escapeCSV(str: string): string {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function formatDate(date: Date | string): string {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function roundTo2(num: number): number {
    return Math.round(num * 100) / 100;
}
