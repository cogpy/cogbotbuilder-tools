#!/usr/bin/env node
/**
 * OpenCog Orchestrator CLI - Main entry point for autonomous bot development orchestration
 */
declare class OpenCogOrchestratorCLI {
    private orchestrator;
    private configFile;
    constructor();
    run(): Promise<void>;
    private initCommand;
    private startCommand;
    private taskCommand;
    private statusCommand;
    private toolsCommand;
    private generateCommand;
    private insightsCommand;
    private loadConfig;
    private registerTools;
    private parseTaskType;
    private formatStatus;
    private setupEventListeners;
}
export { OpenCogOrchestratorCLI };
