/**
 * Adapters for integrating existing BotBuilder tools with the cognitive orchestrator
 */
import { IBotTool, IBotToolResult, IBotToolStatus, ResourceUsage } from '../interfaces/IOrchestrator';
export declare abstract class BaseBotToolAdapter implements IBotTool {
    abstract name: string;
    abstract version: string;
    abstract capabilities: string[];
    protected toolPath: string;
    protected lastActivity: Date;
    constructor(toolPath?: string);
    execute(command: string, args: any[]): Promise<IBotToolResult>;
    getStatus(): IBotToolStatus;
    configure(config: any): Promise<void>;
    protected abstract getDefaultToolPath(): string;
    protected abstract executeCommand(command: string, args: any[]): Promise<any>;
    protected isToolAvailable(): boolean;
    protected isToolHealthy(): boolean;
    protected getCurrentLoad(): number;
    protected getResourceUsage(): Promise<ResourceUsage>;
    protected runCliTool(toolName: string, args: string[]): Promise<string>;
}
export declare class LuisToolAdapter extends BaseBotToolAdapter {
    name: string;
    version: string;
    capabilities: string[];
    protected getDefaultToolPath(): string;
    protected executeCommand(command: string, args: any[]): Promise<any>;
}
export declare class QnAMakerToolAdapter extends BaseBotToolAdapter {
    name: string;
    version: string;
    capabilities: string[];
    protected getDefaultToolPath(): string;
    protected executeCommand(command: string, args: any[]): Promise<any>;
}
export declare class MSBotToolAdapter extends BaseBotToolAdapter {
    name: string;
    version: string;
    capabilities: string[];
    protected getDefaultToolPath(): string;
    protected executeCommand(command: string, args: any[]): Promise<any>;
}
export declare class LudownToolAdapter extends BaseBotToolAdapter {
    name: string;
    version: string;
    capabilities: string[];
    protected getDefaultToolPath(): string;
    protected executeCommand(command: string, args: any[]): Promise<any>;
}
export declare class ChatdownToolAdapter extends BaseBotToolAdapter {
    name: string;
    version: string;
    capabilities: string[];
    protected getDefaultToolPath(): string;
    protected executeCommand(command: string, args: any[]): Promise<any>;
}
export declare class DispatchToolAdapter extends BaseBotToolAdapter {
    name: string;
    version: string;
    capabilities: string[];
    protected getDefaultToolPath(): string;
    protected executeCommand(command: string, args: any[]): Promise<any>;
}
export declare class BotToolAdapterFactory {
    private static adapters;
    private static initializeAdapters;
    static createAdapter(toolName: string): IBotTool | null;
    static getAvailableTools(): string[];
    static registerAdapter(name: string, factory: () => IBotTool): void;
}
