// ===== LUTAGU L2 轉換為 L4 決策結構 (Line-Centric Optimized) =====

const { disruptions, fetched_at, debug } = $input.first().json;

// ===== 路線與節點對照表 (Concentric Circles Strategy) =====
// Core: MVP Stations (High Fidelity)
// Periphery: Line Awareness (All stations on line need status)
const LINE_INFO = {
    // --- Toei ---
    'Toei.Asakusa': {
        ja: '都営浅草線', 'zh-TW': '都營淺草線', en: 'Toei Asakusa Line',
        color: '#E85298', nodes: ['asakusa', 'nihombashi', 'shinbashi', 'gotanda']
    },
    'Toei.Mita': {
        ja: '都営三田線', 'zh-TW': '都營三田線', en: 'Toei Mita Line',
        color: '#0079C2', nodes: ['meguro', 'otemachi', 'sugamo']
    },
    'Toei.Shinjuku': {
        ja: '都営新宿線', 'zh-TW': '都營新宿線', en: 'Toei Shinjuku Line',
        color: '#6CBB5A', nodes: ['shinjuku', 'kudanshita']
    },
    'Toei.Oedo': {
        ja: '都営大江戸線', 'zh-TW': '都營大江戶線', en: 'Toei Oedo Line',
        color: '#B6007A', nodes: ['shinjuku', 'roppongi', 'ueno', 'ryogoku']
    },
    // --- Tokyo Metro ---
    'TokyoMetro.Ginza': {
        ja: '銀座線', 'zh-TW': '銀座線', en: 'Ginza Line',
        color: '#FF9500', nodes: ['asakusa', 'ueno', 'ginza', 'shibuya', 'nihombashi']
    },
    'TokyoMetro.Marunouchi': {
        ja: '丸ノ内線', 'zh-TW': '丸之內線', en: 'Marunouchi Line',
        color: '#F62E36', nodes: ['tokyo', 'shinjuku', 'ikebukuro', 'ginza']
    },
    'TokyoMetro.Hibiya': {
        ja: '日比谷線', 'zh-TW': '日比谷線', en: 'Hibiya Line',
        color: '#B5B5AC', nodes: ['ueno', 'ginza', 'roppongi', 'nakameguro']
    },
    'TokyoMetro.Tozai': {
        ja: '東西線', 'zh-TW': '東西線', en: 'Tozai Line',
        color: '#009BBF', nodes: ['nihombashi', 'otemachi']
    },
    'TokyoMetro.Chiyoda': {
        ja: '千代田線', 'zh-TW': '千代田線', en: 'Chiyoda Line',
        color: '#00A95F', nodes: ['otemachi', 'omotesando', 'yoyogiuehara']
    },
    'TokyoMetro.Yurakucho': {
        ja: '有楽町線', 'zh-TW': '有樂町線', en: 'Yurakucho Line',
        color: '#C1A470', nodes: ['ikebukuro', 'yurakucho']
    },
    'TokyoMetro.Hanzomon': {
        ja: '半蔵門線', 'zh-TW': '半藏門線', en: 'Hanzomon Line',
        color: '#8F76D6', nodes: ['shibuya', 'otemachi']
    },
    'TokyoMetro.Namboku': {
        ja: '南北線', 'zh-TW': '南北線', en: 'Namboku Line',
        color: '#00AC9B', nodes: ['meguro', 'komagome']
    },
    'TokyoMetro.Fukutoshin': {
        ja: '副都心線', 'zh-TW': '副都心線', en: 'Fukutoshin Line',
        color: '#9C5E31', nodes: ['shibuya', 'shinjuku', 'ikebukuro']
    },
    // --- JR East ---
    'JR-East.Yamanote': {
        ja: '山手線', 'zh-TW': '山手線', en: 'Yamanote Line',
        color: '#9ACD32', nodes: ['tokyo', 'ueno', 'ikebukuro', 'shinjuku', 'shibuya', 'shinagawa', 'yurakucho', 'akihabara']
    },
    'JR-East.ChuoRapid': {
        ja: '中央線快速', 'zh-TW': '中央線快速', en: 'Chuo Rapid Line',
        color: '#FF4500', nodes: ['tokyo', 'shinjuku']
    },
    'JR-East.ChuoSobu': {
        ja: '中央・総武線各停', 'zh-TW': '中央・總武線各停', en: 'Chuo-Sobu Local',
        color: '#FFD700', nodes: ['shinjuku', 'akihabara']
    },
    'JR-East.KeihinTohoku': {
        ja: '京浜東北線', 'zh-TW': '京濱東北線', en: 'Keihin-Tohoku Line',
        color: '#00BFFF', nodes: ['tokyo', 'ueno', 'shinagawa', 'akihabara']
    },
    'JR-East.Takasaki': {
        ja: '高崎線', 'zh-TW': '高崎線', en: 'Takasaki Line',
        color: '#FF8C00', nodes: ['ueno', 'tokyo']
    },
    'JR-East.Utsunomiya': {
        ja: '宇都宮線', 'zh-TW': '宇都宮線', en: 'Utsunomiya Line',
        color: '#FF8C00', nodes: ['ueno', 'tokyo']
    },
    'JR-East.ShonanShinjuku': {
        ja: '湘南新宿ライン', 'zh-TW': '湘南新宿線', en: 'Shonan-Shinjuku Line',
        color: '#E21F26', nodes: ['shinjuku', 'shibuya', 'ikebukuro']
    },
    'JR-East.SaikyoKawagoe': {
        ja: '埼京・川越線', 'zh-TW': '埼京・川越線', en: 'Saikyo-Kawagoe Line',
        color: '#00AC9A', nodes: ['shinjuku', 'shibuya', 'ikebukuro']
    }
};

