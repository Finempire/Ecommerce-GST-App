import fs from 'fs';
import path from 'path';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';

// Platform-specific parsers
const platformParsers: Record<string, (data: any[]) => ParsedTransaction[]> = {
    'Amazon': parseAmazonData,
    'Flipkart': parseFlipkartData,
    'Meesho': parseMeeshoData,
    'Myntra': parseMyntraData,
    'Glowroad': parseGenericEcommerceData,
    'Jio Mart': parseGenericEcommerceData,
    'LimeRoad': parseGenericEcommerceData,
    'Snapdeal': parseGenericEcommerceData,
    'Shop 101': parseGenericEcommerceData,
    'Paytm': parsePaytmData,
    'Bank Statement': parseBankStatement,
};

interface ParsedTransaction {
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
}

export async function processFile(uploadId: string, filePath: string, platformName: string): Promise<void> {
    try {
        // Update status to processing
        await query('UPDATE uploads SET status = $1, processed_at = NOW() WHERE id = $2', ['processing', uploadId]);

        const ext = path.extname(filePath).toLowerCase();
        let rawData: any[];

        // Parse file based on extension
        if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
            rawData = parseExcelOrCSV(filePath);
        } else if (ext === '.json') {
            const content = fs.readFileSync(filePath, 'utf-8');
            rawData = JSON.parse(content);
        } else if (ext === '.pdf') {
            rawData = await parsePDF(filePath);
        } else {
            throw new Error(`Unsupported file type: ${ext}`);
        }

        // Get appropriate parser
        const parser = platformParsers[platformName] || parseGenericEcommerceData;
        const transactions = parser(rawData);

        // Insert transactions into database
        for (const txn of transactions) {
            await query(
                `INSERT INTO transactions 
         (id, upload_id, order_id, transaction_date, description, quantity, sale_price, 
          taxable_value, gst_rate, igst, cgst, sgst, hsn_code, state_code, product_name, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())`,
                [
                    uuidv4(),
                    uploadId,
                    txn.order_id,
                    txn.transaction_date,
                    txn.description,
                    txn.quantity,
                    txn.sale_price,
                    txn.taxable_value,
                    txn.gst_rate,
                    txn.igst,
                    txn.cgst,
                    txn.sgst,
                    txn.hsn_code,
                    txn.state_code,
                    txn.product_name || '',
                ]
            );
        }

        // Update status to completed
        await query('UPDATE uploads SET status = $1, processed_at = NOW() WHERE id = $2', ['completed', uploadId]);

    } catch (error) {
        console.error('File processing error:', error);
        await query('UPDATE uploads SET status = $1, error_message = $2 WHERE id = $3',
            ['error', (error as Error).message, uploadId]);
    }
}

function parseExcelOrCSV(filePath: string): any[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
}

async function parsePDF(filePath: string): Promise<any[]> {
    // Try Google Vision API first for better OCR
    try {
        const { parseBankStatementPDF } = await import('./vision.service');
        console.log('Using Google Vision API for PDF parsing...');

        const bankData = await parseBankStatementPDF(filePath);

        // Convert Vision API results to standard format
        return bankData.transactions.map(txn => ({
            date: txn.date,
            description: txn.description,
            amount: txn.credit || txn.debit || 0,
            type: txn.credit ? 'credit' : 'debit',
            reference: txn.reference,
            balance: txn.balance,
            mode: txn.mode,
        }));
    } catch (visionError) {
        console.warn('Vision API failed, falling back to pdf-parse:', visionError);

        // Fallback to basic PDF text extraction
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);

        // Parse text into lines and extract transactions
        const lines = data.text.split('\n').filter((line: string) => line.trim());
        const transactions: any[] = [];

        // Simple pattern matching for bank statement lines
        const datePattern = /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/;
        const amountPattern = /([\d,]+\.\d{2})/g;

        for (const line of lines) {
            const dateMatch = line.match(datePattern);
            const amounts = line.match(amountPattern);

            if (dateMatch && amounts && amounts.length >= 1) {
                transactions.push({
                    date: dateMatch[1],
                    description: line.replace(datePattern, '').replace(amountPattern, '').trim(),
                    amount: parseFloat(amounts[0].replace(/,/g, '')),
                    type: amounts.length > 1 ? 'debit' : 'credit',
                });
            }
        }

        return transactions;
    }
}

