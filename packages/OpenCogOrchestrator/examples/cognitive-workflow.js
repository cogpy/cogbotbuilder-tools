#!/usr/bin/env node

/**
 * Cognitive workflow example demonstrating AtomSpace operations
 */

const { AtomSpace, Atom, AtomType, TruthValue, AttentionValue } = require('../lib/index.js');

async function cognitiveWorkflowExample() {
    console.log('🧠 OpenCog AtomSpace - Cognitive Workflow Example');
    console.log('===============================================');

    try {
        // Create an AtomSpace
        const atomSpace = new AtomSpace();
        console.log('1. Created AtomSpace');

        // Add concepts related to bot development
        console.log('\n2. Adding bot development concepts...');
        
        const botConcept = new Atom(AtomType.ConceptNode, 'bot-development');
        botConcept.tv = new TruthValue(1.0, 0.9);
        botConcept.attentionValue = new AttentionValue(100, 10, false);
        atomSpace.addAtom(botConcept);
        console.log('   ✓ Added: bot-development concept');

        const luisConcept = new Atom(AtomType.ConceptNode, 'language-understanding');
        luisConcept.tv = new TruthValue(0.9, 0.8);
        luisConcept.attentionValue = new AttentionValue(80, 8, false);
        atomSpace.addAtom(luisConcept);
        console.log('   ✓ Added: language-understanding concept');

        const qnaConcept = new Atom(AtomType.ConceptNode, 'qna-generation');
        qnaConcept.tv = new TruthValue(0.8, 0.7);
        qnaConcept.attentionValue = new AttentionValue(70, 7, false);
        atomSpace.addAtom(qnaConcept);
        console.log('   ✓ Added: qna-generation concept');

        // Create relationships
        console.log('\n3. Creating cognitive relationships...');
        
        const inheritanceLink1 = new Atom(AtomType.InheritanceLink);
        inheritanceLink1.outgoing = [luisConcept.id, botConcept.id];
        inheritanceLink1.tv = new TruthValue(0.8, 0.9);
        atomSpace.addAtom(inheritanceLink1);
        console.log('   ✓ Created: language-understanding → bot-development');

        const inheritanceLink2 = new Atom(AtomType.InheritanceLink);
        inheritanceLink2.outgoing = [qnaConcept.id, botConcept.id];
        inheritanceLink2.tv = new TruthValue(0.7, 0.8);
        atomSpace.addAtom(inheritanceLink2);
        console.log('   ✓ Created: qna-generation → bot-development');

        // Add tool capabilities
        console.log('\n4. Adding tool capabilities...');
        
        const luisTool = new Atom(AtomType.BotToolNode, 'LUIS');
        luisTool.tv = new TruthValue(1.0, 1.0);
        atomSpace.addAtom(luisTool);

        const hasCapabilityPredicate = new Atom(AtomType.PredicateNode, 'hasCapability');
        atomSpace.addAtom(hasCapabilityPredicate);

        const capabilityLink = new Atom(AtomType.EvaluationLink);
        capabilityLink.outgoing = [hasCapabilityPredicate.id, luisTool.id, luisConcept.id];
        capabilityLink.tv = new TruthValue(1.0, 1.0);
        atomSpace.addAtom(capabilityLink);
        console.log('   ✓ Linked: LUIS hasCapability language-understanding');

        // Display AtomSpace statistics
        console.log('\n5. AtomSpace Statistics:');
        console.log(`   Total atoms: ${atomSpace.size()}`);
        console.log(`   Concept nodes: ${atomSpace.getAtomsByType(AtomType.ConceptNode).length}`);
        console.log(`   Tool nodes: ${atomSpace.getAtomsByType(AtomType.BotToolNode).length}`);
        console.log(`   Inheritance links: ${atomSpace.getAtomsByType(AtomType.InheritanceLink).length}`);
        console.log(`   Evaluation links: ${atomSpace.getAtomsByType(AtomType.EvaluationLink).length}`);

        // Show attentional focus
        console.log('\n6. Attentional Focus (STI > 50):');
        const focusAtoms = atomSpace.getAttentionalFocus(50);
        focusAtoms.forEach(atom => {
            console.log(`   ✓ ${atom.name} (STI: ${atom.attentionValue?.sti})`);
        });

        // Pattern matching example
        console.log('\n7. Pattern Matching Example:');
        const pattern = {
            type: AtomType.ConceptNode,
            minStrength: 0.8
        };
        const matches = atomSpace.findAtoms(pattern);
        console.log(`   Found ${matches.length} high-confidence concepts:`);
        matches.forEach(atom => {
            console.log(`   ✓ ${atom.name} (Strength: ${atom.tv.strength.toFixed(2)})`);
        });

        console.log('\n✓ Cognitive workflow demonstration complete!');

    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

// Run the example
if (require.main === module) {
    cognitiveWorkflowExample();
}

module.exports = { cognitiveWorkflowExample };