const ROUTE_ALIASES = {
    'odpt.Railway:Toei.Asakusa': 'Toei.Asakusa',
    'odpt.Railway:Toei.Mita': 'Toei.Mita',
    'odpt.Railway:Toei.Shinjuku': 'Toei.Shinjuku',
    'odpt.Railway:Toei.Oedo': 'Toei.Oedo',
    'odpt.Railway:TokyoMetro.Ginza': 'TokyoMetro.Ginza',
    'odpt.Railway:TokyoMetro.Marunouchi': 'TokyoMetro.Marunouchi',
    'odpt.Railway:TokyoMetro.Hibiya': 'TokyoMetro.Hibiya',
    'odpt.Railway:TokyoMetro.Tozai': 'TokyoMetro.Tozai',
    'odpt.Railway:TokyoMetro.Chiyoda': 'TokyoMetro.Chiyoda',
    'odpt.Railway:TokyoMetro.Yurakucho': 'TokyoMetro.Yurakucho',
    'odpt.Railway:TokyoMetro.Hanzomon': 'TokyoMetro.Hanzomon',
    'odpt.Railway:TokyoMetro.Namboku': 'TokyoMetro.Namboku',
    'odpt.Railway:TokyoMetro.Fukutoshin': 'TokyoMetro.Fukutoshin',
    'JR-East_Yamanote': 'JR-East.Yamanote',
    'JR-East_ChuoRapid': 'JR-East.ChuoRapid',
    'JR-East_KeihinTohoku': 'JR-East.KeihinTohoku'
};

const EFFECT_MAP = {
    1: { severity: 'critical', label: { ja: '運転見合わせ', 'zh-TW': '停駛', en: 'Suspended' } },
    2: { severity: 'major', label: { ja: '運転本数減少', 'zh-TW': '減班運行', en: 'Reduced Service' } },
    3: { severity: 'major', label: { ja: '大幅な遅延', 'zh-TW': '嚴重延誤', en: 'Major Delays' } },
    4: { severity: 'minor', label: { ja: '迂回運転', 'zh-TW': '繞道運行', en: 'Detour' } },
    5: { severity: 'minor', label: { ja: '直通運転中止', 'zh-TW': '直通運轉中止', en: 'Through Service Suspended' } },
    6: { severity: 'minor', label: { ja: '運転変更', 'zh-TW': '變更運行', en: 'Modified Service' } },
    7: { severity: 'minor', label: { ja: '遅延', 'zh-TW': '延誤', en: 'Delays' } },
    8: { severity: 'none', label: { ja: '不明', 'zh-TW': '不明', en: 'Unknown' } }
};

const CAUSE_MAP = {
    1: { ja: '不明', 'zh-TW': '不明', en: 'Unknown' },
    2: { ja: 'その他', 'zh-TW': '其他', en: 'Other' },
    3: { ja: '車両点検', 'zh-TW': '車輛檢查', en: 'Technical Problem' },
    4: { ja: 'ストライキ', 'zh-TW': '罷工', en: 'Strike' },
    5: { ja: 'デモ', 'zh-TW': '示威', en: 'Demonstration' },
    6: { ja: '事故', 'zh-TW': '事故', en: 'Accident' },
    7: { ja: '祝日ダイヤ', 'zh-TW': '假日時刻', en: 'Holiday Schedule' },
    8: { ja: '天候', 'zh-TW': '天氣', en: 'Weather' },
    9: { ja: '工事', 'zh-TW': '施工', en: 'Maintenance' },
    10: { ja: '工事', 'zh-TW': '施工', en: 'Construction' },
    11: { ja: '警察活動', 'zh-TW': '警察活動', en: 'Police Activity' },
    12: { ja: '急病人対応', 'zh-TW': '乘客身體不適', en: 'Medical Emergency' }
};

