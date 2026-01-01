import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    currentNodeId: string | null;
    currentZone: 'core' | 'buffer' | 'outer';

    isBottomSheetOpen: boolean;
    isChatOpen: boolean;
    messages: Array<{ role: 'user' | 'assistant'; content: string; actions?: any[] }>;
    mapCenter: { lat: number; lon: number } | null;
    isTripGuardActive: boolean;
    tripGuardSummary: string | null;
    tripGuardSubscriptionId: string | null;
    isSubscriptionModalOpen: boolean;
    isLineBound: boolean;

    locale: 'zh-TW' | 'ja' | 'en';
    accessibilityMode: boolean;
    activeTab: 'explore' | 'trips' | 'me';

    onboardingSeenVersion: number;
    pendingChatInput: string | null;
    pendingChatAutoSend: boolean;

    setCurrentNode: (id: string | null) => void;
    setZone: (zone: 'core' | 'buffer' | 'outer') => void;
    setBottomSheetOpen: (isOpen: boolean) => void;
    setChatOpen: (isOpen: boolean) => void;
    addMessage: (message: { role: 'user' | 'assistant'; content: string; actions?: any[] }) => void;
    setMapCenter: (center: { lat: number; lon: number } | null) => void;
    setTripGuardActive: (isActive: boolean) => void;
    setTripGuardSummary: (summary: string | null) => void;
    setTripGuardSubscriptionId: (id: string | null) => void;
    setSubscriptionModalOpen: (isOpen: boolean) => void;
    setLineBound: (isBound: boolean) => void;
    setLocale: (locale: 'zh-TW' | 'ja' | 'en') => void;
    toggleAccessibility: () => void;
    setActiveTab: (tab: 'explore' | 'trips' | 'me') => void;
    userContext: string[];
    setUserContext: (context: string[]) => void;

    setOnboardingSeenVersion: (version: number) => void;
    setPendingChat: (payload: { input: string | null; autoSend?: boolean }) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            currentNodeId: null,
            currentZone: 'outer',
            isBottomSheetOpen: false,
            isChatOpen: false,
            messages: [],
            mapCenter: null,
            isTripGuardActive: false,
            tripGuardSummary: null,
            tripGuardSubscriptionId: null,
            isSubscriptionModalOpen: false,
            isLineBound: false,
            locale: 'zh-TW',
            accessibilityMode: false,
            activeTab: 'explore',
            userContext: [],

            onboardingSeenVersion: 0,
            pendingChatInput: null,
            pendingChatAutoSend: false,

            setCurrentNode: (id) => set({ currentNodeId: id }),
            setZone: (zone) => set({ currentZone: zone }),
            setBottomSheetOpen: (isOpen) => set({ isBottomSheetOpen: isOpen }),
            setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
            addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
            setMapCenter: (center) => set({ mapCenter: center }),
            setTripGuardActive: (isActive) => set({ isTripGuardActive: isActive }),
            setTripGuardSummary: (summary) => set({ tripGuardSummary: summary }),
            setTripGuardSubscriptionId: (id) => set({ tripGuardSubscriptionId: id }),
            setSubscriptionModalOpen: (isOpen) => set({ isSubscriptionModalOpen: isOpen }),
            setLineBound: (isBound) => set({ isLineBound: isBound }),
            setLocale: (locale) => set({ locale }),
            toggleAccessibility: () => set((state) => ({ accessibilityMode: !state.accessibilityMode })),
            setActiveTab: (tab) => set({ activeTab: tab }),
            setUserContext: (context) => set({ userContext: context }),

            setOnboardingSeenVersion: (version) => set({ onboardingSeenVersion: version }),
            setPendingChat: ({ input, autoSend }) =>
                set({
                    pendingChatInput: input,
                    pendingChatAutoSend: autoSend ?? false
                }),
        }),
        {
            name: 'lutagu-storage',
            partialize: (state) => ({
                locale: state.locale,
                accessibilityMode: state.accessibilityMode,
                userContext: state.userContext,
                onboardingSeenVersion: state.onboardingSeenVersion
            }),
        }
    )
);
