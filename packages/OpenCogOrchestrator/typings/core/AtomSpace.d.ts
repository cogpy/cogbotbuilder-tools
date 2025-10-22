/**
 * AtomSpace implementation for cognitive synergy architecture
 */
import { IAtom, IAtomSpace, AtomType, TruthValue, AttentionValue } from '../interfaces/ICognitiveArchitecture';
export declare class Atom implements IAtom {
    id: string;
    type: AtomType;
    name?: string;
    tv: TruthValue;
    attentionValue?: AttentionValue;
    incoming: string[];
    outgoing: string[];
    constructor(type: AtomType, name?: string, tv?: TruthValue, attentionValue?: AttentionValue);
}
export declare class AtomSpace implements IAtomSpace {
    private atoms;
    private typeIndex;
    private nameIndex;
    addAtom(atom: IAtom): string;
    getAtom(id: string): IAtom | null;
    removeAtom(id: string): boolean;
    getAtomsByType(type: AtomType): IAtom[];
    getAtomsByName(name: string): IAtom[];
    getIncomingSet(atomId: string): IAtom[];
    getOutgoingSet(atomId: string): IAtom[];
    size(): number;
    clear(): void;
    findAtoms(pattern: IAtomPattern): IAtom[];
    updateAttention(atomId: string, attentionValue: AttentionValue): boolean;
    getAttentionalFocus(threshold?: number): IAtom[];
    private updateRelationships;
    private removeRelationships;
    private matchesPattern;
}
export interface IAtomPattern {
    type?: AtomType;
    name?: string;
    minStrength?: number;
    minConfidence?: number;
    outgoingCount?: number;
    incomingCount?: number;
}
