/**
 * Tests for AtomSpace implementation
 */

import { expect } from 'chai';
import { AtomSpace, Atom } from '../../src/core/AtomSpace';
import { AtomType, TruthValue, AttentionValue } from '../../src/interfaces/ICognitiveArchitecture';

describe('AtomSpace', () => {
    let atomSpace: AtomSpace;

    beforeEach(() => {
        atomSpace = new AtomSpace();
    });

    describe('Basic operations', () => {
        it('should create an empty atom space', () => {
            expect(atomSpace.size()).to.equal(0);
        });

        it('should add an atom and return its ID', () => {
            const atom = new Atom(AtomType.ConceptNode, 'test-concept');
            const atomId = atomSpace.addAtom(atom);
            
            expect(atomId).to.equal(atom.id);
            expect(atomSpace.size()).to.equal(1);
        });

        it('should retrieve an atom by ID', () => {
            const atom = new Atom(AtomType.ConceptNode, 'test-concept');
            const atomId = atomSpace.addAtom(atom);
            
            const retrievedAtom = atomSpace.getAtom(atomId);
            expect(retrievedAtom).to.not.be.null;
            expect(retrievedAtom!.name).to.equal('test-concept');
        });

        it('should remove an atom', () => {
            const atom = new Atom(AtomType.ConceptNode, 'test-concept');
            const atomId = atomSpace.addAtom(atom);
            
            const removed = atomSpace.removeAtom(atomId);
            expect(removed).to.be.true;
            expect(atomSpace.size()).to.equal(0);
        });
    });

    describe('Type indexing', () => {
        it('should find atoms by type', () => {
            const concept1 = new Atom(AtomType.ConceptNode, 'concept1');
            const concept2 = new Atom(AtomType.ConceptNode, 'concept2');
            const predicate = new Atom(AtomType.PredicateNode, 'predicate1');
            
            atomSpace.addAtom(concept1);
            atomSpace.addAtom(concept2);
            atomSpace.addAtom(predicate);
            
            const concepts = atomSpace.getAtomsByType(AtomType.ConceptNode);
            const predicates = atomSpace.getAtomsByType(AtomType.PredicateNode);
            
            expect(concepts).to.have.length(2);
            expect(predicates).to.have.length(1);
        });
    });
});