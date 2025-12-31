
import fs from 'fs';
import path from 'path';

const workflowPath = path.resolve(process.cwd(), 'n8n/lutagu-l2-train-disruption-workflow.json');
const jsCodePath = path.resolve(process.cwd(), 'scripts/temp_l2_transform.js');

try {
    // Read JS code
    const jsCode = fs.readFileSync(jsCodePath, 'utf-8');

    // Read Workflow JSON
    const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
    const workflow = JSON.parse(workflowContent);

    // Find the 'Transform to L4 Structure' node
    const transformNode = workflow.nodes.find(n => n.name === 'Transform to L4 Structure');

    if (!transformNode) {
        throw new Error('Node "Transform to L4 Structure" not found in workflow');
    }

    console.log('Found Transform node. Updating jsCode...');
    console.log(`Original code length: ${transformNode.parameters.jsCode.length}`);
    console.log(`New code length: ${jsCode.length}`);

    // Update the code
    transformNode.parameters.jsCode = jsCode;

    // Write back
    fs.writeFileSync(workflowPath, JSON.stringify(workflow, null, 2));
    console.log('✅ Workflow JSON successfully patched!');

} catch (err) {
    console.error('Error patching workflow:', err);
    process.exit(1);
}