// Platform-specific parsers
function parseAmazonData(data: any[]): ParsedTransaction[] {
    return data.map((row) => {
        const salePrice = parseFloat(row['item-price'] || row['Sale Price'] || 0);
        const gstRate = determineGSTRate(row['hsn'] || row['HSN Code'] || '');
        const taxableValue = salePrice / (1 + gstRate / 100);
        const totalTax = salePrice - taxableValue;
        const isInterstate = (row['ship-state'] || '') !== 'Maharashtra'; // Default seller state

        return {
            order_id: row['order-id'] || row['Order ID'] || uuidv4(),
            transaction_date: parseDate(row['purchase-date'] || row['Order Date']),
            description: row['product-name'] || row['Product Name'] || 'Amazon Sale',
            quantity: parseInt(row['quantity-purchased'] || row['Qty'] || 1),
            sale_price: salePrice,
            taxable_value: taxableValue,
            gst_rate: gstRate,
            igst: isInterstate ? totalTax : 0,
            cgst: isInterstate ? 0 : totalTax / 2,
            sgst: isInterstate ? 0 : totalTax / 2,
            hsn_code: row['hsn'] || row['HSN Code'] || '',
            state_code: getStateCode(row['ship-state'] || row['State'] || ''),
            product_name: row['product-name'] || row['Product Name'],
        };
    });
}

function parseFlipkartData(data: any[]): ParsedTransaction[] {
    return data.map((row) => {
        const salePrice = parseFloat(row['Selling Price'] || row['Order Item Value'] || 0);
        const gstRate = parseFloat(row['GST Rate'] || determineGSTRate(row['HSN'] || ''));
        const taxableValue = salePrice / (1 + gstRate / 100);
        const totalTax = salePrice - taxableValue;
        const isInterstate = (row['Shipping State'] || '') !== 'Maharashtra';

        return {
            order_id: row['Order ID'] || row['Order Item ID'] || uuidv4(),
            transaction_date: parseDate(row['Order Date'] || row['Order Creation Date']),
            description: row['Product Name'] || row['SKU'] || 'Flipkart Sale',
            quantity: parseInt(row['Quantity'] || 1),
            sale_price: salePrice,
            taxable_value: taxableValue,
            gst_rate: gstRate,
            igst: isInterstate ? totalTax : 0,
            cgst: isInterstate ? 0 : totalTax / 2,
            sgst: isInterstate ? 0 : totalTax / 2,
            hsn_code: row['HSN'] || '',
            state_code: getStateCode(row['Shipping State'] || ''),
            product_name: row['Product Name'],
        };
    });
}

function parseMeeshoData(data: any[]): ParsedTransaction[] {
    return data.map((row) => {
        const salePrice = parseFloat(row['Selling Price'] || row['Product Price'] || 0);
        const gstRate = parseFloat(row['GST%'] || row['Tax Rate'] || 5);
        const taxableValue = salePrice / (1 + gstRate / 100);
        const totalTax = salePrice - taxableValue;
        const isInterstate = (row['State'] || '') !== 'Maharashtra';

        return {
            order_id: row['Order ID'] || row['Sub Order No'] || uuidv4(),
            transaction_date: parseDate(row['Order Date'] || row['Created At']),
            description: row['SKU Name'] || row['Product'] || 'Meesho Sale',
            quantity: parseInt(row['Quantity'] || 1),
            sale_price: salePrice,
            taxable_value: taxableValue,
            gst_rate: gstRate,
            igst: isInterstate ? totalTax : 0,
            cgst: isInterstate ? 0 : totalTax / 2,
            sgst: isInterstate ? 0 : totalTax / 2,
            hsn_code: row['HSN'] || row['HSN Code'] || '',
            state_code: getStateCode(row['State'] || ''),
            product_name: row['SKU Name'] || row['Product'],
        };
    });
}

function parseMyntraData(data: any[]): ParsedTransaction[] {
    return parseGenericEcommerceData(data);
}

function parsePaytmData(data: any[]): ParsedTransaction[] {
    return data.map((row) => {
        const salePrice = parseFloat(row['Amount'] || row['Order Value'] || 0);
        const gstRate = parseFloat(row['GST Rate'] || 18);
        const taxableValue = salePrice / (1 + gstRate / 100);
        const totalTax = salePrice - taxableValue;

        return {
            order_id: row['Order ID'] || row['Transaction ID'] || uuidv4(),
            transaction_date: parseDate(row['Date'] || row['Order Date']),
            description: row['Product'] || row['Description'] || 'Paytm Sale',
            quantity: parseInt(row['Qty'] || 1),
            sale_price: salePrice,
            taxable_value: taxableValue,
            gst_rate: gstRate,
            igst: totalTax,
            cgst: 0,
            sgst: 0,
            hsn_code: row['HSN'] || '',
            state_code: getStateCode(row['State'] || ''),
            product_name: row['Product'],
        };
    });
}

