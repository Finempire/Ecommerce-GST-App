// Google Vision API Service for Bank Statement PDF Parsing

import vision from '@google-cloud/vision';
import fs from 'fs';
import path from 'path';

// Interface for parsed bank transaction
export interface BankTransaction {
    date: string;
    description: string;
    reference?: string;
    debit?: number;
    credit?: number;
    balance?: number;
    mode?: string;
}

export interface BankStatementData {
    accountNumber?: string;
    accountHolder?: string;
    bankName?: string;
    statementPeriod?: {
        from: string;
        to: string;
    };
    openingBalance?: number;
    closingBalance?: number;
    transactions: BankTransaction[];
}

// Initialize Vision client with service account
const credentialsPath = path.join(__dirname, '../../avid-circle-484606-b2-676385e540e9.json');

let visionClient: vision.ImageAnnotatorClient | null = null;

function getVisionClient(): vision.ImageAnnotatorClient {
    if (!visionClient) {
        if (fs.existsSync(credentialsPath)) {
            visionClient = new vision.ImageAnnotatorClient({
                keyFilename: credentialsPath,
            });
        } else {
            // Try environment variable
            visionClient = new vision.ImageAnnotatorClient();
        }
    }
    return visionClient;
}

/**
 * Extract text from PDF using Google Vision API
 */
export async function extractTextFromPDF(pdfPath: string): Promise<string> {
    const client = getVisionClient();

    // Read PDF file and convert to base64
    const pdfBuffer = fs.readFileSync(pdfPath);
    const base64Content = pdfBuffer.toString('base64');

    // Use document text detection for better PDF handling
    const request = {
        requests: [
            {
                inputConfig: {
                    mimeType: 'application/pdf',
                    content: base64Content,
                },
                features: [
                    {
                        type: 'DOCUMENT_TEXT_DETECTION' as const,
                    },
                ],
            },
        ],
    };

    try {
        const [result] = await client.batchAnnotateFiles(request);

        let fullText = '';

        if (result.responses) {
            for (const response of result.responses) {
                if (response.responses) {
                    for (const pageResponse of response.responses) {
                        if (pageResponse.fullTextAnnotation?.text) {
                            fullText += pageResponse.fullTextAnnotation.text + '\n';
                        }
                    }
                }
            }
        }

        return fullText;
    } catch (error) {
        console.error('Vision API error:', error);
        throw new Error('Failed to extract text from PDF using Vision API');
    }
}

/**
 * Parse bank statement text into structured data
 */
