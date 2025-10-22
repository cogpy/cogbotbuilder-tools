/**
 * Interfaces for autonomous orchestration of BotBuilder tools
 */
import { IAtom } from './ICognitiveArchitecture';
export interface IBotTool {
    name: string;
    version: string;
    capabilities: string[];
    execute(command: string, args: any[]): Promise<IBotToolResult>;
    getStatus(): IBotToolStatus;
    configure(config: any): Promise<void>;
}
export interface IBotToolResult {
    success: boolean;
    data?: any;
    error?: string;
    executionTime: number;
    resources: ResourceUsage;
}
export interface IBotToolStatus {
    isAvailable: boolean;
    isHealthy: boolean;
    currentLoad: number;
    lastActivity: Date;
}
export interface ResourceUsage {
    cpuPercent: number;
    memoryMB: number;
    networkIO: number;
}
export interface ITask {
    id: string;
    type: TaskType;
    priority: number;
    requirements: string[];
    context: ITaskContext;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum TaskType {
    LanguageUnderstanding = "LanguageUnderstanding",
    QnAGeneration = "QnAGeneration",
    BotConfiguration = "BotConfiguration",
    ConversationDesign = "ConversationDesign",
    ModelTraining = "ModelTraining",
    Deployment = "Deployment",
    Testing = "Testing",
    Optimization = "Optimization"
}
export declare enum TaskStatus {
    Pending = "Pending",
    InProgress = "InProgress",
    Completed = "Completed",
    Failed = "Failed",
    Cancelled = "Cancelled"
}
export interface ITaskContext {
    userIntent: string;
    domainKnowledge: IAtom[];
    previousResults: IBotToolResult[];
    constraints: IConstraint[];
    preferences: IPreference[];
}
export interface IConstraint {
    type: ConstraintType;
    value: any;
    priority: number;
}
export declare enum ConstraintType {
    MaxExecutionTime = "MaxExecutionTime",
    MaxMemoryUsage = "MaxMemoryUsage",
    RequiredTools = "RequiredTools",
    QualityThreshold = "QualityThreshold"
}
export interface IPreference {
    type: PreferenceType;
    value: any;
    weight: number;
}
export declare enum PreferenceType {
    Speed = "Speed",
    Quality = "Quality",
    ResourceEfficiency = "ResourceEfficiency",
    Reliability = "Reliability"
}
export interface IOrchestrationStrategy {
    name: string;
    evaluate(task: ITask, availableTools: IBotTool[]): Promise<IOrchestrationPlan>;
    adapt(feedback: IOrchestrationFeedback): Promise<void>;
}
export interface IOrchestrationPlan {
    id: string;
    taskId: string;
    steps: IOrchestrationStep[];
    estimatedDuration: number;
    estimatedResources: ResourceUsage;
    confidence: number;
}
export interface IOrchestrationStep {
    id: string;
    tool: string;
    command: string;
    args: any[];
    dependencies: string[];
    timeout: number;
}
export interface IOrchestrationFeedback {
    planId: string;
    actualDuration: number;
    actualResources: ResourceUsage;
    success: boolean;
    qualityMetrics: IQualityMetric[];
    userSatisfaction?: number;
}
export interface IQualityMetric {
    name: string;
    value: number;
    unit: string;
    higherIsBetter: boolean;
}
export interface IAutonomousOrchestrator {
    initialize(): Promise<void>;
    registerTool(tool: IBotTool): void;
    submitTask(task: ITask): Promise<string>;
    getTaskStatus(taskId: string): Promise<TaskStatus>;
    getTaskResult(taskId: string): Promise<IBotToolResult>;
    shutdown(): Promise<void>;
}
export interface ILearningModule {
    name: string;
    learn(experiences: IOrchestrationExperience[]): Promise<void>;
    predict(context: ITaskContext): Promise<IOrchestrationRecommendation>;
    getKnowledge(): IAtom[];
}
export interface IOrchestrationExperience {
    task: ITask;
    plan: IOrchestrationPlan;
    feedback: IOrchestrationFeedback;
    context: ITaskContext;
}
export interface IOrchestrationRecommendation {
    suggestedStrategy: string;
    confidence: number;
    reasoning: IAtom[];
    alternatives: IAlternativeRecommendation[];
}
export interface IAlternativeRecommendation {
    strategy: string;
    confidence: number;
    tradeoffs: string[];
}
