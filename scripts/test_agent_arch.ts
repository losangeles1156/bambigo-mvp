
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Note: This script mocks the behavior of the Agent Framework running in a server process
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Manually mock Supabase import since we are in script mode and can't use alias
// We will use the direct creation for this test
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Mock Imports for Script ---
enum AgentLevel {
    L1_DNA = 'L1',
    L2_LIVE = 'L2',
    L3_FACILITY = 'L3',
    L4_STRATEGY = 'L4'
}
enum NodeType {
    HUB = 'hub',
    SPOKE = 'spoke'
}

class NodeRegistry {
    private static instance: NodeRegistry;
    private nodes: Map<string, NodeActor> = new Map();
    static getInstance(): NodeRegistry {
        if (!NodeRegistry.instance) NodeRegistry.instance = new NodeRegistry();
        return NodeRegistry.instance;
    }
    async getNode(nodeId: string): Promise<NodeActor | null> {
        if (this.nodes.has(nodeId)) return this.nodes.get(nodeId)!;
        const { data, error } = await supabase.from('nodes').select('*').eq('id', nodeId).single();
        if (error || !data) return null;
        const actor = new NodeActor(data);
        await actor.initialize();
        this.nodes.set(nodeId, actor);
        return actor;
    }
}

class NodeActor {
    id: string;
    type: NodeType;
    parentId: string | null;
    childrenIds: string[] = [];
    constructor(dbRecord: any) {
        this.id = dbRecord.id;
        this.type = dbRecord.node_type === 'hub' ? NodeType.HUB : NodeType.SPOKE;
        this.parentId = dbRecord.parent_hub_id;
    }
    async initialize() {
        if (this.type === NodeType.HUB) {
            const { data } = await supabase.from('nodes').select('id').eq('parent_hub_id', this.id);
            if (data) this.childrenIds = data.map(d => d.id);
        }
    }
    async syncState() {
        if (this.type === NodeType.HUB) {
            console.log(`[NodeActor:${this.id}] 🔄 Syncing state from ${this.childrenIds.length} children...`);
            // Mock aggregation
            console.log(`  -> Aggregated status: NORMAL`);
        } else if (this.parentId) {
            console.log(`[NodeActor:${this.id}] 📡 Reporting status to parent ${this.parentId}`);
        }
    }
}

// --- Test Execution ---

async function testAgentArchitecture() {
    console.log('🚀 Starting Agent Architecture Test (Phase 1)...');

    const registry = NodeRegistry.getInstance();

    // 1. Test Spoke Node (Child)
    console.log('\n--- Testing Spoke Node (JR Ueno) ---');
    const spoke = await registry.getNode('odpt:Station:JR-East.Ueno');
    if (spoke) {
        console.log(`✅ Loaded Spoke: ${spoke.id} (Parent: ${spoke.parentId})`);
        await spoke.syncState();
    } else {
        console.log('❌ Failed to load Spoke');
    }

    // 2. Test Hub Node (Parent)
    console.log('\n--- Testing Hub Node (Hub:Ueno) ---');
    const hub = await registry.getNode('Hub:Ueno');
    if (hub) {
        console.log(`✅ Loaded Hub: ${hub.id} (Children: ${hub.childrenIds.length})`);
        await hub.syncState();
    } else {
        console.log('❌ Failed to load Hub');
    }
}

testAgentArchitecture();
