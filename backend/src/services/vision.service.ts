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
        formData.append('scale', 'true'); // Improve OCR accuracy for smaller text
        formData.append('detectOrientation', 'true');
        formData.append('isOverlayRequired', 'false');
        formData.append('filetype', 'PDF');

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

    const lines = normalizedText
        .split('\n')
        .map(line => line.replace(/\s+/g, ' ').trim())
        .filter(line => line);
    const combinedLines: string[] = [];
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

    const dateLinePattern = /^(\d{2}[\/\-]\d{2}[\/\-]\d{2,4}|\d{2}\s+[A-Za-z]{3}\s+\d{2,4})/;
    const headerPattern = /(date|narration|description|withdrawal|deposit|credit|debit|balance|chq|ref|transaction)/i;

    for (const line of lines) {
        if (headerPattern.test(line)) {
            continue;
        }

        if (dateLinePattern.test(line)) {
            combinedLines.push(line);
            continue;
        }

        if (combinedLines.length > 0) {
            combinedLines[combinedLines.length - 1] = `${combinedLines[combinedLines.length - 1]} ${line}`.trim();
        }
    }

    // Parse transactions
    // Common date formats in Indian bank statements
    const datePatterns = [
        /(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})/,  // DD/MM/YYYY or DD-MM-YYYY
        /(\d{2}\s+[A-Za-z]{3}\s+\d{2,4})/,   // DD MMM YYYY
    ];

    for (let i = 0; i < combinedLines.length; i++) {
        const line = combinedLines[i];

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
    const lineWithoutDate = line.replace(date, '').replace(/\s+/g, ' ').trim();
    const amountPattern = /\b\d{1,3}(?:,\d{3})*(?:\.\d{2})\b|\b\d+\.\d{2}\b/g;
    const relaxedAmountPattern = /\b\d[\d,]*\.?\d*\b/g;
    const amountMatches = lineWithoutDate.match(amountPattern) || lineWithoutDate.match(relaxedAmountPattern) || [];
    const amounts = amountMatches
        .map((match) => parseAmount(match))
        .filter((amount) => amount > 0);

    if (amounts.length === 0) return null;

    const isDebit = /DR|DEBIT|PAID|WITHDRAWN|TRANSFER\s*TO|WITHDRAWAL/i.test(lineWithoutDate);
    const isCredit = /CR|CREDIT|RECEIVED|DEPOSITED|TRANSFER\s*FROM|DEPOSIT/i.test(lineWithoutDate);

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
        if (mp.pattern.test(lineWithoutDate)) {
            mode = mp.mode;
            break;
        }
    }

    let reference: string | undefined;
    const referencePatterns = [
        /(?:UTR|UPI|IMPS|NEFT|RTGS|RRN|REF|CHQ|CHEQUE)\s*[:\-]?\s*([A-Z0-9\/-]{6,})/i,
        /\b[A-Z0-9]{10,}\b/
    ];

    for (const pattern of referencePatterns) {
        const match = lineWithoutDate.match(pattern);
        if (match) {
            reference = match[1] || match[0];
            break;
        }
    }

    let description = lineWithoutDate
        .replace(relaxedAmountPattern, '')
        .replace(/\bCR\b|\bDR\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (reference) {
        description = description.replace(reference, '').replace(/\s+/g, ' ').trim();
    }

    description = description.replace(/^[\s\W]+|[\s\W]+$/g, '');

    let debit: number | undefined;
    let credit: number | undefined;
    let balance: number | undefined;

    if (amounts.length >= 3) {
        const lastThree = amounts.slice(-3);
        const [possibleDebit, possibleCredit, possibleBalance] = lastThree;
        balance = possibleBalance;
        if (isCredit && !isDebit) {
            credit = possibleCredit || possibleDebit;
        } else if (isDebit && !isCredit) {
            debit = possibleDebit;
        } else {
            debit = possibleDebit;
            credit = possibleCredit;
        }
    } else if (amounts.length === 2) {
        const [transactionAmount, possibleBalance] = amounts.slice(-2);
        balance = possibleBalance;
        if (isCredit && !isDebit) {
            credit = transactionAmount;
        } else if (isDebit && !isCredit) {
            debit = transactionAmount;
        } else {
            debit = transactionAmount;
        }
    } else {
        if (isCredit && !isDebit) {
            credit = amounts[0];
        } else {
            debit = amounts[0];
        }
    }

    return {
        date: normalizeDate(date),
        description: description.substring(0, 100),
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
