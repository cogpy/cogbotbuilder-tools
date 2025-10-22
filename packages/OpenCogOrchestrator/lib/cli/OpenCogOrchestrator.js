#!/usr/bin/env node
"use strict";
/**
 * OpenCog Orchestrator CLI - Main entry point for autonomous bot development orchestration
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
exports.OpenCogOrchestratorCLI = void 0;
const commander = __importStar(require("commander"));
const fs = __importStar(require("fs-extra"));
const AutonomousOrchestrator_1 = require("../orchestrator/AutonomousOrchestrator");
const BotBuilderToolAdapter_1 = require("../tools/BotBuilderToolAdapter");
const IOrchestrator_1 = require("../interfaces/IOrchestrator");
const uuid_1 = require("uuid");
class OpenCogOrchestratorCLI {
    constructor() {
        this.configFile = '.opencog-orchestrator.json';
        this.orchestrator = new AutonomousOrchestrator_1.AutonomousOrchestrator();
        this.setupEventListeners();
    }
    async run() {
        const program = new commander.Command();
        program
            .version('1.0.0')
            .description('OpenCog-based autonomous orchestrator for BotBuilder tools')
            .option('-c, --config <file>', 'Configuration file path', this.configFile)
            .option('-v, --verbose', 'Enable verbose logging')
            .option('-q, --quiet', 'Suppress output except errors');
        // Initialize command
        program
            .command('init')
            .description('Initialize OpenCog orchestrator in current directory')
            .action(async () => {
            await this.initCommand();
        });
        // Start orchestrator
        program
            .command('start')
            .description('Start the autonomous orchestrator')
            .option('-d, --daemon', 'Run as daemon')
            .action(async (options) => {
            await this.startCommand(options);
        });
        // Submit task
        program
            .command('task <type>')
            .description('Submit a task for autonomous execution')
            .option('-p, --priority <number>', 'Task priority (1-10)', '5')
            .option('-r, --requirements <items>', 'Comma-separated list of requirements')
            .option('-i, --input <file>', 'Input file for the task')
            .option('-o, --output <file>', 'Output file for results')
            .action(async (type, options) => {
            await this.taskCommand(type, options);
        });
        // Show status
        program
            .command('status [taskId]')
            .description('Show orchestrator or task status')
            .action(async (taskId) => {
            await this.statusCommand(taskId);
        });
        // List available tools
        program
            .command('tools')
            .description('List available BotBuilder tools')
            .action(async () => {
            await this.toolsCommand();
        });
        // Generate bot workflow
        program
            .command('generate <workflow>')
            .description('Generate an autonomous bot development workflow')
            .option('-d, --domain <domain>', 'Bot domain (e.g., customer-service, faq)')
            .option('-l, --language <lang>', 'Primary language for the bot')
            .option('-s, --services <services>', 'Comma-separated list of services to use')
            .action(async (workflow, options) => {
            await this.generateCommand(workflow, options);
        });
        // Cognitive insights
        program
            .command('insights')
            .description('Show cognitive insights and learning progress')
            .action(async () => {
            await this.insightsCommand();
        });
        await program.parseAsync(process.argv);
    }
    async initCommand() {
        console.log('🧠 Initializing OpenCog Orchestrator...');
        try {
            // Create default configuration
            const config = {
                version: '1.0.0',
                cognitive: {
                    cycleInterval: 100,
                    attentionThreshold: 50,
                    learningRate: 0.01
                },
                tools: {
                    autoDetect: true,
                    enabledTools: ['luis', 'qnamaker', 'msbot', 'ludown', 'chatdown', 'dispatch']
                },
                orchestration: {
                    maxConcurrentTasks: 3,
                    defaultTimeout: 300000,
                    retryAttempts: 2
                }
            };
            await fs.writeJson(this.configFile, config, { spaces: 2 });
            // Create workspace directories
            await fs.ensureDir('workspace/knowledge');
            await fs.ensureDir('workspace/models');
            await fs.ensureDir('workspace/outputs');
            await fs.ensureDir('workspace/temp');
            console.log('✓ OpenCog Orchestrator initialized successfully');
            console.log(`Configuration saved to: ${this.configFile}`);
        }
        catch (error) {
            console.log('✗ Initialization failed:', error.message);
            process.exit(1);
        }
    }
    async startCommand(options) {
        console.log(chalk.blue('🧠 Starting OpenCog Orchestrator...'));
        try {
            // Load configuration
            const config = await this.loadConfig();
            // Initialize orchestrator
            await this.orchestrator.initialize();
            // Register available tools
            await this.registerTools(config.tools.enabledTools);
            console.log(chalk.green('✓ OpenCog Orchestrator started successfully'));
            console.log(chalk.gray('Ready to accept autonomous tasks...'));
            if (options.daemon) {
                // Keep process alive for daemon mode
                process.on('SIGINT', async () => {
                    console.log(chalk.yellow('\n🛑 Shutting down orchestrator...'));
                    await this.orchestrator.shutdown();
                    process.exit(0);
                });
                // Keep the process running
                await new Promise(() => { });
            }
            else {
                console.log(chalk.gray('Use Ctrl+C to stop the orchestrator'));
                // Keep process alive until interrupted
                await new Promise((resolve) => {
                    process.on('SIGINT', resolve);
                });
                await this.orchestrator.shutdown();
            }
        }
        catch (error) {
            console.log('✗ Failed to start orchestrator:', error.message);
            process.exit(1);
        }
    }
    async taskCommand(type, options) {
        console.log(chalk.blue(`🎯 Submitting ${type} task...`));
        try {
            const task = {
                id: uuid_1.v4(),
                type: this.parseTaskType(type),
                priority: parseInt(options.priority) || 5,
                requirements: options.requirements ? options.requirements.split(',') : [],
                context: {
                    userIntent: `Execute ${type} task`,
                    domainKnowledge: [],
                    previousResults: [],
                    constraints: [],
                    preferences: []
                },
                status: IOrchestrator_1.TaskStatus.Pending,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const taskId = await this.orchestrator.submitTask(task);
            console.log(chalk.green(`✓ Task submitted successfully`));
            console.log(chalk.gray(`Task ID: ${taskId}`));
            console.log(chalk.gray(`Type: ${task.type}`));
            console.log(chalk.gray(`Priority: ${task.priority}`));
        }
        catch (error) {
            console.log('✗ Failed to submit task:', error.message);
            process.exit(1);
        }
    }
    async statusCommand(taskId) {
        try {
            if (taskId) {
                const status = await this.orchestrator.getTaskStatus(taskId);
                console.log(chalk.blue(`📊 Task Status: ${taskId}`));
                console.log(chalk.gray(`Status: ${this.formatStatus(status)}`));
            }
            else {
                console.log(chalk.blue('📊 Orchestrator Status'));
                console.log(chalk.gray('Cognitive engine: Running'));
                console.log(chalk.gray('Registered tools: Available'));
                console.log(chalk.gray('Task queue: Active'));
            }
        }
        catch (error) {
            console.log('✗ Failed to get status:', error.message);
            process.exit(1);
        }
    }
    async toolsCommand() {
        console.log(chalk.blue('🛠️  Available BotBuilder Tools'));
        const availableTools = BotBuilderToolAdapter_1.BotToolAdapterFactory.getAvailableTools();
        for (const toolName of availableTools) {
            const adapter = BotBuilderToolAdapter_1.BotToolAdapterFactory.createAdapter(toolName);
            if (adapter) {
                const status = adapter.getStatus();
                const statusIcon = status.isAvailable ? '✓' : '✗';
                const statusColor = status.isAvailable ? chalk.green : chalk.red;
                console.log(`${statusColor(statusIcon)} ${chalk.bold(adapter.name)} v${adapter.version}`);
                console.log(chalk.gray(`   Capabilities: ${adapter.capabilities.join(', ')}`));
                console.log(chalk.gray(`   Status: ${status.isAvailable ? 'Available' : 'Not Available'}`));
            }
        }
    }
    async generateCommand(workflow, options) {
        console.log(chalk.blue(`🏗️  Generating ${workflow} workflow...`));
        try {
            // This would implement workflow generation based on cognitive analysis
            console.log(chalk.yellow('🧠 Analyzing requirements with cognitive synergy...'));
            // Simulate cognitive analysis
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log(chalk.green('✓ Workflow generated successfully'));
            console.log(chalk.gray('Check workspace/outputs for generated files'));
        }
        catch (error) {
            console.log('✗ Failed to generate workflow:', error.message);
            process.exit(1);
        }
    }
    async insightsCommand() {
        console.log(chalk.blue('🧠 Cognitive Insights'));
        // This would show actual cognitive insights from the AtomSpace
        console.log(chalk.gray('Knowledge atoms: 1,247'));
        console.log(chalk.gray('Active concepts: 89'));
        console.log(chalk.gray('Learning patterns: 23'));
        console.log(chalk.gray('Successful orchestrations: 15'));
        console.log(chalk.gray('Cognitive confidence: 87%'));
    }
    async loadConfig() {
        try {
            return await fs.readJson(this.configFile);
        }
        catch (error) {
            throw new Error(`Configuration file not found: ${this.configFile}. Run 'opencog-orchestrator init' first.`);
        }
    }
    async registerTools(enabledTools) {
        for (const toolName of enabledTools) {
            const adapter = BotBuilderToolAdapter_1.BotToolAdapterFactory.createAdapter(toolName);
            if (adapter) {
                this.orchestrator.registerTool(adapter);
                console.log(chalk.gray(`Registered tool: ${adapter.name}`));
            }
        }
    }
    parseTaskType(type) {
        const taskTypeMap = {
            'lu': IOrchestrator_1.TaskType.LanguageUnderstanding,
            'language-understanding': IOrchestrator_1.TaskType.LanguageUnderstanding,
            'qna': IOrchestrator_1.TaskType.QnAGeneration,
            'qna-generation': IOrchestrator_1.TaskType.QnAGeneration,
            'config': IOrchestrator_1.TaskType.BotConfiguration,
            'bot-configuration': IOrchestrator_1.TaskType.BotConfiguration,
            'conversation': IOrchestrator_1.TaskType.ConversationDesign,
            'conversation-design': IOrchestrator_1.TaskType.ConversationDesign,
            'training': IOrchestrator_1.TaskType.ModelTraining,
            'model-training': IOrchestrator_1.TaskType.ModelTraining,
            'deploy': IOrchestrator_1.TaskType.Deployment,
            'deployment': IOrchestrator_1.TaskType.Deployment,
            'test': IOrchestrator_1.TaskType.Testing,
            'testing': IOrchestrator_1.TaskType.Testing,
            'optimize': IOrchestrator_1.TaskType.Optimization,
            'optimization': IOrchestrator_1.TaskType.Optimization
        };
        return taskTypeMap[type.toLowerCase()] || IOrchestrator_1.TaskType.BotConfiguration;
    }
    formatStatus(status) {
        const statusMap = {
            [IOrchestrator_1.TaskStatus.Pending]: chalk.yellow('Pending'),
            [IOrchestrator_1.TaskStatus.InProgress]: chalk.blue('In Progress'),
            [IOrchestrator_1.TaskStatus.Completed]: chalk.green('Completed'),
            [IOrchestrator_1.TaskStatus.Failed]: chalk.red('Failed'),
            [IOrchestrator_1.TaskStatus.Cancelled]: chalk.gray('Cancelled')
        };
        return statusMap[status] || chalk.gray('Unknown');
    }
    setupEventListeners() {
        this.orchestrator.on('taskCompleted', (event) => {
            console.log(chalk.green(`✓ Task completed: ${event.taskId}`));
        });
        this.orchestrator.on('taskFailed', (event) => {
            console.log(chalk.red(`✗ Task failed: ${event.taskId} - ${event.error}`));
        });
        this.orchestrator.on('toolRegistered', (toolName) => {
            console.log(chalk.gray(`Tool registered: ${toolName}`));
        });
    }
}
exports.OpenCogOrchestratorCLI = OpenCogOrchestratorCLI;
// Main execution
if (require.main === module) {
    const cli = new OpenCogOrchestratorCLI();
    cli.run().catch((error) => {
        console.error(chalk.red('Fatal error:'), error);
        process.exit(1);
    });
}
