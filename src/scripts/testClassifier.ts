
import { classifyQuestion, normalizeOdptStationId } from '../lib/l4/assistantEngine';

const TEST_CASES = [
    { text: '票價 to: odpt.Station:TokyoMetro.Marunouchi.Tokyo', locale: 'zh-TW', expected: 'fare' },
    { text: '時刻表 station: odpt.Station:TokyoMetro.Ginza.Ueno', locale: 'zh-TW', expected: 'timetable' },
    { text: '怎麼去 odpt.Station:TokyoMetro.Marunouchi.Tokyo from: odpt.Station:TokyoMetro.Ginza.Ueno', locale: 'zh-TW', expected: 'route' },
    { text: 'Kanda', locale: 'zh-TW', expected: 'unknown' },
    { text: '神田', locale: 'zh-TW', expected: 'unknown' }
];

console.log('--- Testing classifyQuestion ---');

TEST_CASES.forEach((tc: any) => {
    const result = classifyQuestion(tc.text, tc.locale);
    console.log(`Input: "${tc.text}"`);
    console.log(`Locale: ${tc.locale}`);
    console.log(`Result: ${JSON.stringify(result)}`);
    const pass = result.kind === tc.expected;
    console.log(`Pass: ${pass ? '✅' : '❌'} (Expected ${tc.expected})\n`);
});

console.log('--- Normalize Test ---');
console.log('Station ID:', normalizeOdptStationId('odpt:Station:JR-East.Yamanote.Ueno'));
