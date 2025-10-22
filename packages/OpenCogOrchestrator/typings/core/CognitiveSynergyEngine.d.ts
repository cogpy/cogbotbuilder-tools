/**
 * Cognitive Synergy Engine - Core reasoning and coordination system
 */
/// <reference types="node" />
import { IAtomSpace, ICognitiveProcess, ISynergeticModule } from '../interfaces/ICognitiveArchitecture';
import { EventEmitter } from 'events';
export declare class CognitiveSynergyEngine extends EventEmitter {
    private atomSpace;
    private processes;
    private modules;
    private isRunning;
    private cycleInterval;
    private cycleTimer?;
    constructor(atomSpace?: IAtomSpace);
    initialize(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    getAtomSpace(): IAtomSpace;
    registerProcess(process: ICognitiveProcess): void;
    unregisterProcess(processName: string): void;
    registerModule(module: ISynergeticModule): void;
    unregisterModule(moduleName: string): void;
    private cognitiveCycle;
    private attentionAllocation;
    private executeProcesses;
    private executeProcess;
    private processModules;
    private updateWorkingMemory;
    private initializeCoreProcesses;
}