export function parseBankStatementText(text: string): BankStatementData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const transactions: BankTransaction[] = [];

    let accountNumber: string | undefined;
    let accountHolder: string | undefined;
    let bankName: string | undefined;
    let openingBalance: number | undefined;
    let closingBalance: number | undefined;

    // Detect bank name
    const bankPatterns = [
        { pattern: /HDFC|HDFC BANK/i, name: 'HDFC Bank' },
        { pattern: /ICICI|ICICI BANK/i, name: 'ICICI Bank' },
        { pattern: /SBI|STATE BANK/i, name: 'State Bank of India' },
        { pattern: /AXIS|AXIS BANK/i, name: 'Axis Bank' },
        { pattern: /KOTAK|KOTAK MAHINDRA/i, name: 'Kotak Mahindra Bank' },
        { pattern: /YES BANK/i, name: 'Yes Bank' },
        { pattern: /PUNJAB NATIONAL|PNB/i, name: 'Punjab National Bank' },
        { pattern: /BANK OF BARODA|BOB/i, name: 'Bank of Baroda' },
        { pattern: /CANARA BANK/i, name: 'Canara Bank' },
        { pattern: /UNION BANK/i, name: 'Union Bank of India' },
        { pattern: /INDUSIND/i, name: 'IndusInd Bank' },
        { pattern: /IDBI/i, name: 'IDBI Bank' },
    ];

    for (const line of lines) {
        // Detect bank
        for (const bp of bankPatterns) {
            if (bp.pattern.test(line) && !bankName) {
                bankName = bp.name;
                break;
            }
        }

        // Detect account number (various formats)
        const accountPatterns = [
            /Account\s*(?:No|Number|#)?[:\s]*([0-9]{9,18})/i,
            /A\/C\s*(?:No)?[:\s]*([0-9]{9,18})/i,
            /([0-9]{9,18})\s*(?:Savings|Current)/i,
        ];

        for (const pattern of accountPatterns) {
            const match = line.match(pattern);
            if (match && !accountNumber) {
                accountNumber = match[1];
                break;
            }
        }

        // Detect account holder name
        const namePatterns = [
            /(?:Name|Account Holder|Customer)[:\s]+([A-Z][A-Z\s]+)/i,
            /(?:Mr\.|Mrs\.|Ms\.|M\/S)\s+([A-Z][A-Z\s]+)/i,
        ];

        for (const pattern of namePatterns) {
            const match = line.match(pattern);
            if (match && !accountHolder) {
                accountHolder = match[1].trim();
                break;
            }
        }

        // Opening/Closing balance
        const openingMatch = line.match(/Opening\s*Balance[:\s]*([\d,]+\.?\d*)/i);
        if (openingMatch) {
            openingBalance = parseAmount(openingMatch[1]);
        }

        const closingMatch = line.match(/Closing\s*Balance[:\s]*([\d,]+\.?\d*)/i);
        if (closingMatch) {
            closingBalance = parseAmount(closingMatch[1]);
        }
    }

    // Parse transactions
    // Common date formats in Indian bank statements
    const datePatterns = [
        /(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})/,  // DD/MM/YYYY or DD-MM-YYYY
        /(\d{2}\s+[A-Za-z]{3}\s+\d{2,4})/,   // DD MMM YYYY
    ];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Try to find a date at the start of line
        let dateMatch: RegExpMatchArray | null = null;
        for (const pattern of datePatterns) {
            dateMatch = line.match(pattern);
            if (dateMatch) break;
        }

        if (dateMatch) {
            // This line likely contains a transaction
            const transaction = parseTransactionLine(line, dateMatch[1]);
            if (transaction) {
                transactions.push(transaction);
            }
        }
    }

    return {
        accountNumber,
        accountHolder,
        bankName,
        openingBalance,
        closingBalance,
        transactions,
    };
}

/**
 * Parse a single transaction line
 */
