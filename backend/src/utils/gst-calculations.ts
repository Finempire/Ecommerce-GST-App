// GST Calculation Utilities

import { GSTBreakdown, GSTRate, GST_RATES } from '../models/transaction.model';

/**
 * Calculate taxable value from sale price (inclusive of GST)
 */
export function calculateTaxableValue(salePrice: number, gstRate: number): number {
    return roundTo2(salePrice / (1 + gstRate / 100));
}

/**
 * Calculate tax from taxable value
 */
export function calculateTax(taxableValue: number, gstRate: number): number {
    return roundTo2(taxableValue * (gstRate / 100));
}

/**
 * Split GST into CGST/SGST (intra-state) or IGST (inter-state)
 * @param taxableValue - Taxable value before GST
 * @param gstRate - GST rate in percentage
 * @param isInterState - True if buyer is in different state
 */
export function calculateGSTBreakdown(
    taxableValue: number,
    gstRate: number,
    isInterState: boolean
): GSTBreakdown {
    const totalTax = calculateTax(taxableValue, gstRate);

    if (isInterState) {
        return {
            taxable_value: roundTo2(taxableValue),
            gst_rate: gstRate,
            igst: roundTo2(totalTax),
            cgst: 0,
            sgst: 0,
            cess: 0,
            total_tax: roundTo2(totalTax),
            total_value: roundTo2(taxableValue + totalTax),
        };
    } else {
        const halfTax = roundTo2(totalTax / 2);
        return {
            taxable_value: roundTo2(taxableValue),
            gst_rate: gstRate,
            igst: 0,
            cgst: halfTax,
            sgst: halfTax,
            cess: 0,
            total_tax: roundTo2(totalTax),
            total_value: roundTo2(taxableValue + totalTax),
        };
    }
}

/**
 * Determine if transaction is inter-state based on seller and buyer state
 */
export function isInterStateTransaction(sellerStateCode: string, buyerStateCode: string): boolean {
    return sellerStateCode !== buyerStateCode;
}

/**
 * Get GST rate from HSN code (common mappings)
 */
export function getGSTRateFromHSN(hsnCode: string): GSTRate {
    const hsn = hsnCode.substring(0, 4);

    // Common HSN to GST rate mappings
    const hsnRateMap: Record<string, GSTRate> = {
        // 0% - Essential goods
        '0101': 0, '0102': 0, '0201': 0, '0401': 0, '0701': 0, '0702': 0,
        '0713': 0, '1001': 0, '1006': 0, '1101': 0, '1901': 0,

        // 5% - Basic necessities
        '0402': 5, '0403': 5, '0901': 5, '0902': 5, '1702': 5,
        '1905': 5, '2201': 5, '2501': 5, '4901': 5, '4902': 5,

        // 12% - Standard processed goods
        '1704': 12, '1806': 12, '2009': 12, '2101': 12, '2104': 12,
        '3304': 12, '3305': 12, '3401': 12, '4016': 12, '4819': 12,
        '8443': 12, '8471': 12,

        // 18% - Standard rate (default for most goods)
        '2106': 18, '3808': 18, '3917': 18, '3923': 18, '3926': 18,
        '6109': 18, '6110': 18, '6204': 18, '6205': 18, '6206': 18,
        '6403': 18, '6404': 18, '8414': 18, '8415': 18, '8418': 18,
        '8450': 18, '8508': 18, '8509': 18, '8516': 18, '8517': 18,
        '8518': 18, '8519': 18, '8523': 18, '8528': 18, '9403': 18,
        '9404': 18, '9503': 18, '9504': 18, '9505': 18,

        // 28% - Luxury goods
        '2402': 28, '2403': 28, '3303': 28, '8703': 28, '8711': 28,
        '9401': 28,
    };

    return hsnRateMap[hsn] ?? 18; // Default to 18% if not found
}

/**
 * Validate GST rate is a valid slab
 */
export function isValidGSTRate(rate: number): rate is GSTRate {
    return GST_RATES.includes(rate as GSTRate);
}

/**
 * Calculate reverse charge (for B2B purchases from unregistered)
 */
export function calculateReverseCharge(
    purchaseValue: number,
    gstRate: number,
    sellerStateCode: string,
    buyerStateCode: string
): GSTBreakdown {
    const isInterState = isInterStateTransaction(sellerStateCode, buyerStateCode);
    return calculateGSTBreakdown(purchaseValue, gstRate, isInterState);
}

/**
 * Calculate TCS by e-commerce operator (0.5% CGST + 0.5% SGST or 1% IGST)
 */
export function calculateTCS(netValue: number, isInterState: boolean): { cgst: number; sgst: number; igst: number } {
    if (isInterState) {
        return {
            igst: roundTo2(netValue * 0.01),
            cgst: 0,
            sgst: 0,
        };
    } else {
        const halfTCS = roundTo2(netValue * 0.005);
        return {
            igst: 0,
            cgst: halfTCS,
            sgst: halfTCS,
        };
    }
}

/**
 * Round to 2 decimal places
 */
export function roundTo2(num: number): number {
    return Math.round(num * 100) / 100;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
}

/**
 * Get financial year from date
 */
export function getFinancialYear(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth();

    if (month >= 3) { // April onwards
        return `${year}-${String(year + 1).slice(-2)}`;
    } else {
        return `${year - 1}-${String(year).slice(-2)}`;
    }
}

/**
 * Get financial period in MMYYYY format for GSTR
 */
export function getFinancialPeriod(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}${year}`;
}
