
import { WEATHER_REGION_POLICY } from '../src/lib/weather/policy';

console.log('=== WEATHER SEVERITY VERIFICATION ===');

const testCases = [
    {
        title: '気象特別警報報（東京都）', // Special Warning (Red)
        expected: 'critical'
    },
    {
        title: '大雨警報（浸水害）', // Regular Warning (Red)
        expected: 'critical'
    },
    {
        title: '乾燥注意報', // Advisory (Amber)
        expected: 'warning'
    },
    {
        title: '強風注意報', // Advisory (Amber)
        expected: 'warning'
    },
    {
        title: '気象情報', // General Info (Blue)
        expected: 'info'
    },
    {
        title: '震度速報', // Earthquake (Red)
        expected: 'critical'
    }
];

let passed = 0;
let failed = 0;

for (const t of testCases) {
    let result = 'info';
    if (WEATHER_REGION_POLICY.patterns.critical.test(t.title)) {
        result = 'critical';
    } else if (WEATHER_REGION_POLICY.patterns.advisory.test(t.title)) {
        result = 'warning';
    }

    const isPass = result === t.expected;
    if (isPass) passed++; else failed++;

    console.log(`[${isPass ? 'PASS' : 'FAIL'}] "${t.title}" -> ${result} (Expected: ${t.expected})`);
}

console.log(`\nResult: ${passed}/${testCases.length} Passed.`);
if (failed > 0) process.exit(1);
