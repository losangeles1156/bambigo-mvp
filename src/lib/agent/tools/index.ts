export * from './types';
export * from './ToolRegistry';
export * from './standardTools';
export * from './pedestrianTools';

import { ToolRegistry } from './ToolRegistry';
import { FareTool, FacilityTool } from './standardTools';
import { PedestrianAccessibilityTool } from './pedestrianTools';

export function registerStandardTools() {
    const registry = ToolRegistry.getInstance();
    
    // L2 Tools
    registry.register(new FareTool());
    
    // L3 Tools
    registry.register(new FacilityTool());
    registry.register(new PedestrianAccessibilityTool());
    
    console.log('✅ Standard AI Tools Registered');
}
