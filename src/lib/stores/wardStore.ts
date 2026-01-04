/**
 * Ward-based data store with 24-hour caching
 * Uses Zustand for state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Ward {
    id: string;
    name_i18n: {
        'zh-TW': string;
        'ja': string;
        'en': string;
    };
    prefecture: string;
    ward_code: string | null;
    center_point: {
        type: string;
        coordinates: [number, number];
    } | null;
    priority_order: number;
    is_active: boolean;
    node_count: number;
    hub_count: number;
}

export interface WardState {
    // Data
    wards: Ward[];
    currentWard: Ward | null;
    detectedWard: Ward | null;
    
    // Cache
    lastFetched: number | null;
    cacheExpiry: number | null;
    
    // Loading states
    isLoading: boolean;
    isDetecting: boolean;
    error: string | null;
    
    // Actions
    fetchWards: () => Promise<void>;
    detectWardByLocation: (lat: number, lng: number) => Promise<Ward | null>;
    setCurrentWard: (ward: Ward | null) => void;
    clearError: () => void;
    isCacheValid: () => boolean;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const API_BASE = '/api/wards';

export const useWardStore = create<WardState>()(
    persist(
        (set, get) => ({
            // Initial state
            wards: [],
            currentWard: null,
            detectedWard: null,
            lastFetched: null,
            cacheExpiry: null,
            isLoading: false,
            isDetecting: false,
            error: null,

            // Check if cache is still valid
            isCacheValid: () => {
                const { cacheExpiry } = get();
                return cacheExpiry !== null && Date.now() < cacheExpiry;
            },

            // Fetch all wards
            fetchWards: async () => {
                const { isCacheValid, isLoading } = get();
                
                // Return cached data if valid
                if (isCacheValid() && get().wards.length > 0) {
                    return;
                }
                
                // Prevent duplicate requests
                if (isLoading) {
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`${API_BASE}?cache_bust=${Date.now()}`);
                    
                    if (!response.ok) {
                        throw new Error(`Failed to fetch wards: ${response.status}`);
                    }

                    const data = await response.json();
                    const wards = data.data || [];

                    set({
                        wards,
                        lastFetched: Date.now(),
                        cacheExpiry: Date.now() + CACHE_DURATION,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error.message || 'Failed to fetch wards',
                        isLoading: false,
                    });
                }
            },

            // Detect ward by GPS location
            detectWardByLocation: async (lat: number, lng: number) => {
                set({ isDetecting: true, error: null });

                try {
                    const response = await fetch(
                        `${API_BASE}/detect?lat=${lat}&lng=${lng}`
                    );

                    if (!response.ok) {
                        throw new Error(`Failed to detect ward: ${response.status}`);
                    }

                    const data = await response.json();
                    const ward = data.data || null;

                    set({
                        detectedWard: ward,
                        isDetecting: false,
                    });

                    return ward;
                } catch (error: any) {
                    set({
                        error: error.message || 'Failed to detect ward',
                        isDetecting: false,
                    });
                    return null;
                }
            },

            // Set current ward (for manual selection)
            setCurrentWard: (ward: Ward | null) => {
                set({ currentWard: ward });
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'ward-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                wards: state.wards,
                currentWard: state.currentWard,
                lastFetched: state.lastFetched,
                cacheExpiry: state.cacheExpiry,
            }),
        }
    )
);

// Selector hooks for optimized re-renders
export const useWards = () => useWardStore((state) => state.wards);
export const useCurrentWard = () => useWardStore((state) => state.currentWard);
export const useDetectedWard = () => useWardStore((state) => state.detectedWard);
export const useWardLoading = () => useWardStore((state) => state.isLoading);
export const useWardDetecting = () => useWardStore((state) => state.isDetecting);
export const useWardError = () => useWardStore((state) => state.error);
