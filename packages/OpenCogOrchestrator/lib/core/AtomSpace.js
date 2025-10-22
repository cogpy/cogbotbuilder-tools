"use strict";
/**
 * AtomSpace implementation for cognitive synergy architecture
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomSpace = exports.Atom = void 0;
const ICognitiveArchitecture_1 = require("../interfaces/ICognitiveArchitecture");
const uuid_1 = require("uuid");
class Atom {
    constructor(type, name, tv, attentionValue) {
        this.incoming = [];
        this.outgoing = [];
        this.id = uuid_1.v4();
        this.type = type;
        this.name = name;
        this.tv = tv || new ICognitiveArchitecture_1.TruthValue();
        this.attentionValue = attentionValue;
    }
}
exports.Atom = Atom;
class AtomSpace {
    constructor() {
        this.atoms = new Map();
        this.typeIndex = new Map();
        this.nameIndex = new Map();
    }
    addAtom(atom) {
        // Add atom to main storage
        this.atoms.set(atom.id, atom);
        // Update type index
        if (!this.typeIndex.has(atom.type)) {
            this.typeIndex.set(atom.type, new Set());
        }
        this.typeIndex.get(atom.type).add(atom.id);
        // Update name index if atom has a name
        if (atom.name) {
            if (!this.nameIndex.has(atom.name)) {
                this.nameIndex.set(atom.name, new Set());
            }
            this.nameIndex.get(atom.name).add(atom.id);
        }
        // Update incoming/outgoing relationships
        this.updateRelationships(atom);
        return atom.id;
    }
    getAtom(id) {
        return this.atoms.get(id) || null;
    }
    removeAtom(id) {
        const atom = this.atoms.get(id);
        if (!atom)
            return false;
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
    getAtomsByType(type) {
        const atomIds = this.typeIndex.get(type);
        if (!atomIds)
            return [];
        return Array.from(atomIds)
            .map(id => this.atoms.get(id))
            .filter(atom => atom !== undefined);
    }
    getAtomsByName(name) {
        const atomIds = this.nameIndex.get(name);
        if (!atomIds)
            return [];
        return Array.from(atomIds)
            .map(id => this.atoms.get(id))
            .filter(atom => atom !== undefined);
    }
    getIncomingSet(atomId) {
        const atom = this.atoms.get(atomId);
        if (!atom)
            return [];
        return atom.incoming
            .map(id => this.atoms.get(id))
            .filter(atom => atom !== undefined);
    }
    getOutgoingSet(atomId) {
        const atom = this.atoms.get(atomId);
        if (!atom)
            return [];
        return atom.outgoing
            .map(id => this.atoms.get(id))
            .filter(atom => atom !== undefined);
    }
    size() {
        return this.atoms.size;
    }
    clear() {
        this.atoms.clear();
        this.typeIndex.clear();
        this.nameIndex.clear();
    }
    // Pattern matching methods
    findAtoms(pattern) {
        let candidates = Array.from(this.atoms.values());
        if (pattern.type) {
            candidates = this.getAtomsByType(pattern.type);
        }
        return candidates.filter(atom => this.matchesPattern(atom, pattern));
    }
    // Attention allocation methods
    updateAttention(atomId, attentionValue) {
        const atom = this.atoms.get(atomId);
        if (!atom)
            return false;
        atom.attentionValue = attentionValue;
        return true;
    }
    getAttentionalFocus(threshold = 0) {
        return Array.from(this.atoms.values())
            .filter(atom => atom.attentionValue && atom.attentionValue.sti > threshold)
            .sort((a, b) => (b.attentionValue.sti) - (a.attentionValue.sti));
    }
    // Utility methods
    updateRelationships(atom) {
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
    removeRelationships(atom) {
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
    matchesPattern(atom, pattern) {
        if (pattern.type && atom.type !== pattern.type)
            return false;
        if (pattern.name && atom.name !== pattern.name)
            return false;
        if (pattern.minStrength && atom.tv.strength < pattern.minStrength)
            return false;
        if (pattern.minConfidence && atom.tv.confidence < pattern.minConfidence)
            return false;
        return true;
    }
}
exports.AtomSpace = AtomSpace;
