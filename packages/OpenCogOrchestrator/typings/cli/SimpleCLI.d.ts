#!/usr/bin/env node
/**
 * Simplified OpenCog Orchestrator CLI - Main entry point
 */
declare class SimpleCLI {
    private orchestrator;
    private configFile;
    constructor();
    run(): Promise<void>;
}
export { SimpleCLI };
