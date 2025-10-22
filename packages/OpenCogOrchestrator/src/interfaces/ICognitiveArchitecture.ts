/**
 * Core interfaces for OpenCog-based cognitive synergy architecture
 */

export interface IAtom {
    id: string;
    type: AtomType;
    name?: string;
    tv: TruthValue;
    attentionValue?: AttentionValue;
    incoming: string[];
    outgoing: string[];
}

export interface ITruthValue {
    strength: number;
    confidence: number;
}

export interface IAttentionValue {
    sti: number; // Short-term importance
    lti: number; // Long-term importance
    vlti: boolean; // Very long-term importance
}

export enum AtomType {
    // Basic types
    Node = 'Node',
    Link = 'Link',
    
    // Concept types
    ConceptNode = 'ConceptNode',
    PredicateNode = 'PredicateNode',
    SchemaNode = 'SchemaNode',
    
    // Link types
    InheritanceLink = 'InheritanceLink',
    SimilarityLink = 'SimilarityLink',
    ImplicationLink = 'ImplicationLink',
    ExecutionLink = 'ExecutionLink',
    EvaluationLink = 'EvaluationLink',
    
    // Bot tool specific types
    BotToolNode = 'BotToolNode',
    TaskNode = 'TaskNode',
    ContextNode = 'ContextNode',
    StrategyNode = 'StrategyNode'
}

export class TruthValue implements ITruthValue {
    constructor(
        public strength: number = 1.0,
        public confidence: number = 1.0
    ) {}

    static simple(strength: number, confidence: number): TruthValue {
        return new TruthValue(strength, confidence);
    }
}

export class AttentionValue implements IAttentionValue {
    constructor(
        public sti: number = 0,
        public lti: number = 0,
        public vlti: boolean = false
    ) {}
}

export interface IAtomSpace {
    addAtom(atom: IAtom): string;
    getAtom(id: string): IAtom | null;
    removeAtom(id: string): boolean;
    getAtomsByType(type: AtomType): IAtom[];
    getIncomingSet(atomId: string): IAtom[];
    getOutgoingSet(atomId: string): IAtom[];
    size(): number;
    clear(): void;
}

export interface ICognitiveProcess {
    name: string;
    priority: number;
    execute(atomSpace: IAtomSpace): Promise<boolean>;
    canExecute(atomSpace: IAtomSpace): boolean;
}

export interface ISynergeticModule {
    name: string;
    initialize(atomSpace: IAtomSpace): Promise<void>;
    process(atomSpace: IAtomSpace): Promise<void>;
    shutdown(): Promise<void>;
}

export interface ICognitiveAgent {
    id: string;
    name: string;
    goals: IAtom[];
    perceive(environment: any): IAtom[];
    reason(atomSpace: IAtomSpace): IAtom[];
    act(actions: IAtom[]): Promise<any>;
}