#!/usr/bin/env node

/**
 * Simplified OpenCog Orchestrator CLI - Main entry point
 */

import * as commander from 'commander';
import * as fs from 'fs-extra';
import { AutonomousOrchestrator } from '../orchestrator/AutonomousOrchestrator';
import { BotToolAdapterFactory } from '../tools/BotBuilderToolAdapter';
import { ITask, TaskType, TaskStatus } from '../interfaces/IOrchestrator';
import { v4 as uuidv4 } from 'uuid';

class SimpleCLI {
    private orchestrator: AutonomousOrchestrator;
    private configFile: string = '.opencog-orchestrator.json';

    constructor() {
        this.orchestrator = new AutonomousOrchestrator();
    }

    async run(): Promise<void> {
        const program = new commander.Command();
        
        program
            .version('1.0.0')
            .description('OpenCog-based autonomous orchestrator for BotBuilder tools');

        program
            .command('init')
            .description('Initialize OpenCog orchestrator')
            .action(async () => {
                console.log('🧠 Initializing OpenCog Orchestrator...');
                
                const config = {
                    version: '1.0.0',
                    cognitive: { cycleInterval: 100, attentionThreshold: 50 },
                    tools: { enabledTools: ['luis', 'qnamaker', 'msbot'] }
                };

                await fs.writeJson(this.configFile, config, { spaces: 2 });
                console.log('✓ Orchestrator initialized successfully');
            });

        program
            .command('start')
            .description('Start the orchestrator')
            .action(async () => {
                console.log('🧠 Starting OpenCog Orchestrator...');
                await this.orchestrator.initialize();
                console.log('✓ Orchestrator started successfully');
            });

        program
            .command('tools')
            .description('List available tools')
            .action(async () => {
                console.log('🛠️  Available BotBuilder Tools:');
                const tools = BotToolAdapterFactory.getAvailableTools();
                tools.forEach(tool => console.log(`- ${tool}`));
            });

        await program.parseAsync(process.argv);
    }
}

if (require.main === module) {
    const cli = new SimpleCLI();
    cli.run().catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
    });
}

export { SimpleCLI };