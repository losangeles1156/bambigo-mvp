
import { STATION_WISDOM } from '../src/data/stationWisdom';

const targets = [
    'odpt:Station:TokyoMetro.Ginza',
    'odpt:Station:Toei.Nihombashi',
    'odpt:Station:TokyoMetro.Nihombashi',
    'odpt:Station:TokyoMetro.Mitsukoshimae',
    'odpt:Station:TokyoMetro.Tsukiji',
    'odpt:Station:TokyoMetro.Kayabacho',
    'odpt:Station:TokyoMetro.HigashiGinza',
    'odpt:Station:TokyoMetro.Hatchobori'
];

console.log('--- Verifying Chuo Ward Station Wisdom ---');
let missing = 0;

targets.forEach(id => {
    const data = STATION_WISDOM[id];
    if (data) {
        console.log(`[OK] ${id}: ${data.traps?.length || 0} traps, ${data.hacks?.length || 0} hacks, ${data.l3Facilities?.length || 0} facilities`);
    } else {
        console.error(`[MISSING] ${id}`);
        missing++;
    }
});

if (missing > 0) {
    console.error(`\nFAILED: ${missing} stations missing wisdom data.`);
    process.exit(1);
} else {
    console.log('\nSUCCESS: All targeted Chuo stations have wisdom entries.');
}
