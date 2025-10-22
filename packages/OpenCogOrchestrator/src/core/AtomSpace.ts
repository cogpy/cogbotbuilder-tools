/**
 * AtomSpace implementation for cognitive synergy architecture
 */

import { IAtom, IAtomSpace, AtomType, TruthValue, AttentionValue } from '../interfaces/ICognitiveArchitecture';
import { v4 as uuidv4 } from 'uuid';

export class Atom implements IAtom {
    public id: string;
    public type: AtomType;
    public name?: string;
    public tv: TruthValue;
    public attentionValue?: AttentionValue;
    public incoming: string[] = [];
    public outgoing: string[] = [];

    constructor(
        type: AtomType,
        name?: string,
        tv?: TruthValue,
        attentionValue?: AttentionValue
    ) {
        this.id = uuidv4();
        this.type = type;
        this.name = name;
        this.tv = tv || new TruthValue();
        this.attentionValue = attentionValue;
    }
}

export class AtomSpace implements IAtomSpace {
    private atoms: Map<string, IAtom> = new Map();
    private typeIndex: Map<AtomType, Set<string>> = new Map();
    private nameIndex: Map<string, Set<string>> = new Map();

    addAtom(atom: IAtom): string {
        // Add atom to main storage
        this.atoms.set(atom.id, atom);
        
        // Update type index
        if (!this.typeIndex.has(atom.type)) {
            this.typeIndex.set(atom.type, new Set());
        }
        this.typeIndex.get(atom.type)!.add(atom.id);
        
        // Update name index if atom has a name
        if (atom.name) {
            if (!this.nameIndex.has(atom.name)) {
                this.nameIndex.set(atom.name, new Set());
            }
            this.nameIndex.get(atom.name)!.add(atom.id);
        }
        
        // Update incoming/outgoing relationships
        this.updateRelationships(atom);
        
        return atom.id;
    }

    getAtom(id: string): IAtom | null {
        return this.atoms.get(id) || null;
    }

    removeAtom(id: string): boolean {
        const atom = this.atoms.get(id);
        if (!atom) return false;
        
        // Remove from type index
        const typeSet = this.typeIndex.get(atom.type);
        if (typeSet) {
            typeSet.delete(id);
            if (typeSet.size === 0) {
                this.typeIndex.delete(atom.type);
            }
        }
        
        // Remove from name index
        if (atom.name) {
            const nameSet = this.nameIndex.get(atom.name);
            if (nameSet) {
                nameSet.delete(id);
                if (nameSet.size === 0) {
                    this.nameIndex.delete(atom.name);
                }
            }
        }
        
        // Remove relationships
        this.removeRelationships(atom);
        
        // Remove from main storage
        return this.atoms.delete(id);
    }

    getAtomsByType(type: AtomType): IAtom[] {
        const atomIds = this.typeIndex.get(type);
        if (!atomIds) return [];
        
        return Array.from(atomIds)
            .map(id => this.atoms.get(id))
            .filter(atom => atom !== undefined) as IAtom[];
    }

    getAtomsByName(name: string): IAtom[] {
        const atomIds = this.nameIndex.get(name);
        if (!atomIds) return [];
        
        return Array.from(atomIds)
            .map(id => this.atoms.get(id))
            .filter(atom => atom !== undefined) as IAtom[];
    }

    getIncomingSet(atomId: string): IAtom[] {
        const atom = this.atoms.get(atomId);
        if (!atom) return [];
        
        return atom.incoming
            .map(id => this.atoms.get(id))
            .filter(atom => atom !== undefined) as IAtom[];
    }

    getOutgoingSet(atomId: string): IAtom[] {
        const atom = this.atoms.get(atomId);
        if (!atom) return [];
        
        return atom.outgoing
            .map(id => this.atoms.get(id))
            .filter(atom => atom !== undefined) as IAtom[];
    }

    size(): number {
        return this.atoms.size;
    }

    clear(): void {
        this.atoms.clear();
        this.typeIndex.clear();
        this.nameIndex.clear();
    }

    // Pattern matching methods
    findAtoms(pattern: IAtomPattern): IAtom[] {
        let candidates = Array.from(this.atoms.values());
        
        if (pattern.type) {
            candidates = this.getAtomsByType(pattern.type);
        }
        
        return candidates.filter(atom => this.matchesPattern(atom, pattern));
    }

    // Attention allocation methods
    updateAttention(atomId: string, attentionValue: AttentionValue): boolean {
        const atom = this.atoms.get(atomId);
        if (!atom) return false;
        
        atom.attentionValue = attentionValue;
        return true;
    }

    getAttentionalFocus(threshold: number = 0): IAtom[] {
        return Array.from(this.atoms.values())
            .filter(atom => atom.attentionValue && atom.attentionValue.sti > threshold)
            .sort((a, b) => (b.attentionValue!.sti) - (a.attentionValue!.sti));
    }

    // Utility methods
    private updateRelationships(atom: IAtom): void {
        // For link atoms, update incoming/outgoing relationships
        if (atom.type.endsWith('Link') && atom.outgoing.length > 0) {
            for (const targetId of atom.outgoing) {
                const targetAtom = this.atoms.get(targetId);
                if (targetAtom && !targetAtom.incoming.includes(atom.id)) {
                    targetAtom.incoming.push(atom.id);
                }
            }
        }
    }

    private removeRelationships(atom: IAtom): void {
        // Remove this atom from incoming sets of its outgoing atoms
        for (const targetId of atom.outgoing) {
            const targetAtom = this.atoms.get(targetId);
            if (targetAtom) {
                const index = targetAtom.incoming.indexOf(atom.id);
                if (index > -1) {
                    targetAtom.incoming.splice(index, 1);
                }
            }
        }
        
        // Remove this atom from outgoing sets of its incoming atoms
        for (const sourceId of atom.incoming) {
            const sourceAtom = this.atoms.get(sourceId);
            if (sourceAtom) {
                const index = sourceAtom.outgoing.indexOf(atom.id);
                if (index > -1) {
                    sourceAtom.outgoing.splice(index, 1);
                }
            }
        }
    }

    private matchesPattern(atom: IAtom, pattern: IAtomPattern): boolean {
        if (pattern.type && atom.type !== pattern.type) return false;
        if (pattern.name && atom.name !== pattern.name) return false;
        if (pattern.minStrength && atom.tv.strength < pattern.minStrength) return false;
        if (pattern.minConfidence && atom.tv.confidence < pattern.minConfidence) return false;
        
        return true;
    }
}

export interface IAtomPattern {
    type?: AtomType;
    name?: string;
    minStrength?: number;
    minConfidence?: number;
    outgoingCount?: number;
    incomingCount?: number;
}