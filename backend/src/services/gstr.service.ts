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

interface GSTR1Data {
    gstin: string;
    fp: string;
    gt: number;
    cur_gt: number;
    b2b: B2BInvoice[];
    b2cs: B2CSummary[];
    hsn: HSNSummary;
    docs: DocumentSummary;
}

interface B2BInvoice {
    ctin: string;
    inv: Invoice[];
}

interface Invoice {
    inum: string;
    idt: string;
    val: number;
    pos: string;
    rchrg: string;
    inv_typ: string;
    itms: InvoiceItem[];
}

interface InvoiceItem {
    num: number;
    itm_det: {
        rt: number;
        txval: number;
        iamt: number;
        camt: number;
        samt: number;
        csamt: number;
    };
}

interface B2CSummary {
    pos: string;
    sply_ty: string;
    rt: number;
    typ: string;
    txval: number;
    iamt: number;
    camt: number;
    samt: number;
    csamt: number;
}

interface HSNSummary {
    data: HSNItem[];
}

interface HSNItem {
    num: number;
    hsn_sc: string;
    desc: string;
    uqc: string;
    qty: number;
    val: number;
    txval: number;
    iamt: number;
    camt: number;
    samt: number;
    csamt: number;
}

interface DocumentSummary {
    doc_det: DocDetail[];
}

interface DocDetail {
    doc_num: number;
    doc_typ: string;
    docs: {
        num: number;
        from: string;
        to: string;
        totnum: number;
        cancel: number;
        net_issue: number;
    }[];
}

export function generateGSTR1(transactions: Transaction[]): string {
    const currentDate = new Date();
    const financialPeriod = `${String(currentDate.getMonth() + 1).padStart(2, '0')}${currentDate.getFullYear()}`;

    // Group by state for B2CS (B2C Small)
    const stateWiseB2CS = groupByStateAndRate(transactions);

    // Generate HSN summary
    const hsnSummary = generateHSNSummary(transactions);

    // Calculate totals
    const totalValue = transactions.reduce((sum, t) => sum + t.sale_price, 0);

    const gstr1Data: GSTR1Data = {
        gstin: 'YOUR_GSTIN_HERE', // To be filled by user
        fp: financialPeriod,
        gt: totalValue,
        cur_gt: totalValue,
        b2b: [], // B2B invoices (requires customer GSTIN)
        b2cs: stateWiseB2CS,
        hsn: hsnSummary,
        docs: generateDocumentSummary(transactions),
    };

    return JSON.stringify(gstr1Data, null, 2);
}

function groupByStateAndRate(transactions: Transaction[]): B2CSummary[] {
    const grouped: Record<string, B2CSummary> = {};

    for (const txn of transactions) {
        const key = `${txn.state_code}_${txn.gst_rate}`;
        const isInterstate = txn.igst > 0;

        if (!grouped[key]) {
            grouped[key] = {
                pos: txn.state_code || '27', // Default to Maharashtra
                sply_ty: isInterstate ? 'INTER' : 'INTRA',
                rt: txn.gst_rate,
                typ: 'OE', // Outward Supply (E-commerce)
                txval: 0,
                iamt: 0,
                camt: 0,
                samt: 0,
                csamt: 0, // Cess
            };
        }

        grouped[key].txval += txn.taxable_value;
        grouped[key].iamt += txn.igst;
        grouped[key].camt += txn.cgst;
        grouped[key].samt += txn.sgst;
    }

    return Object.values(grouped).map((item) => ({
        ...item,
        txval: roundTo2(item.txval),
        iamt: roundTo2(item.iamt),
        camt: roundTo2(item.camt),
        samt: roundTo2(item.samt),
        csamt: roundTo2(item.csamt),
    }));
}

function generateHSNSummary(transactions: Transaction[]): HSNSummary {
    const hsnGrouped: Record<string, HSNItem> = {};

    transactions.forEach((txn, index) => {
        const hsn = txn.hsn_code || 'UNKNOWN';

        if (!hsnGrouped[hsn]) {
            hsnGrouped[hsn] = {
                num: Object.keys(hsnGrouped).length + 1,
                hsn_sc: hsn,
                desc: txn.description.substring(0, 30),
                uqc: 'NOS-NUMBERS',
                qty: 0,
                val: 0,
                txval: 0,
                iamt: 0,
                camt: 0,
                samt: 0,
                csamt: 0,
            };
        }

        hsnGrouped[hsn].qty += txn.quantity;
        hsnGrouped[hsn].val += txn.sale_price;
        hsnGrouped[hsn].txval += txn.taxable_value;
        hsnGrouped[hsn].iamt += txn.igst;
        hsnGrouped[hsn].camt += txn.cgst;
        hsnGrouped[hsn].samt += txn.sgst;
    });

    return {
        data: Object.values(hsnGrouped).map((item) => ({
            ...item,
            val: roundTo2(item.val),
            txval: roundTo2(item.txval),
            iamt: roundTo2(item.iamt),
            camt: roundTo2(item.camt),
            samt: roundTo2(item.samt),
        })),
    };
}

function generateDocumentSummary(transactions: Transaction[]): DocumentSummary {
    // Group transactions by date to simulate invoice numbering
    const dates = [...new Set(transactions.map((t) =>
        new Date(t.transaction_date).toISOString().split('T')[0]
    ))].sort();

    return {
        doc_det: [
            {
                doc_num: 1,
                doc_typ: 'Invoices for outward supply',
                docs: [
                    {
                        num: 1,
                        from: `ECOM/2026/00001`,
                        to: `ECOM/2026/${String(transactions.length).padStart(5, '0')}`,
                        totnum: transactions.length,
                        cancel: 0,
                        net_issue: transactions.length,
                    },
                ],
            },
        ],
    };
}

// Table 14 & 15 for E-commerce operators
export function generateTable14And15(transactions: Transaction[], operatorGSTIN: string): object {
    // Table 14: Amendments to taxable outward supply details
    // Table 15: Amendments to exempt, nil-rated and non-GST outward supply

    const table14 = {
        ecom: transactions.map((txn) => ({
            etin: operatorGSTIN,
            diff_percent: 0.1, // TCS rate
            inv: {
                inum: txn.order_id,
                idt: formatDate(txn.transaction_date),
                val: roundTo2(txn.sale_price),
                txval: roundTo2(txn.taxable_value),
                iamt: roundTo2(txn.igst),
                camt: roundTo2(txn.cgst),
                samt: roundTo2(txn.sgst),
            },
        })),
    };

    return table14;
}

// Utility functions
function roundTo2(num: number): number {
    return Math.round(num * 100) / 100;
}

function formatDate(date: Date | string): string {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}
