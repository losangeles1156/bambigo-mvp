// Defines the rigorous contract for the Station UI (L1 - L4).
// Decoupled from Backend DB schemas.

// --- Shared Types ---
export type LocaleString = { ja: string; en: string; zh: string };

// --- L1: DNA (Location) ---
export interface L1Item {
    id: string;
    name: LocaleString; // Display Name
    location: LocaleString; // e.g., "Park Exit, 2 mins walk"
    googleMapLink: string; // URL for navigation
    tags?: string[];
}

export interface L1Category {
    id: string; // e.g., 'cafe', 'shopping', 'attraction'
    label: LocaleString; // Display Label
    icon: string; // Lucide icon name or emoji
    items: L1Item[];
}

// --- L2: Live (Vitals) ---
export type Operator = 'Metro' | 'Toei' | 'JR' | 'Keisei' | 'Tsukuba' | 'Other';
export type LineStatusType = 'normal' | 'delay' | 'suspended';

export interface StationLine {
    id: string;
    name: LocaleString;
    operator: Operator;
    color: string;
    status: LineStatusType;
    message?: LocaleString;
}

export interface WeatherInfo {
    temp: number;
    condition: string;
    windSpeed: number; // m/s
    iconCode?: string;
}

export interface CrowdInfo {
    level: 1 | 2 | 3 | 4 | 5; // 1: Empty, 5: Packed
    trend: 'rising' | 'falling' | 'stable';
    userVotes: {
        total: number;
        distribution: number[]; // Array of 5 integers representing votes for each level
    };
}

// --- L3: Facilities (Services) ---
export type FacilityType = 'toilet' | 'locker' | 'charging' | 'elevator' | 'atm' | 'nursery' | 'bike' | 'wifi' | 'info' | 'smoking';

export interface L3Facility {
    id: string;
    type: FacilityType;
    name: LocaleString; // e.g., "Ecute Ueno Lockers"
    location: LocaleString; // "Inside Ticket Gate, Central Concourse"
    isAvailable?: boolean; // Real-time availability if possible
    details?: LocaleString[]; // ["Large size available", "Suica accepted"]
}

// --- L4: Bambi (Strategy) ---
export interface ActionCard {
    id: string;
    type: 'primary' | 'secondary';
    title: LocaleString;
    description: LocaleString;
    actionLabel: LocaleString;
    actionUrl?: string; // Deep link
    icon?: string;
}

// --- ROOT PROFILE ---
export interface StationUIProfile {
    // Identity
    id: string;
    tier: 'major' | 'minor'; // Major = Hub (Ueno, Tokyo), Minor = Spoke
    name: LocaleString;
    description: LocaleString;

    // Map Appearance
    mapDesign?: {
        color: string; // Hex color for the pin
        icon: string; // Custom icon identifier (e.g., 'ueno_panda')
    };

    // L1: 300m DNA
    l1_categories: L1Category[];

    // L2: Live Status
    l2: {
        lines: StationLine[];
        weather: WeatherInfo;
        crowd: CrowdInfo;
    };

    // L3: Services (Stacked)
    l3_facilities: L3Facility[];

    // L4: Strategy
    l4_cards: ActionCard[];
}