function normalizeRouteId(routeId) {
    if (!routeId) return null;
    if (ROUTE_ALIASES[routeId]) return ROUTE_ALIASES[routeId];
    const gtfsMatch = routeId.match(/^([A-Za-z-]+)_(.+)$/);
    if (gtfsMatch) {
        const normalized = `${gtfsMatch[1]}.${gtfsMatch[2]}`;
        if (LINE_INFO[normalized]) return normalized;
    }
    const odptMatch = routeId.match(/odpt\.Railway:(.+)/);
    if (odptMatch && LINE_INFO[odptMatch[1]]) return odptMatch[1];
    if (LINE_INFO[routeId]) return routeId;
    return routeId;
}

// ===== PROCESS DISRUPTIONS =====

// Map to hold consolidated status
// Keys: node_id (e.g. 'ueno') OR line_id (e.g. 'transit:TokyoMetro.Ginza')
const statusMap = {};

// Function to ensure status entry exists
const getStatusEntry = (id) => {
    if (!statusMap[id]) {
        statusMap[id] = {
            node_id: id,
            updated_at: fetched_at,
            has_issues: false,
            overall_severity: 'none',
            affected_lines: [],
            disruptions: []
        };
    }
    return statusMap[id];
};

// 1. Process Raw Disruptions -> Create Line Disruption Objects
for (const d of disruptions) {
    for (const rawRouteId of d.routes) {
        const routeId = normalizeRouteId(rawRouteId);
        const lineInfo = LINE_INFO[routeId];
        if (!lineInfo) continue;

        const effectInfo = EFFECT_MAP[d.effect] || EFFECT_MAP[8];
        const causeInfo = CAUSE_MAP[d.cause] || CAUSE_MAP[1];

        let delayMinutes = d.delay_minutes || 0;
        if (!delayMinutes && d.description?.ja) {
            const match = d.description.ja.match(/(\d+)分/);
            if (match) delayMinutes = parseInt(match[1]);
        }

        const disruptionObj = {
            line_id: routeId,
            line_name: { ja: lineInfo.ja, 'zh-TW': lineInfo['zh-TW'], en: lineInfo.en },
            line_color: lineInfo.color,
            severity: effectInfo.severity,
            status_label: effectInfo.label,
            cause: causeInfo,
            delay_minutes: delayMinutes,
            message: d.description || d.header || {},
            source: d.source
        };

        // A. Update LINE-LEVEL Status (The 'Concentric Circle' Outer Ring)
        // We store this as a special node ID: "transit:<RouteID>"
        const lineNodeId = `transit:${routeId}`;
        const lineEntry = getStatusEntry(lineNodeId);

        // Merge logic (keep worst severity)
        const existingIdx = lineEntry.disruptions.findIndex(x => x.line_id === routeId);
        if (existingIdx >= 0) {
            const existing = lineEntry.disruptions[existingIdx];
            const sevOrder = ['none', 'minor', 'major', 'critical'];
            if (sevOrder.indexOf(disruptionObj.severity) > sevOrder.indexOf(existing.severity)) {
                lineEntry.disruptions[existingIdx] = disruptionObj;
            }
        } else {
            lineEntry.disruptions.push(disruptionObj);
        }

        lineEntry.has_issues = true;
        if (!lineEntry.affected_lines.includes(lineInfo.ja)) lineEntry.affected_lines.push(lineInfo.ja);

        const sevOrder = ['none', 'minor', 'major', 'critical'];
        if (sevOrder.indexOf(effectInfo.severity) > sevOrder.indexOf(lineEntry.overall_severity)) {
            lineEntry.overall_severity = effectInfo.severity;
        }

        // B. Update MVP STATION Status (The 'Concentric Circle' Core)
        // This ensures backward compatibility for specific node queries in the frontend
        if (lineInfo.nodes && Array.isArray(lineInfo.nodes)) {
            for (const nodeId of lineInfo.nodes) {
                const nodeEntry = getStatusEntry(nodeId);

                // Reuse same logic... (Should refactor but keeping inline for n8n code block)
                const existingNodeIdx = nodeEntry.disruptions.findIndex(x => x.line_id === routeId);
                if (existingNodeIdx >= 0) {
                    const existing = nodeEntry.disruptions[existingNodeIdx];
                    if (sevOrder.indexOf(disruptionObj.severity) > sevOrder.indexOf(existing.severity)) {
                        nodeEntry.disruptions[existingNodeIdx] = disruptionObj;
                    }
                } else {
                    nodeEntry.disruptions.push(disruptionObj);
                }

                nodeEntry.has_issues = true;
                if (!nodeEntry.affected_lines.includes(lineInfo.ja)) nodeEntry.affected_lines.push(lineInfo.ja);
                if (sevOrder.indexOf(effectInfo.severity) > sevOrder.indexOf(nodeEntry.overall_severity)) {
                    nodeEntry.overall_severity = effectInfo.severity;
                }
            }
        }
    }
}

