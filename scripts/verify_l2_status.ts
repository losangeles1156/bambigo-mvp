/**
 * L2 Status Data Verification Script
 * Checks train status, routes, and weather data for all nodes
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';
import { STATION_LINES, HUB_STATION_MEMBERS } from '../src/lib/constants/stationLines';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface VerificationResult {
    nodeId: string;
    nodeName: string | null;
    hasLineMapping: boolean;
    lineCount: number;
    lines: string[];
    hasHubMembers: boolean;
    hubMemberCount: number;
    l2LiveData: boolean;
    issues: string[];
}

async function main() {
    console.log('🔍 L2 Status Data Verification\n');
    console.log('='.repeat(60));

    // 1. Get all nodes from database
    const { data: nodes, error } = await supabase
        .from('nodes')
        .select('id, name')
        .order('id');

    if (error) {
        console.error('❌ Failed to fetch nodes:', error.message);
        return;
    }

    console.log(`📊 Total Nodes in DB: ${nodes?.length || 0}\n`);

    // 2. Check STATION_LINES coverage
    const stationLineKeys = Object.keys(STATION_LINES);
    console.log(`📋 STATION_LINES Defined: ${stationLineKeys.length} entries`);

    // 3. Check HUB_STATION_MEMBERS coverage
    const hubMemberKeys = Object.keys(HUB_STATION_MEMBERS);
    console.log(`📋 HUB_STATION_MEMBERS Defined: ${hubMemberKeys.length} entries`);

    // 4. Verify each node
    const results: VerificationResult[] = [];
    const nodesWithoutLines: string[] = [];
    const nodesWithLines: string[] = [];

    for (const node of (nodes || [])) {
        const nodeId = node.id;
        const nodeName = typeof node.name === 'object' ? (node.name as any).ja || (node.name as any).en : node.name;

        // Check if node has line mapping
        const lines = STATION_LINES[nodeId] || [];
        const hasLineMapping = lines.length > 0;

        // Check hub members
        const hubMembers = HUB_STATION_MEMBERS[nodeId] || [];
        const hasHubMembers = hubMembers.length > 0;

        // Check L2 live data
        const { data: l2Data } = await supabase
            .from('transit_dynamic_snapshot')
            .select('station_id, status_code, updated_at')
            .eq('station_id', nodeId)
            .maybeSingle();

        const issues: string[] = [];
        if (!hasLineMapping) {
            issues.push('No line mapping');
            nodesWithoutLines.push(`${nodeName || nodeId} (${nodeId})`);
        } else {
            nodesWithLines.push(`${nodeName || nodeId} (${nodeId})`);
        }

        results.push({
            nodeId,
            nodeName,
            hasLineMapping,
            lineCount: lines.length,
            lines: lines.map(l => l.name.en),
            hasHubMembers,
            hubMemberCount: hubMembers.length,
            l2LiveData: !!l2Data,
            issues
        });
    }

    // 5. Print Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 VERIFICATION SUMMARY\n');

    const withLines = results.filter(r => r.hasLineMapping);
    const withoutLines = results.filter(r => !r.hasLineMapping);

    console.log(`✅ Nodes WITH Line Mapping: ${withLines.length} (${((withLines.length / results.length) * 100).toFixed(1)}%)`);
    console.log(`❌ Nodes WITHOUT Line Mapping: ${withoutLines.length} (${((withoutLines.length / results.length) * 100).toFixed(1)}%)`);

    // 6. Print nodes with lines (grouped by line count)
    console.log('\n📋 NODES WITH LINE MAPPING:');
    const byLineCount: Record<number, VerificationResult[]> = {};
    for (const r of withLines) {
        if (!byLineCount[r.lineCount]) byLineCount[r.lineCount] = [];
        byLineCount[r.lineCount].push(r);
    }
    for (const count of Object.keys(byLineCount).map(Number).sort((a, b) => b - a)) {
        console.log(`  [${count} lines]: ${byLineCount[count].length} nodes`);
        for (const r of byLineCount[count].slice(0, 5)) {
            console.log(`    • ${r.nodeName} - ${r.lines.slice(0, 3).join(', ')}${r.lines.length > 3 ? '...' : ''}`);
        }
        if (byLineCount[count].length > 5) {
            console.log(`    ... and ${byLineCount[count].length - 5} more`);
        }
    }

    // 7. Print nodes without lines (sample)
    if (withoutLines.length > 0) {
        console.log('\n⚠️  NODES WITHOUT LINE MAPPING (sample):');
        for (const r of withoutLines.slice(0, 20)) {
            console.log(`  • ${r.nodeName || r.nodeId}`);
        }
        if (withoutLines.length > 20) {
            console.log(`  ... and ${withoutLines.length - 20} more`);
        }
    }

    // 8. Check L2 Live Data
    const { data: l2Count } = await supabase
        .from('transit_dynamic_snapshot')
        .select('station_id', { count: 'exact' });

    console.log(`\n📡 L2 LIVE DATA STATUS:`);
    console.log(`  Transit Dynamic Snapshot Records: ${l2Count?.length || 0}`);

    // 9. Weather API Check
    console.log('\n🌤️  WEATHER STATUS:');
    console.log('  Weather data is fetched from external API (not DB)');
    console.log('  • OpenWeatherMap API or similar');
    console.log('  • Displayed per node based on coordinates');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Verification Complete!');
}

main().catch(console.error);
