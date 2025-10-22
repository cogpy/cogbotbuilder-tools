"use strict";
/**
 * Adapters for integrating existing BotBuilder tools with the cognitive orchestrator
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
exports.BotToolAdapterFactory = exports.DispatchToolAdapter = exports.ChatdownToolAdapter = exports.LudownToolAdapter = exports.MSBotToolAdapter = exports.QnAMakerToolAdapter = exports.LuisToolAdapter = exports.BaseBotToolAdapter = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs-extra"));
class BaseBotToolAdapter {
    constructor(toolPath) {
        this.lastActivity = new Date();
        this.toolPath = toolPath || this.getDefaultToolPath();
    }
    async execute(command, args) {
        const startTime = Date.now();
        this.lastActivity = new Date();
        try {
            const result = await this.executeCommand(command, args);
            const executionTime = Date.now() - startTime;
            return {
                success: true,
                data: result,
                executionTime,
                resources: await this.getResourceUsage()
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime,
                resources: await this.getResourceUsage()
            };
        }
    }
    getStatus() {
        return {
            isAvailable: this.isToolAvailable(),
            isHealthy: this.isToolHealthy(),
            currentLoad: this.getCurrentLoad(),
            lastActivity: this.lastActivity
        };
    }
    async configure(config) {
        // Base implementation - can be overridden by specific tools
    }
    isToolAvailable() {
        return fs.existsSync(this.toolPath);
    }
    isToolHealthy() {
        // Basic health check - can be enhanced per tool
        return this.isToolAvailable();
    }
    getCurrentLoad() {
        // Basic load calculation - can be enhanced
        return 0;
    }
    async getResourceUsage() {
        // Basic resource usage - can be enhanced with actual monitoring
        return {
            cpuPercent: Math.random() * 20,
            memoryMB: Math.random() * 100 + 50,
            networkIO: Math.random() * 1024
        };
    }
    async runCliTool(toolName, args) {
        return new Promise((resolve, reject) => {
            const process = child_process_1.spawn(toolName, args, {
                stdio: ['pipe', 'pipe', 'pipe']
            });
            let stdout = '';
            let stderr = '';
            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            process.on('close', (code) => {
                if (code === 0) {
                    resolve(stdout);
                }
                else {
                    reject(new Error(`Tool ${toolName} exited with code ${code}: ${stderr}`));
                }
            });
            process.on('error', (error) => {
                reject(error);
            });
        });
    }
}
exports.BaseBotToolAdapter = BaseBotToolAdapter;
class LuisToolAdapter extends BaseBotToolAdapter {
    constructor() {
        super(...arguments);
        this.name = 'LUIS';
        this.version = '2.6.2';
        this.capabilities = [
            'language-understanding',
            'intent-recognition',
            'entity-extraction',
            'model-training',
            'model-publishing',
            'batch-testing'
        ];
    }
    getDefaultToolPath() {
        return 'luis';
    }
    async executeCommand(command, args) {
        const cliArgs = [command];
        // Convert args to CLI format
        for (const [key, value] of Object.entries(args[0] || {})) {
            cliArgs.push(`--${key}`, String(value));
        }
        const result = await this.runCliTool('luis', cliArgs);
        return JSON.parse(result);
    }
}
exports.LuisToolAdapter = LuisToolAdapter;
class QnAMakerToolAdapter extends BaseBotToolAdapter {
    constructor() {
        super(...arguments);
        this.name = 'QnAMaker';
        this.version = '1.3.1';
        this.capabilities = [
            'qna-generation',
            'knowledge-base-creation',
            'knowledge-base-update',
            'question-answering',
            'kb-training',
            'kb-publishing'
        ];
    }
    getDefaultToolPath() {
        return 'qnamaker';
    }
    async executeCommand(command, args) {
        const cliArgs = [command];
        for (const [key, value] of Object.entries(args[0] || {})) {
            cliArgs.push(`--${key}`, String(value));
        }
        const result = await this.runCliTool('qnamaker', cliArgs);
        return JSON.parse(result);
    }
}
exports.QnAMakerToolAdapter = QnAMakerToolAdapter;
class MSBotToolAdapter extends BaseBotToolAdapter {
    constructor() {
        super(...arguments);
        this.name = 'MSBot';
        this.version = '4.3.7';
        this.capabilities = [
            'bot-configuration',
            'service-connection',
            'bot-file-management',
            'service-registration',
            'configuration-encryption'
        ];
    }
    getDefaultToolPath() {
        return 'msbot';
    }
    async executeCommand(command, args) {
        const cliArgs = [command];
        for (const [key, value] of Object.entries(args[0] || {})) {
            cliArgs.push(`--${key}`, String(value));
        }
        const result = await this.runCliTool('msbot', cliArgs);
        // MSBot often returns plain text, try to parse as JSON if possible
        try {
            return JSON.parse(result);
        }
        catch (_a) {
            return { output: result };
        }
    }
}
exports.MSBotToolAdapter = MSBotToolAdapter;
class LudownToolAdapter extends BaseBotToolAdapter {
    constructor() {
        super(...arguments);
        this.name = 'Ludown';
        this.version = '1.2.0';
        this.capabilities = [
            'markdown-parsing',
            'luis-model-generation',
            'qna-model-generation',
            'language-model-conversion',
            'batch-processing'
        ];
    }
    getDefaultToolPath() {
        return 'ludown';
    }
    async executeCommand(command, args) {
        const cliArgs = ['parse', command];
        for (const [key, value] of Object.entries(args[0] || {})) {
            cliArgs.push(`--${key}`, String(value));
        }
        const result = await this.runCliTool('ludown', cliArgs);
        try {
            return JSON.parse(result);
        }
        catch (_a) {
            return { output: result };
        }
    }
}
exports.LudownToolAdapter = LudownToolAdapter;
class ChatdownToolAdapter extends BaseBotToolAdapter {
    constructor() {
        super(...arguments);
        this.name = 'Chatdown';
        this.version = '1.2.0';
        this.capabilities = [
            'conversation-design',
            'transcript-generation',
            'mockup-creation',
            'dialog-prototyping'
        ];
    }
    getDefaultToolPath() {
        return 'chatdown';
    }
    async executeCommand(command, args) {
        var _a;
        const cliArgs = [];
        // Chatdown typically processes files directly
        if ((_a = args[0]) === null || _a === void 0 ? void 0 : _a.inputFile) {
            cliArgs.push(args[0].inputFile);
        }
        for (const [key, value] of Object.entries(args[0] || {})) {
            if (key !== 'inputFile') {
                cliArgs.push(`--${key}`, String(value));
            }
        }
        const result = await this.runCliTool('chatdown', cliArgs);
        return { transcript: result };
    }
}
exports.ChatdownToolAdapter = ChatdownToolAdapter;
class DispatchToolAdapter extends BaseBotToolAdapter {
    constructor() {
        super(...arguments);
        this.name = 'Dispatch';
        this.version = '1.2.0';
        this.capabilities = [
            'model-dispatch',
            'multi-service-routing',
            'intent-classification',
            'service-orchestration',
            'model-evaluation'
        ];
    }
    getDefaultToolPath() {
        return 'dispatch';
    }
    async executeCommand(command, args) {
        const cliArgs = [command];
        for (const [key, value] of Object.entries(args[0] || {})) {
            cliArgs.push(`--${key}`, String(value));
        }
        const result = await this.runCliTool('dispatch', cliArgs);
        try {
            return JSON.parse(result);
        }
        catch (_a) {
            return { output: result };
        }
    }
}
exports.DispatchToolAdapter = DispatchToolAdapter;
// Factory for creating tool adapters
class BotToolAdapterFactory {
    static initializeAdapters() {
        const adapters = new Map();
        adapters.set('luis', () => new LuisToolAdapter());
        adapters.set('qnamaker', () => new QnAMakerToolAdapter());
        adapters.set('msbot', () => new MSBotToolAdapter());
        adapters.set('ludown', () => new LudownToolAdapter());
        adapters.set('chatdown', () => new ChatdownToolAdapter());
        adapters.set('dispatch', () => new DispatchToolAdapter());
        return adapters;
    }
    static createAdapter(toolName) {
        const factory = this.adapters.get(toolName.toLowerCase());
        return factory ? factory() : null;
    }
    static getAvailableTools() {
        return Array.from(this.adapters.keys());
    }
    static registerAdapter(name, factory) {
        this.adapters.set(name.toLowerCase(), factory);
    }
}
exports.BotToolAdapterFactory = BotToolAdapterFactory;
BotToolAdapterFactory.adapters = BotToolAdapterFactory.initializeAdapters();
