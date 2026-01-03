import { NodeDatum } from '@/lib/api/nodes';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

export interface GroupedNode extends NodeDatum {
    children?: NodeDatum[];
    isParent?: boolean;
}

export function groupNodesByProximity(nodes: NodeDatum[], thresholdMeters: number = 200): GroupedNode[] {
    const processed = new Set<string>();

    const hubMap = new Map<string, GroupedNode>();
    nodes.forEach(node => {
        if (node.is_hub || node.parent_hub_id == null) {
            hubMap.set(node.id, { ...node, children: [], isParent: true });
        }
    });

    // Associate children with their explicit parent hubs (from database)
    nodes.forEach(node => {
        if (node.parent_hub_id && hubMap.has(node.parent_hub_id)) {
            hubMap.get(node.parent_hub_id)?.children?.push(node);
            processed.add(node.id);
        }
    });

    // CRITICAL FIX: If a node has parent_hub_id but that parent is NOT in the viewport,
    // show it as a standalone node - do NOT group it by proximity to avoid wrong associations.
    // This prevents nodes from being incorrectly shown as children of unrelated hubs.
    nodes.forEach(node => {
        if (node.parent_hub_id && !hubMap.has(node.parent_hub_id) && !processed.has(node.id) && !hubMap.has(node.id)) {
            // Node has a parent but parent is outside viewport - show as standalone
            const standaloneNode: GroupedNode = { ...node, children: [], isParent: false };
            hubMap.set(node.id, standaloneNode);
            processed.add(node.id);
        }
    });

    // Only group remaining nodes (those WITHOUT explicit parent_hub_id) by proximity
    const remainingNodes = nodes.filter(n => !processed.has(n.id) && !hubMap.has(n.id) && !n.parent_hub_id);

    remainingNodes.forEach(node => {
        if (processed.has(node.id)) return;

        let [lon1, lat1] = node.location.coordinates;
        let bestParent: GroupedNode | null = null;
        let minDistance = thresholdMeters;

        for (const parent of hubMap.values()) {
            // Only group under hubs that are actual parents (is_hub or no parent themselves)
            if (!parent.is_hub && parent.parent_hub_id) continue;

            const [lon2, lat2] = parent.location.coordinates;
            const dist = calculateDistance(lat1, lon1, lat2, lon2);
            if (dist < minDistance) {
                minDistance = dist;
                bestParent = parent;
            }
        }

        if (bestParent) {
            bestParent.children?.push(node);
            processed.add(node.id);
        } else {
            const newNode: GroupedNode = { ...node, children: [], isParent: true };
            hubMap.set(node.id, newNode);
            processed.add(node.id);
        }
    });

    return Array.from(hubMap.values());
}
