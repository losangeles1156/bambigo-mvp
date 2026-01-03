
import dotenv from 'dotenv';
import path from 'path';
import { WeatherTool, TrainStatusTool } from '../src/lib/agent/tools/standardTools';
import { IToolContext } from '../src/lib/agent/tools/types';
import { AgentLevel } from '../src/lib/agent/core/types';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testTools() {
    console.log('Testing Agent Tools...');

    const context: IToolContext = {
        nodeId: 'odpt.Station:TokyoMetro.Ginza.Ueno',
        level: AgentLevel.L2_LIVE,
        userProfile: 'general',
        locale: 'zh-TW',
        timestamp: Date.now()
    };

    // 1. Weather Tool
    console.log('\n--- Weather Tool ---');
    const weatherTool = new WeatherTool();
    const weatherRes = await weatherTool.execute({}, context);
    console.log('Result:', JSON.stringify(weatherRes, null, 2));

    // 2. Train Status Tool
    console.log('\n--- Train Status Tool ---');
    const trainTool = new TrainStatusTool();
    const trainRes = await trainTool.execute({}, context); // Fetch all
    console.log('Result (All):', JSON.stringify(trainRes, null, 2).slice(0, 500) + '...'); // Truncate

    // Test specific operator
    const trainResSpecific = await trainTool.execute({ operator: 'TokyoMetro' }, context);
    console.log('Result (TokyoMetro):', JSON.stringify(trainResSpecific, null, 2).slice(0, 500) + '...');
}

testTools();
