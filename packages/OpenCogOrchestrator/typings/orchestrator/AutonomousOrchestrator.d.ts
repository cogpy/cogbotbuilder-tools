/**
 * Autonomous Orchestrator - Main coordination system for BotBuilder tools
 */
/// <reference types="node" />
import { IAutonomousOrchestrator, IBotTool, ITask, TaskStatus, IBotToolResult } from '../interfaces/IOrchestrator';
import { EventEmitter } from 'events';
export declare class AutonomousOrchestrator extends EventEmitter implements IAutonomousOrchestrator {
    private cognitiveEngine;
    private atomSpace;
    private tools;
    private tasks;
    private strategies;
    private learningModules;
    private logger;
    private executionQueue;
    private isProcessing;
    constructor();
    initialize(): Promise<void>;
    registerTool(tool: IBotTool): void;
    submitTask(task: ITask): Promise<string>;
    getTaskStatus(taskId: string): Promise<TaskStatus>;
    getTaskResult(taskId: string): Promise<IBotToolResult>;
    shutdown(): Promise<void>;
    private initializeKnowledgeBase;
    private createKnowledgeRelationships;
    private getOrCreateAtom;
    private startTaskProcessing;
    private processNextTask;
    private selectStrategy;
    private executePlan;
    private learnFromExecution;
    private registerDefaultStrategies;
    private createLogger;
}
