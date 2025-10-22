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
    sti: number;
    lti: number;
    vlti: boolean;
}
export declare enum AtomType {
    Node = "Node",
    Link = "Link",
    ConceptNode = "ConceptNode",
    PredicateNode = "PredicateNode",
    SchemaNode = "SchemaNode",
    InheritanceLink = "InheritanceLink",
    SimilarityLink = "SimilarityLink",
    ImplicationLink = "ImplicationLink",
    ExecutionLink = "ExecutionLink",
    EvaluationLink = "EvaluationLink",
    BotToolNode = "BotToolNode",
    TaskNode = "TaskNode",
    ContextNode = "ContextNode",
    StrategyNode = "StrategyNode"
}
export declare class TruthValue implements ITruthValue {
    strength: number;
    confidence: number;
    constructor(strength?: number, confidence?: number);
    static simple(strength: number, confidence: number): TruthValue;
}
export declare class AttentionValue implements IAttentionValue {
    sti: number;
    lti: number;
    vlti: boolean;
    constructor(sti?: number, lti?: number, vlti?: boolean);
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
