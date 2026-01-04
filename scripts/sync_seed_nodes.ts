/**
 * Sync Seed Nodes to Database
 * 执行 src/lib/nodes/seedNodes.ts 中的 seedNodes() 函数
 */

import { seedNodes } from '../src/lib/nodes/seedNodes';

async function main() {
    console.log('🚀 开始同步 Seed Nodes 到数据库...\n');

    try {
        await seedNodes();
        console.log('\n✅ 同步完成！');
    } catch (error) {
        console.error('\n❌ 同步失败:', error);
        process.exit(1);
    }
}

main();
