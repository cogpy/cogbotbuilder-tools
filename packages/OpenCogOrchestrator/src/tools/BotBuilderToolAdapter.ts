/**
 * Adapters for integrating existing BotBuilder tools with the cognitive orchestrator
 */

import { IBotTool, IBotToolResult, IBotToolStatus, ResourceUsage } from '../interfaces/IOrchestrator';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';

export abstract class BaseBotToolAdapter implements IBotTool {
    public abstract name: string;
    public abstract version: string;
    public abstract capabilities: string[];
    
    protected toolPath: string;
    protected lastActivity: Date = new Date();
    
    constructor(toolPath?: string) {
        this.toolPath = toolPath || this.getDefaultToolPath();
    }

    async execute(command: string, args: any[]): Promise<IBotToolResult> {
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
        } catch (error) {
            return {
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime,
                resources: await this.getResourceUsage()
            };
        }
    }

    getStatus(): IBotToolStatus {
        return {
            isAvailable: this.isToolAvailable(),
            isHealthy: this.isToolHealthy(),
            currentLoad: this.getCurrentLoad(),
            lastActivity: this.lastActivity
        };
    }

    async configure(config: any): Promise<void> {
        // Base implementation - can be overridden by specific tools
    }

    protected abstract getDefaultToolPath(): string;
    protected abstract executeCommand(command: string, args: any[]): Promise<any>;
    
    protected isToolAvailable(): boolean {
        return fs.existsSync(this.toolPath);
    }

    protected isToolHealthy(): boolean {
        // Basic health check - can be enhanced per tool
        return this.isToolAvailable();
    }

    protected getCurrentLoad(): number {
        // Basic load calculation - can be enhanced
        return 0;
    }

    protected async getResourceUsage(): Promise<ResourceUsage> {
        // Basic resource usage - can be enhanced with actual monitoring
        return {
            cpuPercent: Math.random() * 20,
            memoryMB: Math.random() * 100 + 50,
            networkIO: Math.random() * 1024
        };
    }

    protected async runCliTool(toolName: string, args: string[]): Promise<string> {
        return new Promise((resolve, reject) => {
            const process = spawn(toolName, args, {
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
                } else {
                    reject(new Error(`Tool ${toolName} exited with code ${code}: ${stderr}`));
                }
            });

            process.on('error', (error) => {
                reject(error);
            });
        });
    }
}

export class LuisToolAdapter extends BaseBotToolAdapter {
    name = 'LUIS';
    version = '2.6.2';
    capabilities = [
        'language-understanding',
        'intent-recognition',
        'entity-extraction',
        'model-training',
        'model-publishing',
        'batch-testing'
    ];

    protected getDefaultToolPath(): string {
        return 'luis';
    }

    protected async executeCommand(command: string, args: any[]): Promise<any> {
        const cliArgs: string[] = [command];
        
        // Convert args to CLI format
        for (const [key, value] of Object.entries(args[0] || {})) {
            cliArgs.push(`--${key}`, String(value));
        }

        const result = await this.runCliTool('luis', cliArgs);
        return JSON.parse(result);
    }
}

export class QnAMakerToolAdapter extends BaseBotToolAdapter {
    name = 'QnAMaker';
    version = '1.3.1';
    capabilities = [
        'qna-generation',
        'knowledge-base-creation',
        'knowledge-base-update',
        'question-answering',
        'kb-training',
        'kb-publishing'
    ];

    protected getDefaultToolPath(): string {
        return 'qnamaker';
    }

    protected async executeCommand(command: string, args: any[]): Promise<any> {
        const cliArgs: string[] = [command];
        
        for (const [key, value] of Object.entries(args[0] || {})) {
            cliArgs.push(`--${key}`, String(value));
        }

        const result = await this.runCliTool('qnamaker', cliArgs);
        return JSON.parse(result);
    }
}

