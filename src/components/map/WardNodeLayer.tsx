'use client';

import { useMemo } from 'react';
import { useWardStore, Ward } from '@/lib/stores/wardStore';
import { NodeMarker } from './NodeMarker';

interface WardNodeLayerProps {
    wardId?: string | null;
    onNodeClick?: (node: any) => void;
    showHubBadge?: boolean;
    className?: string;
}

export function WardNodeLayer({
    wardId,
    onNodeClick,
    showHubBadge = true,
    className,
}: WardNodeLayerProps) {
    const { wards, fetchWards, isLoading, error } = useWardStore();

    // Fetch wards on mount
    useMemo(() => {
        if (wards.length === 0 && !isLoading) {
            fetchWards();
        }
    }, [wards.length, isLoading, fetchWards]);

    // Get nodes for the specific ward or all wards
    const targetWard = useMemo(() => {
        if (!wardId) return null;
        return wards.find((w) => w.id === wardId) || null;
    }, [wards, wardId]);

    // Filter wards based on wardId or show all
    const displayWards = useMemo(() => {
        if (wardId) {
            const ward = wards.find((w) => w.id === wardId);
            return ward ? [ward] : [];
        }
        return wards.filter((w) => w.is_active);
    }, [wards, wardId]);

    // Loading state
    if (isLoading && wards.length === 0) {
        return (
            <div className={`ward-node-layer loading ${className || ''}`}>
                <div className="ward-layer-loading">
                    <span className="loading-spinner" />
                    <span>載入區域數據...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`ward-node-layer error ${className || ''}`}>
                <div className="ward-layer-error">
                    <span>⚠️ 無法載入區域數據</span>
                    <button onClick={() => fetchWards()} className="retry-button">
                        重試
                    </button>
                </div>
            </div>
        );
    }

    // Render ward boundaries and nodes
    return (
        <div className={`ward-node-layer ${className || ''}`}>
            {/* Ward boundaries (optional - for debugging) */}
            {process.env.NODE_ENV === 'development' && displayWards.map((ward) => (
                <WardBoundary key={ward.id} ward={ward} />
            ))}

            {/* Ward nodes */}
            {displayWards.map((ward) => (
                <WardNodes
                    key={ward.id}
                    ward={ward}
                    onNodeClick={onNodeClick}
                    showHubBadge={showHubBadge}
                />
            ))}
        </div>
    );
}

// Ward boundary visualization (for debugging)
function WardBoundary({ ward }: { ward: Ward }) {
    const boundary = ward.center_point;
    
    if (!boundary?.coordinates) return null;

    const [lng, lat] = boundary.coordinates;

    return (
        <div
            className="ward-boundary-marker"
            style={{
                position: 'absolute',
                left: `${((lng - 139.6) / 0.4) * 100}%`,
                top: `${((35.75 - lat) / 0.15) * 100}%`,
                width: '20px',
                height: '20px',
                border: '2px dashed rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                pointerEvents: 'none',
            }}
            title={`${ward.name_i18n['zh-TW']} - ${ward.node_count} nodes, ${ward.hub_count} hubs`}
        />
    );
}

// Render nodes for a specific ward
function WardNodes({
    ward,
    onNodeClick,
    showHubBadge,
}: {
    ward: Ward;
    onNodeClick?: (node: any) => void;
    showHubBadge: boolean;
}) {
    // This would fetch actual nodes for the ward
    // For now, render a placeholder ward indicator
    const name = ward.name_i18n['zh-TW'] || ward.name_i18n['ja'] || ward.id;

    return (
        <div className="ward-nodes" data-ward-id={ward.id}>
            {/* Ward label */}
            <div
                className="ward-label"
                style={{
                    position: 'absolute',
                    left: `${((ward.center_point?.coordinates?.[0] || 139.7) - 139.6) / 0.4 * 100}%`,
                    top: `${((35.75 - (ward.center_point?.coordinates?.[1] || 35.7)) / 0.15) * 100}%`,
                }}
            >
                <span className="ward-name">{name}</span>
                <span className="ward-stats">
                    {ward.node_count} 站點 / {ward.hub_count} 樞紐
                </span>
            </div>
        </div>
    );
}

// Hook for using ward-based node data
export function useWardNodes(wardId: string | null) {
    const { wards, fetchWards, isLoading } = useWardStore();

    const ward = useMemo(() => {
        if (!wardId) return null;
        return wards.find((w) => w.id === wardId) || null;
    }, [wards, wardId]);

    const nodes = useMemo(() => {
        // In a real implementation, this would fetch from the API
        // /api/wards/[wardId]/nodes
        return [];
    }, [ward]);

    return {
        ward,
        nodes,
        isLoading: isLoading && wards.length === 0,
        refetch: fetchWards,
    };
}

// Component for displaying all ward info
export function WardInfoPanel({ wardId }: { wardId: string | null }) {
    const { wards, fetchWards } = useWardStore();
    
    const ward = useMemo(() => {
        if (!wardId) return null;
        return wards.find((w) => w.id === wardId) || null;
    }, [wards, wardId]);

    if (!ward) {
        return (
            <div className="ward-info-panel empty">
                <p>選擇一個區域以查看詳情</p>
            </div>
        );
    }

    const name = ward.name_i18n['zh-TW'] || ward.name_i18n['ja'] || ward.id;

    return (
        <div className="ward-info-panel">
            <h3 className="ward-info-title">{name}</h3>
            
            <div className="ward-info-stats">
                <div className="stat">
                    <span className="stat-value">{ward.node_count}</span>
                    <span className="stat-label">站點</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{ward.hub_count}</span>
                    <span className="stat-label">樞紐</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{ward.priority_order}</span>
                    <span className="stat-label">優先級</span>
                </div>
            </div>
            
            <div className="ward-info-actions">
                <button
                    className="action-button"
                    onClick={() => fetchWards()}
                >
                    刷新數據
                </button>
                <button className="action-button secondary">
                    查看詳細
                </button>
            </div>
        </div>
    );
}
