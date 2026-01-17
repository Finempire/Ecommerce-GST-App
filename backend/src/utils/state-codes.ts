// Indian State Codes as per GST

export interface StateInfo {
    code: string;
    name: string;
    shortName: string;
    type: 'state' | 'ut';
}

// Complete list of Indian states and union territories with GST codes
export const INDIAN_STATES: StateInfo[] = [
    { code: '01', name: 'Jammu and Kashmir', shortName: 'JK', type: 'ut' },
    { code: '02', name: 'Himachal Pradesh', shortName: 'HP', type: 'state' },
    { code: '03', name: 'Punjab', shortName: 'PB', type: 'state' },
    { code: '04', name: 'Chandigarh', shortName: 'CH', type: 'ut' },
    { code: '05', name: 'Uttarakhand', shortName: 'UK', type: 'state' },
    { code: '06', name: 'Haryana', shortName: 'HR', type: 'state' },
    { code: '07', name: 'Delhi', shortName: 'DL', type: 'ut' },
    { code: '08', name: 'Rajasthan', shortName: 'RJ', type: 'state' },
    { code: '09', name: 'Uttar Pradesh', shortName: 'UP', type: 'state' },
    { code: '10', name: 'Bihar', shortName: 'BR', type: 'state' },
    { code: '11', name: 'Sikkim', shortName: 'SK', type: 'state' },
    { code: '12', name: 'Arunachal Pradesh', shortName: 'AR', type: 'state' },
    { code: '13', name: 'Nagaland', shortName: 'NL', type: 'state' },
    { code: '14', name: 'Manipur', shortName: 'MN', type: 'state' },
    { code: '15', name: 'Mizoram', shortName: 'MZ', type: 'state' },
    { code: '16', name: 'Tripura', shortName: 'TR', type: 'state' },
    { code: '17', name: 'Meghalaya', shortName: 'ML', type: 'state' },
    { code: '18', name: 'Assam', shortName: 'AS', type: 'state' },
    { code: '19', name: 'West Bengal', shortName: 'WB', type: 'state' },
    { code: '20', name: 'Jharkhand', shortName: 'JH', type: 'state' },
    { code: '21', name: 'Odisha', shortName: 'OD', type: 'state' },
    { code: '22', name: 'Chhattisgarh', shortName: 'CG', type: 'state' },
    { code: '23', name: 'Madhya Pradesh', shortName: 'MP', type: 'state' },
    { code: '24', name: 'Gujarat', shortName: 'GJ', type: 'state' },
    { code: '25', name: 'Daman and Diu', shortName: 'DD', type: 'ut' },
    { code: '26', name: 'Dadra and Nagar Haveli and Daman and Diu', shortName: 'DN', type: 'ut' },
    { code: '27', name: 'Maharashtra', shortName: 'MH', type: 'state' },
    { code: '28', name: 'Andhra Pradesh', shortName: 'AP', type: 'state' },
    { code: '29', name: 'Karnataka', shortName: 'KA', type: 'state' },
    { code: '30', name: 'Goa', shortName: 'GA', type: 'state' },
    { code: '31', name: 'Lakshadweep', shortName: 'LD', type: 'ut' },
    { code: '32', name: 'Kerala', shortName: 'KL', type: 'state' },
    { code: '33', name: 'Tamil Nadu', shortName: 'TN', type: 'state' },
    { code: '34', name: 'Puducherry', shortName: 'PY', type: 'ut' },
    { code: '35', name: 'Andaman and Nicobar Islands', shortName: 'AN', type: 'ut' },
    { code: '36', name: 'Telangana', shortName: 'TS', type: 'state' },
    { code: '37', name: 'Andhra Pradesh (New)', shortName: 'AD', type: 'state' },
    { code: '38', name: 'Ladakh', shortName: 'LA', type: 'ut' },
    { code: '97', name: 'Other Territory', shortName: 'OT', type: 'ut' },
    { code: '99', name: 'Centre Jurisdiction', shortName: 'CJ', type: 'ut' },
];

// Create lookup maps for efficient access
const stateByCode = new Map<string, StateInfo>();
const stateByName = new Map<string, StateInfo>();
const stateByShortName = new Map<string, StateInfo>();

INDIAN_STATES.forEach(state => {
    stateByCode.set(state.code, state);
    stateByName.set(state.name.toLowerCase(), state);
    stateByShortName.set(state.shortName.toLowerCase(), state);
});

/**
 * Get state info by GST state code
 */
export function getStateByCode(code: string): StateInfo | undefined {
    return stateByCode.get(code.padStart(2, '0'));
}

/**
 * Get state info by state name (case-insensitive)
 */
export function getStateByName(name: string): StateInfo | undefined {
    return stateByName.get(name.toLowerCase()) ||
        findStateByPartialName(name);
}

/**
 * Get state info by short name (case-insensitive)
 */
export function getStateByShortName(shortName: string): StateInfo | undefined {
    return stateByShortName.get(shortName.toLowerCase());
}

/**
 * Find state by partial name match
 */
function findStateByPartialName(name: string): StateInfo | undefined {
    const lowerName = name.toLowerCase().trim();
    return INDIAN_STATES.find(state =>
        state.name.toLowerCase().includes(lowerName) ||
        lowerName.includes(state.name.toLowerCase().split(' ')[0])
    );
}

