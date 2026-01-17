import * as xml2js from 'xml2js';

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

export function generateTallyXML(transactions: Transaction[]): string {
    const vouchers = transactions.map((txn, index) => {
        const date = new Date(txn.transaction_date);
        const tallyDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

        const voucherNumber = `ECOM/${date.getFullYear()}/${String(index + 1).padStart(5, '0')}`;

        // Determine ledger names
        const partyLedger = txn.platform_name ? `${txn.platform_name} Sales` : 'E-commerce Sales';
        const salesLedger = 'Sales - E-commerce';

        // Tax ledgers
        const igstLedger = 'Output IGST';
        const cgstLedger = 'Output CGST';
        const sgstLedger = 'Output SGST';

        const ledgerEntries = [];

        // Party (Debit)
        ledgerEntries.push({
            LEDGERNAME: partyLedger,
            ISDEEMEDPOSITIVE: 'Yes',
            AMOUNT: -txn.sale_price,
        });

        // Sales (Credit)
        ledgerEntries.push({
            LEDGERNAME: salesLedger,
            ISDEEMEDPOSITIVE: 'No',
            AMOUNT: txn.taxable_value,
        });

        // Tax entries
        if (txn.igst > 0) {
            ledgerEntries.push({
                LEDGERNAME: igstLedger,
                ISDEEMEDPOSITIVE: 'No',
                AMOUNT: txn.igst,
            });
        }

        if (txn.cgst > 0) {
            ledgerEntries.push({
                LEDGERNAME: cgstLedger,
                ISDEEMEDPOSITIVE: 'No',
                AMOUNT: txn.cgst,
            });
        }

        if (txn.sgst > 0) {
            ledgerEntries.push({
                LEDGERNAME: sgstLedger,
                ISDEEMEDPOSITIVE: 'No',
                AMOUNT: txn.sgst,
            });
        }

        return {
            VOUCHER: {
                $: {
                    VCHTYPE: 'Sales',
                    ACTION: 'Create',
                },
                DATE: tallyDate,
                VOUCHERTYPENAME: 'Sales',
                VOUCHERNUMBER: voucherNumber,
                REFERENCE: txn.order_id,
                PARTYLEDGERNAME: partyLedger,
                NARRATION: `${txn.platform_name || 'E-commerce'} Sale - Order: ${txn.order_id} - ${txn.description}`,
                'ALLLEDGERENTRIES.LIST': ledgerEntries.map((entry) => ({
                    LEDGERNAME: entry.LEDGERNAME,
                    ISDEEMEDPOSITIVE: entry.ISDEEMEDPOSITIVE,
                    AMOUNT: entry.AMOUNT.toFixed(2),
                })),
                // Inventory entries (if applicable)
                'ALLINVENTORYENTRIES.LIST': {
                    STOCKITEMNAME: txn.product_name || txn.description,
                    ISDEEMEDPOSITIVE: 'No',
                    RATE: `${txn.sale_price / txn.quantity}/Nos`,
                    AMOUNT: txn.taxable_value.toFixed(2),
                    ACTUALQTY: `${txn.quantity} Nos`,
                    BILLEDQTY: `${txn.quantity} Nos`,
                },
                // GST Details
                GSTREGISTRATIONTYPE: 'Regular',
                PLACEOFSUPPLY: txn.state_code,
                // HSN Summary
                'HSNSUMMARIES.LIST': {
                    HSNCODE: txn.hsn_code,
                    TAXABLEAMOUNT: txn.taxable_value.toFixed(2),
                    IGSTAMOUNT: txn.igst.toFixed(2),
                    CGSTAMOUNT: txn.cgst.toFixed(2),
                    SGSTAMOUNT: txn.sgst.toFixed(2),
                },
            },
        };
    });

    const tallyEnvelope = {
        ENVELOPE: {
            HEADER: {
                TALLYREQUEST: 'Import Data',
            },
            BODY: {
                IMPORTDATA: {
                    REQUESTDESC: {
                        REPORTNAME: 'Vouchers',
                        STATICVARIABLES: {
                            SVCURRENTCOMPANY: 'Your Company Name',
                        },
                    },
                    REQUESTDATA: {
                        TALLYMESSAGE: vouchers,
                    },
                },
            },
        },
    };

    const builder = new xml2js.Builder({
        xmldec: { version: '1.0', encoding: 'UTF-8' },
        renderOpts: { pretty: true, indent: '  ' },
    });

    return builder.buildObject(tallyEnvelope);
}

// Generate ledger masters for new parties
export function generateLedgerMasters(platforms: string[]): string {
    const ledgers = platforms.map((platform) => ({
        LEDGER: {
            $: { NAME: `${platform} Sales`, ACTION: 'Create' },
            PARENT: 'Sundry Debtors',
            ISBILLWISEON: 'Yes',
            AFFECTSSTOCK: 'No',
            OPENINGBALANCE: '0',
            COUNTRYNAME: 'India',
            GSTREGISTRATIONTYPE: 'Consumer',
        },
    }));

    const envelope = {
        ENVELOPE: {
            HEADER: {
                TALLYREQUEST: 'Import Data',
            },
            BODY: {
                IMPORTDATA: {
                    REQUESTDESC: {
                        REPORTNAME: 'All Masters',
                    },
                    REQUESTDATA: {
                        TALLYMESSAGE: ledgers,
                    },
                },
            },
        },
    };

    const builder = new xml2js.Builder({
        xmldec: { version: '1.0', encoding: 'UTF-8' },
        renderOpts: { pretty: true, indent: '  ' },
    });

    return builder.buildObject(envelope);
}