// ===== GENERATE L4 HINTS =====
function generateL4Hint(entry) {
    if (!entry.has_issues) {
        return {
            action: 'proceed', severity: 'none',
            message: { ja: '運行は正常です', 'zh-TW': '目前運行正常', en: 'Normal Service' },
            affected_lines: [], alternatives_needed: false
        };
    }

    const critical = entry.disruptions.filter(d => d.severity === 'critical');
    const major = entry.disruptions.filter(d => d.severity === 'major');
    const minor = entry.disruptions.filter(d => d.severity === 'minor');

    if (critical.length > 0) {
        const linesZh = critical.map(d => d.line_name['zh-TW']).join('、');
        const linesJa = critical.map(d => d.line_name.ja).join('、');
        return {
            action: 'avoid', severity: 'critical',
            message: {
                ja: `${linesJa}で運転見合わせが発生しています。`,
                'zh-TW': `${linesZh}目前停駛中，請改道。`,
                en: 'Service suspended on affected lines.'
            },
            affected_lines: critical.map(d => d.line_id), alternatives_needed: true
        };
    }

    if (major.length > 0) {
        const maxDelay = Math.max(...major.map(d => d.delay_minutes || 15));
        const linesZh = major.map(d => d.line_name['zh-TW']).join('、');
        const linesJa = major.map(d => d.line_name.ja).join('、');
        return {
            action: 'consider_alternatives', severity: 'major',
            message: {
                ja: `${linesJa}で約${maxDelay}分の遅れが出ています。`,
                'zh-TW': `${linesZh}有約${maxDelay}分鐘的嚴重延誤。`,
                en: `Major delays (~${maxDelay} min) reported.`
            },
            estimated_delay: maxDelay, affected_lines: major.map(d => d.line_id), alternatives_needed: true
        };
    }

    const maxDelay = Math.max(...minor.map(d => d.delay_minutes || 5), 5);
    return {
        action: 'minor_delay', severity: 'minor',
        message: {
            ja: `一部列車に約${maxDelay}分の遅れがあります。`,
            'zh-TW': `部分列車有約${maxDelay}分鐘的輕微延誤。`,
            en: `Minor delays (~${maxDelay} min) reported.`
        },
        estimated_delay: maxDelay, affected_lines: minor.map(d => d.line_id), alternatives_needed: false
    };
}

// Generate Hints for ALL entries (Lines + Nodes)
for (const entry of Object.values(statusMap)) {
    entry.l4_hint = generateL4Hint(entry);
}

// ===== OUTPUT PREPARATION =====
// Ensure we output data for all Core MVP nodes even if 'normal'
// (Line nodes are only output if they have issues or are explicitly tracked)
const CORE_NODES = [
    'ueno', 'tokyo', 'asakusa', 'shibuya', 'shinjuku',
    'ikebukuro', 'ginza', 'shinagawa', 'roppongi',
    'nihombashi', 'otemachi', 'meguro', 'akihabara',
    'yurakucho', 'gotanda', 'nakameguro'
];

const output = [];

// 1. Push all StatusMap entries (Lines with issues + Affected Nodes)
for (const entry of Object.values(statusMap)) {
    output.push({ json: entry });
}

// 2. Push Normal Core Nodes if missing
for (const nodeId of CORE_NODES) {
    if (!statusMap[nodeId]) {
        output.push({
            json: {
                node_id: nodeId,
                updated_at: fetched_at,
                has_issues: false,
                overall_severity: 'none',
                affected_lines: [],
                disruptions: [],
                l4_hint: generateL4Hint({ has_issues: false })
            }
        });
    }
}

// Add debug info to last item
if (output.length > 0) {
    output[output.length - 1].json._debug = {
        total_disruptions: disruptions.length,
        entries_generated: output.length,
        decode_info: debug
    };
}

return output;