/**
 * Get state code from state name
 */
export function getStateCode(stateName: string): string {
    const state = getStateByName(stateName);
    return state?.code || '27'; // Default to Maharashtra
}

/**
 * Get state name from state code
 */
export function getStateName(code: string): string {
    const state = getStateByCode(code);
    return state?.name || 'Unknown';
}

/**
 * Check if state code is valid
 */
export function isValidStateCode(code: string): boolean {
    return stateByCode.has(code.padStart(2, '0'));
}

/**
 * Get all state codes as options for dropdown
 */
export function getStateOptions(): { value: string; label: string }[] {
    return INDIAN_STATES
        .filter(state => !['97', '99'].includes(state.code))
        .map(state => ({
            value: state.code,
            label: `${state.code} - ${state.name}`,
        }));
}

/**
 * Common city to state code mapping
 */
const cityStateMap: Record<string, string> = {
    'mumbai': '27',
    'pune': '27',
    'nagpur': '27',
    'delhi': '07',
    'new delhi': '07',
    'gurgaon': '06',
    'gurugram': '06',
    'noida': '09',
    'bangalore': '29',
    'bengaluru': '29',
    'chennai': '33',
    'hyderabad': '36',
    'kolkata': '19',
    'ahmedabad': '24',
    'surat': '24',
    'jaipur': '08',
    'lucknow': '09',
    'kanpur': '09',
    'indore': '23',
    'bhopal': '23',
    'patna': '10',
    'chandigarh': '04',
    'ludhiana': '03',
    'kochi': '32',
    'coimbatore': '33',
    'visakhapatnam': '28',
    'vijayawada': '37',
};

/**
 * Get state code from city name
 */
export function getStateCodeFromCity(city: string): string | undefined {
    return cityStateMap[city.toLowerCase().trim()];
}

/**
 * Parse address to extract state code
 */
export function extractStateFromAddress(address: string): string {
    const lowerAddress = address.toLowerCase();

    // Check for city matches first
    for (const [city, code] of Object.entries(cityStateMap)) {
        if (lowerAddress.includes(city)) {
            return code;
        }
    }

    // Check for state name matches
    for (const state of INDIAN_STATES) {
        if (lowerAddress.includes(state.name.toLowerCase())) {
            return state.code;
        }
    }

    // Check for PIN code pattern and infer state
    const pinMatch = address.match(/\b([1-9][0-9]{5})\b/);
    if (pinMatch) {
        return getStateFromPinCode(pinMatch[1]);
    }

    return '27'; // Default to Maharashtra
}

/**
 * Get state code from PIN code (first 2 digits indicate zone)
 */
function getStateFromPinCode(pinCode: string): string {
    const zone = pinCode.substring(0, 2);

    const pinZoneMap: Record<string, string> = {
        '11': '07', // Delhi
        '12': '06', // Haryana
        '13': '03', // Punjab
        '14': '04', // Chandigarh
        '15': '01', // J&K
        '16': '02', // Himachal
        '17': '02', // Himachal
        '18': '09', // UP
        '19': '09', // UP
        '20': '09', // UP
        '21': '09', // UP
        '22': '09', // UP
        '23': '09', // UP
        '24': '09', // UP
        '25': '08', // Rajasthan
        '26': '09', // UP
        '27': '09', // UP
        '28': '09', // UP
        '30': '08', // Rajasthan
        '31': '08', // Rajasthan
        '32': '08', // Rajasthan
        '33': '08', // Rajasthan
        '34': '08', // Rajasthan
        '36': '24', // Gujarat
        '37': '24', // Gujarat
        '38': '24', // Gujarat
        '39': '24', // Gujarat
        '40': '27', // Maharashtra
        '41': '27', // Maharashtra
        '42': '27', // Maharashtra
        '43': '27', // Maharashtra
        '44': '27', // Maharashtra
        '45': '23', // MP
        '46': '23', // MP
        '47': '23', // MP
        '48': '23', // MP
        '49': '22', // Chhattisgarh
        '50': '36', // Telangana
        '51': '28', // AP
        '52': '28', // AP
        '53': '28', // AP
        '56': '29', // Karnataka
        '57': '29', // Karnataka
        '58': '29', // Karnataka
        '59': '29', // Karnataka
        '60': '33', // Tamil Nadu
        '61': '33', // Tamil Nadu
        '62': '33', // Tamil Nadu
        '63': '33', // Tamil Nadu
        '64': '33', // Tamil Nadu
        '67': '32', // Kerala
        '68': '32', // Kerala
        '69': '32', // Kerala
        '70': '19', // West Bengal
        '71': '19', // West Bengal
        '72': '19', // West Bengal
        '73': '19', // West Bengal
        '74': '19', // West Bengal
        '75': '21', // Odisha
        '76': '21', // Odisha
        '77': '21', // Odisha
        '78': '18', // Assam
        '79': '12', // Arunachal
        '80': '10', // Bihar
        '81': '10', // Bihar
        '82': '10', // Bihar
        '83': '20', // Jharkhand
        '84': '10', // Bihar
        '85': '20', // Jharkhand
    };

    return pinZoneMap[zone] || '27';
}
