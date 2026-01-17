// Validation utility functions

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate Indian GSTIN format (15 characters)
 * Format: 22AAAAA0000A1Z5
 * - 2 digits state code
 * - 10 characters PAN
 * - 1 entity number
 * - 1 default 'Z'
 * - 1 checksum digit
 */
export function isValidGSTIN(gstin: string): boolean {
    if (!gstin || gstin.length !== 15) return false;

    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin.toUpperCase());
}

/**
 * Validate HSN code (4, 6, or 8 digits)
 */
export function isValidHSN(hsnCode: string): boolean {
    if (!hsnCode) return false;
    const cleanHSN = hsnCode.replace(/\s/g, '');
    const hsnRegex = /^[0-9]{4,8}$/;
    return hsnRegex.test(cleanHSN);
}

/**
 * Validate Indian PAN format (10 characters)
 */
export function isValidPAN(pan: string): boolean {
    if (!pan || pan.length !== 10) return false;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
}

/**
 * Validate Indian phone number (10 digits, optionally with +91)
 */
export function isValidPhoneNumber(phone: string): boolean {
    const cleanPhone = phone.replace(/[\s-+]/g, '');
    const phoneRegex = /^(91)?[6-9][0-9]{9}$/;
    return phoneRegex.test(cleanPhone);
}

/**
 * Validate password strength
 * - Minimum 8 characters
 * - At least one uppercase, one lowercase, one number
 */
export function isStrongPassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true, message: 'Password is strong' };
}

/**
 * Sanitize string input - remove special characters
 */
export function sanitizeString(input: string): string {
    return input.replace(/[<>"'&]/g, '').trim();
}

/**
 * Validate date string
 */
export function isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

/**
 * Validate amount (positive number with max 2 decimal places)
 */
export function isValidAmount(amount: number): boolean {
    return typeof amount === 'number' && amount >= 0 && Number.isFinite(amount);
}

/**
 * Extract state code from GSTIN
 */
export function getStateCodeFromGSTIN(gstin: string): string | null {
    if (!isValidGSTIN(gstin)) return null;
    return gstin.substring(0, 2);
}

/**
 * Validate file extension
 */
export function isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
    const ext = filename.toLowerCase().split('.').pop();
    return ext ? allowedExtensions.includes(`.${ext}`) : false;
}

/**
 * Validate request body has required fields
 */
export function validateRequiredFields<T extends object>(
    body: T,
    requiredFields: (keyof T)[]
): { valid: boolean; missing: string[] } {
    const missing = requiredFields.filter(field =>
        body[field] === undefined || body[field] === null || body[field] === ''
    );
    return {
        valid: missing.length === 0,
        missing: missing.map(String)
    };
}