function parseBankStatement(data: any[]): ParsedTransaction[] {
    return data.map((row) => ({
        order_id: row['Reference'] || row['Ref No'] || uuidv4(),
        transaction_date: parseDate(row['date'] || row['Date'] || row['Transaction Date']),
        description: row['description'] || row['Narration'] || row['Description'] || '',
        quantity: 1,
        sale_price: row['amount'] || parseFloat(row['Credit'] || row['Debit'] || 0),
        taxable_value: row['amount'] || parseFloat(row['Credit'] || row['Debit'] || 0),
        gst_rate: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        hsn_code: '',
        state_code: '',
        product_name: 'Bank Transaction',
    }));
}

function parseGenericEcommerceData(data: any[]): ParsedTransaction[] {
    return data.map((row) => {
        // Try to find common column names
        const salePrice = parseFloat(
            row['Sale Price'] || row['Selling Price'] || row['Amount'] ||
            row['Order Value'] || row['Item Price'] || 0
        );
        const gstRate = parseFloat(row['GST Rate'] || row['Tax Rate'] || row['GST%'] || 18);
        const taxableValue = salePrice / (1 + gstRate / 100);
        const totalTax = salePrice - taxableValue;

        return {
            order_id: row['Order ID'] || row['OrderID'] || row['Order No'] || uuidv4(),
            transaction_date: parseDate(row['Date'] || row['Order Date'] || row['Created Date']),
            description: row['Product'] || row['Product Name'] || row['Item'] || row['Description'] || 'Sale',
            quantity: parseInt(row['Quantity'] || row['Qty'] || 1),
            sale_price: salePrice,
            taxable_value: taxableValue,
            gst_rate: gstRate,
            igst: totalTax,
            cgst: 0,
            sgst: 0,
            hsn_code: row['HSN'] || row['HSN Code'] || '',
            state_code: getStateCode(row['State'] || row['Ship State'] || ''),
            product_name: row['Product'] || row['Product Name'] || row['Item'],
        };
    });
}

// Helper functions
function parseDate(dateStr: string | undefined): Date {
    if (!dateStr) return new Date();

    // Handle different date formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;

    // Try DD/MM/YYYY format
    const parts = dateStr.split(/[\/\-]/);
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    return new Date();
}

function determineGSTRate(hsnCode: string): number {
    // Simplified GST rate determination based on HSN
    const hsn = hsnCode.substring(0, 2);

    // Essential goods (0%, 5%)
    if (['01', '02', '03', '04', '07', '08', '09', '10'].includes(hsn)) return 5;

    // Standard goods (12%, 18%)
    if (['61', '62', '63', '64', '65'].includes(hsn)) return 12; // Textiles
    if (['84', '85', '90'].includes(hsn)) return 18; // Electronics

    // Luxury goods (28%)
    if (['87', '71'].includes(hsn)) return 28; // Vehicles, Jewelry

    return 18; // Default rate
}

function getStateCode(stateName: string): string {
    const stateCodes: Record<string, string> = {
        'Andhra Pradesh': '37', 'Arunachal Pradesh': '12', 'Assam': '18',
        'Bihar': '10', 'Chhattisgarh': '22', 'Delhi': '07', 'Goa': '30',
        'Gujarat': '24', 'Haryana': '06', 'Himachal Pradesh': '02',
        'Jharkhand': '20', 'Karnataka': '29', 'Kerala': '32',
        'Madhya Pradesh': '23', 'Maharashtra': '27', 'Manipur': '14',
        'Meghalaya': '17', 'Mizoram': '15', 'Nagaland': '13',
        'Odisha': '21', 'Punjab': '03', 'Rajasthan': '08',
        'Sikkim': '11', 'Tamil Nadu': '33', 'Telangana': '36',
        'Tripura': '16', 'Uttar Pradesh': '09', 'Uttarakhand': '05',
        'West Bengal': '19',
    };

    return stateCodes[stateName] || '';
}