function parseTransactionLine(line: string, date: string): BankTransaction | null {
    // Extract amounts - looking for patterns like "1,234.56" or "1234.56"
    const amountPattern = /([\d,]+\.?\d*)/g;
    const amounts: number[] = [];
    let match;

    while ((match = amountPattern.exec(line)) !== null) {
        const amount = parseAmount(match[1]);
        if (amount > 0) {
            amounts.push(amount);
        }
    }

    if (amounts.length === 0) return null;

    // Extract description (text between date and amounts)
    let description = line
        .replace(date, '')
        .replace(/[\d,]+\.?\d*/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Detect transaction mode
    let mode: string | undefined;
    const modePatterns = [
        { pattern: /UPI|IMPS|NEFT|RTGS/i, mode: 'UPI/IMPS/NEFT' },
        { pattern: /ATM|CASH|CDM/i, mode: 'ATM/Cash' },
        { pattern: /CHEQUE|CHQ/i, mode: 'Cheque' },
        { pattern: /POS|SWIPE|CARD/i, mode: 'Card' },
        { pattern: /NET\s*BANKING|INTERNET/i, mode: 'Net Banking' },
        { pattern: /AUTO\s*DEBIT|SI|MANDATE/i, mode: 'Auto Debit' },
        { pattern: /EMI/i, mode: 'EMI' },
    ];

    for (const mp of modePatterns) {
        if (mp.pattern.test(description)) {
            mode = mp.mode;
            break;
        }
    }

    // Extract reference number
    let reference: string | undefined;
    const refMatch = description.match(/([A-Z0-9]{12,20})/);
    if (refMatch) {
        reference = refMatch[1];
    }

    // Determine debit/credit based on keywords or position
    let debit: number | undefined;
    let credit: number | undefined;
    let balance: number | undefined;

    const isDebit = /DR|DEBIT|PAID|WITHDRAWN|TRANSFER\s*TO/i.test(line);
    const isCredit = /CR|CREDIT|RECEIVED|DEPOSITED|TRANSFER\s*FROM/i.test(line);

    if (amounts.length >= 2) {
        // Usually: amount, balance format
        if (isDebit) {
            debit = amounts[0];
        } else if (isCredit) {
            credit = amounts[0];
        } else {
            // Default: first small amount is transaction, last is balance
            if (amounts.length >= 3) {
                debit = amounts[0] || undefined;
                credit = amounts[1] || undefined;
                balance = amounts[2];
            } else {
                debit = amounts[0];
                balance = amounts[1];
            }
        }
        balance = amounts[amounts.length - 1];
    } else if (amounts.length === 1) {
        if (isCredit) {
            credit = amounts[0];
        } else {
            debit = amounts[0];
        }
    }

    return {
        date: normalizeDate(date),
        description: description.substring(0, 100), // Limit length
        reference,
        debit,
        credit,
        balance,
        mode,
    };
}

/**
 * Parse amount string to number
 */
function parseAmount(amountStr: string): number {
    return parseFloat(amountStr.replace(/,/g, '')) || 0;
}

/**
 * Normalize date to YYYY-MM-DD format
 */
function normalizeDate(dateStr: string): string {
    // Try DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = dateStr.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{2,4})/);
    if (dmyMatch) {
        const day = dmyMatch[1];
        const month = dmyMatch[2];
        let year = dmyMatch[3];
        if (year.length === 2) {
            year = '20' + year;
        }
        return `${year}-${month}-${day}`;
    }

    // Try DD MMM YYYY
    const textMatch = dateStr.match(/(\d{2})\s+([A-Za-z]{3})\s+(\d{2,4})/);
    if (textMatch) {
        const day = textMatch[1];
        const monthName = textMatch[2].toUpperCase();
        let year = textMatch[3];
        if (year.length === 2) {
            year = '20' + year;
        }

        const months: Record<string, string> = {
            'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
            'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
            'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12',
        };

        const month = months[monthName] || '01';
        return `${year}-${month}-${day}`;
    }

    return dateStr;
}

/**
 * Main function to parse bank statement PDF
 */
export async function parseBankStatementPDF(pdfPath: string): Promise<BankStatementData> {
    console.log(`Processing bank statement: ${pdfPath}`);

    // Extract text using Vision API
    const text = await extractTextFromPDF(pdfPath);
    console.log(`Extracted ${text.length} characters from PDF`);

    // Parse the extracted text
    const data = parseBankStatementText(text);
    console.log(`Found ${data.transactions.length} transactions`);

    return data;
}

/**
 * Convert bank transactions to standard transaction format for GST processing
 */
export function convertToGSTTransactions(bankData: BankStatementData, uploadId: string) {
    return bankData.transactions.map((txn, index) => ({
        id: `${uploadId}-${index}`,
        upload_id: uploadId,
        order_id: txn.reference || `BANK-${Date.now()}-${index}`,
        transaction_date: new Date(txn.date),
        description: txn.description,
        quantity: 1,
        unit_price: txn.credit || txn.debit || 0,
        sale_price: txn.credit || 0,
        purchase_price: txn.debit || 0,
        taxable_value: (txn.credit || txn.debit || 0) / 1.18, // Assuming 18% GST
        gst_rate: 18,
        igst: 0,
        cgst: ((txn.credit || txn.debit || 0) / 1.18) * 0.09,
        sgst: ((txn.credit || txn.debit || 0) / 1.18) * 0.09,
        hsn_code: '999799', // Financial services
        state_code: '27', // Default Maharashtra
        platform_name: 'Bank Statement',
        mode: txn.mode,
        balance: txn.balance,
    }));
}
