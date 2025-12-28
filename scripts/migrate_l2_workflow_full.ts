
import fs from 'fs';
import path from 'path';

const workflowPath = path.resolve(process.cwd(), 'n8n/bambigo-l2-train-disruption-workflow.json');
const jsCodePath = path.resolve(process.cwd(), 'scripts/temp_l2_transform.js');

try {
    console.log('🔄 Starting Full Workflow Migration...');

    // 1. Read Files
    const jsCode = fs.readFileSync(jsCodePath, 'utf-8');
    const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
    const workflow = JSON.parse(workflowContent);

    // 2. Update Transform Node Code
    const transformNode = workflow.nodes.find(n => n.name === 'Transform to L4 Structure');
    if (transformNode) {
        console.log('✅ Updating Transform logic...');
        transformNode.parameters.jsCode = jsCode;
    } else {
        console.warn('⚠️ Transform node not found!');
    }

    // 3. Migrate Redis Nodes to Supabase HTTP
    workflow.nodes = workflow.nodes.map(node => {
        // Replace "Redis Cache" -> "Supabase Upsert (Disruption)"
        if (node.name === 'Redis Cache') {
            console.log('✅ Migrating Redis Cache node...');
            return {
                ...node,
                name: 'Supabase Upsert (Disruption)',
                type: 'n8n-nodes-base.httpRequest',
                typeVersion: 4.2,
                parameters: {
                    method: 'POST',
                    url: '={{ $env.SUPABASE_URL }}/rest/v1/transit_dynamic_snapshot',
                    authentication: 'genericCredentialType',
                    genericAuthType: 'httpHeaderAuth',
                    sendHeaders: true,
                    headerParameters: {
                        parameters: [
                            { name: 'apikey', value: '={{ $env.SUPABASE_SERVICE_KEY }}' },
                            { name: 'Authorization', value: '=Bearer {{ $env.SUPABASE_SERVICE_KEY }}' },
                            { name: 'Content-Type', value: 'application/json' },
                            { name: 'Prefer', value: 'resolution=merge-duplicates' }
                        ]
                    },
                    sendBody: true,
                    specifyBody: 'json',
                    jsonBody: "={{ JSON.stringify({ station_id: $json.node_id, status_code: $json.overall_severity === 'none' ? 'NORMAL' : ($json.overall_severity === 'critical' ? 'SUSPENDED' : 'DELAY'), reason_ja: $json.l4_hint?.message?.ja || '', disruption_data: $json, updated_at: $json.updated_at }) }}",
                    options: {}
                },
                notes: '寫入 transit_dynamic_snapshot'
            };
        }

        // Replace "Redis Cache (Normal)" -> "Supabase Upsert (Normal)"
        if (node.name === 'Redis Cache (Normal)') {
            console.log('✅ Migrating Redis Normal node...');
            return {
                ...node,
                name: 'Supabase Upsert (Normal)',
                type: 'n8n-nodes-base.httpRequest',
                typeVersion: 4.2,
                parameters: {
                    method: 'POST',
                    url: '={{ $env.SUPABASE_URL }}/rest/v1/transit_dynamic_snapshot',
                    authentication: 'genericCredentialType',
                    genericAuthType: 'httpHeaderAuth',
                    sendHeaders: true,
                    headerParameters: {
                        parameters: [
                            { name: 'apikey', value: '={{ $env.SUPABASE_SERVICE_KEY }}' },
                            { name: 'Authorization', value: '=Bearer {{ $env.SUPABASE_SERVICE_KEY }}' },
                            { name: 'Content-Type', value: 'application/json' },
                            { name: 'Prefer', value: 'resolution=merge-duplicates' }
                        ]
                    },
                    sendBody: true,
                    specifyBody: 'json',
                    jsonBody: "={{ JSON.stringify({ station_id: $json.node_id, status_code: 'NORMAL', reason_ja: '運行正常', disruption_data: $json, updated_at: $json.updated_at }) }}",
                    options: {}
                },
                notes: '正常狀態也寫入'
            };
        }

        return node;
    });

    // 4. Update Connections (Rename keys/targets)
    // We need to update the connection map because node names changed
    const newConnections = {};

    for (const [sourceName, targets] of Object.entries(workflow.connections)) {
        // Map output target names
        const newSourceName =
            sourceName === 'Redis Cache' ? 'Supabase Upsert (Disruption)' :
                sourceName === 'Redis Cache (Normal)' ? 'Supabase Upsert (Normal)' :
                    sourceName;

        const newTargets = { ...targets };

        // Iterate main/main...
        for (const [outputName, connections] of Object.entries(targets)) {
            newTargets[outputName] = connections.map(conn => {
                let newNodeName = conn.node;
                if (conn.node === 'Redis Cache') newNodeName = 'Supabase Upsert (Disruption)';
                if (conn.node === 'Redis Cache (Normal)') newNodeName = 'Supabase Upsert (Normal)';
                return { ...conn, node: newNodeName };
            });
        }

        newConnections[newSourceName] = newTargets;
    }
    workflow.connections = newConnections;
    console.log('✅ Connections updated.');

    // 5. Write Result
    fs.writeFileSync(workflowPath, JSON.stringify(workflow, null, 2));
    console.log('🎉 Full Migration Complete! JSON is valid.');

} catch (err) {
    console.error('❌ Migration Failed:', err);
    process.exit(1);
}