export class MSBotToolAdapter extends BaseBotToolAdapter {
    name = 'MSBot';
    version = '4.3.7';
    capabilities = [
        'bot-configuration',
        'service-connection',
        'bot-file-management',
        'service-registration',
        'configuration-encryption'
    ];

    protected getDefaultToolPath(): string {
        return 'msbot';
    }

    protected async executeCommand(command: string, args: any[]): Promise<any> {
        const cliArgs: string[] = [command];
        
        for (const [key, value] of Object.entries(args[0] || {})) {
            cliArgs.push(`--${key}`, String(value));
        }

        const result = await this.runCliTool('msbot', cliArgs);
        
        // MSBot often returns plain text, try to parse as JSON if possible
        try {
            return JSON.parse(result);
        } catch {
            return { output: result };
        }
    }
}

export class LudownToolAdapter extends BaseBotToolAdapter {
    name = 'Ludown';
    version = '1.2.0';
    capabilities = [
        'markdown-parsing',
        'luis-model-generation',
        'qna-model-generation',
        'language-model-conversion',
        'batch-processing'
    ];

    protected getDefaultToolPath(): string {
        return 'ludown';
    }

    protected async executeCommand(command: string, args: any[]): Promise<any> {
        const cliArgs: string[] = ['parse', command];
        
        for (const [key, value] of Object.entries(args[0] || {})) {
            cliArgs.push(`--${key}`, String(value));
        }

        const result = await this.runCliTool('ludown', cliArgs);
        
        try {
            return JSON.parse(result);
        } catch {
            return { output: result };
        }
    }
}

export class ChatdownToolAdapter extends BaseBotToolAdapter {
    name = 'Chatdown';
    version = '1.2.0';
    capabilities = [
        'conversation-design',
        'transcript-generation',
        'mockup-creation',
        'dialog-prototyping'
    ];

    protected getDefaultToolPath(): string {
        return 'chatdown';
    }

    protected async executeCommand(command: string, args: any[]): Promise<any> {
        const cliArgs: string[] = [];
        
        // Chatdown typically processes files directly
        if (args[0]?.inputFile) {
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

export class DispatchToolAdapter extends BaseBotToolAdapter {
    name = 'Dispatch';
    version = '1.2.0';
    capabilities = [
        'model-dispatch',
        'multi-service-routing',
        'intent-classification',
        'service-orchestration',
        'model-evaluation'
    ];

    protected getDefaultToolPath(): string {
        return 'dispatch';
    }

    protected async executeCommand(command: string, args: any[]): Promise<any> {
        const cliArgs: string[] = [command];
        
        for (const [key, value] of Object.entries(args[0] || {})) {
            cliArgs.push(`--${key}`, String(value));
        }

        const result = await this.runCliTool('dispatch', cliArgs);
        
        try {
            return JSON.parse(result);
        } catch {
            return { output: result };
        }
    }
}

// Factory for creating tool adapters
export class BotToolAdapterFactory {
    private static adapters = BotToolAdapterFactory.initializeAdapters();

    private static initializeAdapters(): Map<string, () => IBotTool> {
        const adapters = new Map<string, () => IBotTool>();
        adapters.set('luis', () => new LuisToolAdapter());
        adapters.set('qnamaker', () => new QnAMakerToolAdapter());
        adapters.set('msbot', () => new MSBotToolAdapter());
        adapters.set('ludown', () => new LudownToolAdapter());
        adapters.set('chatdown', () => new ChatdownToolAdapter());
        adapters.set('dispatch', () => new DispatchToolAdapter());
        return adapters;
    }

    static createAdapter(toolName: string): IBotTool | null {
        const factory = this.adapters.get(toolName.toLowerCase());
        return factory ? factory() : null;
    }

    static getAvailableTools(): string[] {
        return Array.from(this.adapters.keys());
    }

    static registerAdapter(name: string, factory: () => IBotTool): void {
        this.adapters.set(name.toLowerCase(), factory);
    }
}