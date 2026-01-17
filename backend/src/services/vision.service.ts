// OCR.space API Service for Bank Statement PDF Parsing

import axios from 'axios';
import FormData from 'form-data';
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

/**
 * Extract text from PDF using OCR.space API
 */
export async function extractTextFromPDF(pdfPath: string): Promise<string> {
    const apiKey = process.env.OCR_SPACE_API_KEY;
    if (!apiKey) {
        throw new Error('OCR_SPACE_API_KEY is not configured in .env');
    }

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(pdfPath));
        formData.append('apikey', apiKey);
        formData.append('language', 'eng');
        formData.append('isTable', 'true'); // Important for bank statements
        formData.append('OCREngine', '2'); // Engine 2 is better for numbers and special characters

        const response = await axios.post('https://api.ocr.space/parse/image', formData, {
            headers: {
                ...formData.getHeaders(),
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        });

        if (response.data.IsErroredOnProcessing) {
            throw new Error(`OCR.space Error: ${response.data.ErrorMessage}`);
        }

        if (!response.data.ParsedResults || response.data.ParsedResults.length === 0) {
            throw new Error('No text parsed from document');
        }

        // Aggregate text from all pages
        let fullText = '';
        for (const page of response.data.ParsedResults) {
            fullText += page.ParsedText + '\n';
        }

        return fullText;

    } catch (error: any) {
        console.error('OCR.space API error:', error.response?.data || error.message);
        throw new Error('Failed to extract text using OCR.space API');
    }
}

/**
 * Parse bank statement text into structured data
 * (Reusing existing logic as OCR.space returns text similarly)
 */
export function parseBankStatementText(text: string): BankStatementData {
    // OCR.space Engine 2 might output slightly different spacing/newlines
    // Normalizing text: replace \r\n with \n
    const normalizedText = text.replace(/\r\n/g, '\n');

    const lines = normalizedText.split('\n').map(line => line.trim()).filter(line => line);
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
            /(?:Name)\s*[:\s]*([A-Z\s.]+)/i
        ];

        for (const pattern of namePatterns) {
            const match = line.match(pattern);
            if (match && !accountHolder) {
                // Filter out common labels that might match
                const candidate = match[1].trim();
                if (!['BANK', 'STATEMENT', 'DATE', 'PAGE'].includes(candidate)) {
                    accountHolder = candidate;
                }
                break;
            }
        }

        // Opening/Closing balance
        // OCR.space might separate labels and values more clearly or merge them
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
    const amountPattern = /([\d,]+\.?\d{2})/g; // More strict on 2 decimal places for accuracy? 
    // Relaxed to catch integers or 2 decimals
    const relaxedAmountPattern = /([\d,]+\.?\d*)/g;

    // Use relaxed but ignore single small numbers which might be dates parts or serial numbers if extracted badly
    const amounts: number[] = [];
    let match;

    while ((match = relaxedAmountPattern.exec(line)) !== null) {
        // Filter: amount must not be a date part (e.g. 2023) if it appears in date
        // But amount could be anything.
        // Let's rely on basic parsing first.
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

    // Clean up description
    description = description.replace(/^[\s\W]+|[\s\W]+$/g, '');

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
    // OCR Engine 2 preserves table structure often by spacing
    // But since we split by line, we rely on token order
    let debit: number | undefined;
    let credit: number | undefined;
    let balance: number | undefined;

    const isDebit = /DR|DEBIT|PAID|WITHDRAWN|TRANSFER\s*TO/i.test(line);
    const isCredit = /CR|CREDIT|RECEIVED|DEPOSITED|TRANSFER\s*FROM/i.test(line);

    // Heuristics for amounts if multiple found
    if (amounts.length >= 2) {
        // Typically: [Withdrawal, Deposit, Balance] or [Amount, Balance]
        // If we have 3 amounts: likely Debit, Credit, Balance (one being 0 or missing in text, but extracted as list)
        // With regex, we only capture numbers.

        // If 2 amounts: Could be (Debit, Balance) or (Credit, Balance)
        // Logic: Balance is usually the last one and largest? No, balance varies.
        // Usually Balance is the last number in the line.
        balance = amounts[amounts.length - 1];

        const transactionAmount = amounts[0]; // First number is likely the txn amount

        if (isCredit) {
            credit = transactionAmount;
        } else if (isDebit) {
            debit = transactionAmount;
        } else {
            // No clear keyword, guess based on logic? 
            // In a simple generic parser, hard to be 100% sure without column position.
            // Default to debit if unknown, or maybe check if there's a middle number?
            if (amounts.length === 3) {
                // Am1, Am2, Am3 -> likely Debit (Am1), Credit (Am2), Balance (Am3)
                // One of Am1 or Am2 is usually 0 if it was captured as 0.00
                // But regex excludes 0.
                // This is tricky. Let's assume Credit if description says Deposit?
            }
            // Fallback: Assume debit for safety? Or leave undefined?
            debit = transactionAmount; // Most txns are debits (expenses)
        }
    } else if (amounts.length === 1) {
        // Only one amount found. Is it the txn amount or balance?
        // Usually txn amount.
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
