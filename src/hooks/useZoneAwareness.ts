'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { ZoneDetector } from '../lib/zones/detector';
import { tokyoCoreAdapter } from '../lib/adapters/tokyo';
import { calculateDistance } from '../lib/utils/distance';

// Ueno Station coordinates as the center of wisdom
const UENO_CENTER = { lat: 35.7138, lon: 139.7773 };
const MAX_DISTANCE_KM = 50;

// Initialize detector with Tokyo config
const detector = new ZoneDetector({
    coreBounds: tokyoCoreAdapter.bounds,
    bufferRadiusKm: 5 // 5km as per v2.1 spec
});

export function useZoneAwareness() {
    const { setZone, currentZone } = useAppStore();
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [isTooFar, setIsTooFar] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setZone('outer');
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Calculate distance to Ueno
                const dist = calculateDistance(latitude, longitude, UENO_CENTER.lat, UENO_CENTER.lon);

                if (dist > MAX_DISTANCE_KM) {
                    setIsTooFar(true);
                    setUserLocation(null); // Don't track real location if too far
                    setZone('core'); // Fallback to "Virtual Core"
                } else {
                    setIsTooFar(false);
                    setUserLocation({ lat: latitude, lon: longitude });

                    // Use the modular detector
                    const detectedZone = await detector.detectZone(latitude, longitude);

                    // Only update store if changed to avoid renders
                    if (detectedZone !== currentZone) {
                        setZone(detectedZone);
                    }
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                setZone('core'); // Fallback to "Virtual Core"
                setIsTooFar(true);
            },
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [currentZone, setZone]);

    return { zone: currentZone, userLocation, isTooFar, centerFallback: UENO_CENTER };
}
