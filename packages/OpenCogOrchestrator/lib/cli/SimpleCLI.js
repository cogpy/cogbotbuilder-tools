#!/usr/bin/env node
"use strict";
/**
 * Simplified OpenCog Orchestrator CLI - Main entry point
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCLI = void 0;
const commander = __importStar(require("commander"));
const fs = __importStar(require("fs-extra"));
const AutonomousOrchestrator_1 = require("../orchestrator/AutonomousOrchestrator");
const BotBuilderToolAdapter_1 = require("../tools/BotBuilderToolAdapter");
class SimpleCLI {
    constructor() {
        this.configFile = '.opencog-orchestrator.json';
        this.orchestrator = new AutonomousOrchestrator_1.AutonomousOrchestrator();
    }
    async run() {
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
            const tools = BotBuilderToolAdapter_1.BotToolAdapterFactory.getAvailableTools();
            tools.forEach(tool => console.log(`- ${tool}`));
        });
        await program.parseAsync(process.argv);
    }
}
exports.SimpleCLI = SimpleCLI;
if (require.main === module) {
    const cli = new SimpleCLI();
    cli.run().catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
    });
}
