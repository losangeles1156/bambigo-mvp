
import { WEATHER_REGION_POLICY } from '../src/lib/weather/policy';

const TEST_CASES = [
    {
        id: '1_positive_standard',
        title: '気象警報・注意報（東京都）',
        summary: '東京地方、伊豆諸島北部、伊豆諸島南部では、強風に注意してください。東京地方では、空気の乾燥した状態が続くため、火の取り扱いに注意してください。',
        expected: true, // Should match because Tokyo has a warning (Dry Air/Fire)
        desc: 'Standard Tokyo Alert'
    },
    {
        id: '2_negative_island_only',
        title: '気象警報・注意報（伊豆諸島）',
        summary: '伊豆諸島北部では、高波に警戒してください。',
        expected: false,
        desc: 'Title matches excluded region only'
    },
    {
        id: '3_negative_cross_contamination',
        title: '気象警報・注意報',
        summary: '東京地方は晴れています。伊豆諸島南部では、大雨警報が出ています。',
        expected: false, // This is the bug we want to fix. Currently might return true.
        desc: 'Tokyo mentioned (Clear) but Warning is for Island'
    },
    {
        id: '4_positive_mixed',
        title: '気象警報・注意報',
        summary: '東京地方と伊豆諸島では、大雨に警戒してください。',
        expected: true,
        desc: 'Warning applies to both'
    },
    {
        id: '5_negative_emergency_island',
        title: '震度速報',
        summary: '１日１２時３４分ころ、地震がありました。\n震源地は、父島近海\n震度３：小笠原諸島',
        expected: false,
        desc: 'Earthquake in excluded region'
    },
    {
        id: '6_positive_emergency_tokyo',
        title: '震度速報',
        summary: '１日１２時３４分ころ、地震がありました。\n震度３：東京地方２３区',
        expected: true,
        desc: 'Earthquake in Tokyo'
    }
];

function runTests() {
    console.log('🧪 Verifying Weather Region Policy...\n');
    let failures = 0;

    TEST_CASES.forEach(test => {
        const result = WEATHER_REGION_POLICY.isTargetRegion(test.title, test.summary);
        const passed = result === test.expected;

        console.log(`[${passed ? '✅' : '❌'}] ${test.desc}`);
        console.log(`   Input Title  : ${test.title}`);
        console.log(`   Input Summary: ${test.summary}`);
        console.log(`   Expected     : ${test.expected}`);
        console.log(`   Actual       : ${result}`);

        if (!passed) {
            failures++;
            console.log('   🔴 FAILED');
        }
        console.log('---');
    });

    if (failures === 0) {
        console.log('\n✨ All tests passed!');
    } else {
        console.log(`\n⚠️ ${failures} tests failed.`);
        process.exit(1);
    }
}

runTests();
