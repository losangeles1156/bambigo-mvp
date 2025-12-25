import { z } from 'zod';

// --- Core Facility Types (Aligned with src/lib/types/stationStandard.ts) ---

export const LocaleStringSchema = z.object({
    ja: z.string(),
    en: z.string(),
    zh: z.string().optional(), // Chinese might be missing initially
});

export type LocaleString = z.infer<typeof LocaleStringSchema>;

// Facility Type Enum
export const FacilityTypeSchema = z.enum([
    'toilet',
    'locker',
    'elevator',
    'wifi',
    'charging',
    'nursing',
    'atm',
    'info'
]);

export type FacilityType = z.infer<typeof FacilityTypeSchema>;

// Base Attribute Schema
export const FacilityAttributesSchema = z.object({
    // Toilet
    wheelchair: z.boolean().optional(),
    hasWashlet: z.boolean().optional(),
    hasOstomate: z.boolean().optional(),

    // Locker
    count: z.number().optional(),
    sizes: z.array(z.enum(['S', 'M', 'L', 'XL'])).optional(),
    payment: z.array(z.string()).optional(), // e.g., ['cash', 'suica']

    // Wifi
    ssid: z.string().optional(),

    // Nursing
    hasBabyRoom: z.boolean().optional(),
    hasHotWater: z.boolean().optional(),

    // General
    hours: z.string().optional(),
    note: z.string().optional(),
});

export type FacilityAttributes = z.infer<typeof FacilityAttributesSchema>;

// The Main Facility Object
export const StationFacilitySchema = z.object({
    type: FacilityTypeSchema,
    location: LocaleStringSchema, // Standardized location description
    floor: z.string(), // e.g., 'B1', '1F', '2F'
    operator: z.enum(['Metro', 'Toei', 'JR', 'Keisei', 'Tsukuba', 'Tobu', 'Private']),
    attributes: FacilityAttributesSchema.optional(),
    sourceUrl: z.string().optional(),
});

export type StationFacility = z.infer<typeof StationFacilitySchema>;

// --- Scraper Interface ---

export interface ScraperResult {
    stationName: string; // The specific station name scraped (e.g., "Ueno")
    operator: string;
    facilities: StationFacility[];
    raw?: any; // For debugging, store raw scraped data if needed
}

export interface IScraper {
    targetOperator: string;
    scrape(stationId: string, url: string): Promise<ScraperResult>;
}
