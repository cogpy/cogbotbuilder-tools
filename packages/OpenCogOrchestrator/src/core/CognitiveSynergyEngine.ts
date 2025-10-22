/**
 * Cognitive Synergy Engine - Core reasoning and coordination system
 */

import { IAtomSpace, ICognitiveProcess, ISynergeticModule, AtomType, TruthValue } from '../interfaces/ICognitiveArchitecture';
import { AtomSpace, Atom } from './AtomSpace';
import { EventEmitter } from 'events';

export class CognitiveSynergyEngine extends EventEmitter {
    private atomSpace: IAtomSpace;
    private processes: Map<string, ICognitiveProcess> = new Map();
    private modules: Map<string, ISynergeticModule> = new Map();
    private isRunning = false;
    private cycleInterval = 100; // milliseconds
    private cycleTimer?: NodeJS.Timeout;

    constructor(atomSpace?: IAtomSpace) {
        super();
        this.atomSpace = atomSpace || new AtomSpace();
    }

    async initialize(): Promise<void> {
        // Initialize core cognitive processes
        await this.initializeCoreProcesses();
        
        // Initialize synergetic modules
        for (const module of this.modules.values()) {
            await module.initialize(this.atomSpace);
        }
        
        this.emit('initialized');
    }

    async start(): Promise<void> {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.cycleTimer = setInterval(() => {
            this.cognitiveCycle().catch(error => {
                this.emit('error', error);
            });
        }, this.cycleInterval);
        
        this.emit('started');
    }

    async stop(): Promise<void> {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        if (this.cycleTimer) {
            clearInterval(this.cycleTimer);
            this.cycleTimer = undefined;
        }
        
        // Shutdown modules
        for (const module of this.modules.values()) {
            await module.shutdown();
        }
        
        this.emit('stopped');
    }

    getAtomSpace(): IAtomSpace {
        return this.atomSpace;
    }

    registerProcess(process: ICognitiveProcess): void {
        this.processes.set(process.name, process);
        this.emit('processRegistered', process.name);
    }

    unregisterProcess(processName: string): void {
        this.processes.delete(processName);
        this.emit('processUnregistered', processName);
    }

    registerModule(module: ISynergeticModule): void {
        this.modules.set(module.name, module);
        this.emit('moduleRegistered', module.name);
    }

    unregisterModule(moduleName: string): void {
        this.modules.delete(moduleName);
        this.emit('moduleUnregistered', moduleName);
    }

    // Core cognitive cycle
    private async cognitiveCycle(): Promise<void> {
        try {
            // 1. Attention allocation
            await this.attentionAllocation();
            
            // 2. Execute cognitive processes
            await this.executeProcesses();
            
            // 3. Process synergetic modules
            await this.processModules();
            
            // 4. Update working memory
            await this.updateWorkingMemory();
            
            // 5. Emit cycle completion
            this.emit('cycleCompleted', {
                timestamp: new Date(),
                atomSpaceSize: this.atomSpace.size()
            });
            
        } catch (error) {
            this.emit('cycleError', error);
        }
    }

    private async attentionAllocation(): Promise<void> {
        // Implement importance spreading and attention focusing
        const focusAtoms = (this.atomSpace as AtomSpace).getAttentionalFocus(50);
        
        // Spread importance to related atoms
        for (const atom of focusAtoms) {
            const relatedAtoms = [
                ...(this.atomSpace as AtomSpace).getIncomingSet(atom.id),
                ...(this.atomSpace as AtomSpace).getOutgoingSet(atom.id)
            ];
            
            for (const related of relatedAtoms) {
                if (related.attentionValue) {
                    related.attentionValue.sti *= 0.9; // Decay
                }
            }
        }
    }

    private async executeProcesses(): Promise<void> {
        // Sort processes by priority
        const sortedProcesses = Array.from(this.processes.values())
            .filter(p => p.canExecute(this.atomSpace))
            .sort((a, b) => b.priority - a.priority);

        // Execute high-priority processes
        const executionPromises = sortedProcesses
            .slice(0, 3) // Limit concurrent processes
            .map(process => this.executeProcess(process));

        await Promise.all(executionPromises.map(p => p.catch(e => e)));
    }

    private async executeProcess(process: ICognitiveProcess): Promise<void> {
        try {
            const startTime = Date.now();
            const success = await process.execute(this.atomSpace);
            const duration = Date.now() - startTime;
            
            this.emit('processExecuted', {
                processName: process.name,
                success,
                duration
            });
        } catch (error) {
            this.emit('processError', {
                processName: process.name,
                error
            });
        }
    }

    private async processModules(): Promise<void> {
        for (const module of this.modules.values()) {
            try {
                await module.process(this.atomSpace);
            } catch (error) {
                this.emit('moduleError', {
                    moduleName: module.name,
                    error
                });
            }
        }
    }

    private async updateWorkingMemory(): Promise<void> {
        // Implement working memory management
        // Remove low-importance atoms to maintain focus
        const allAtoms = (this.atomSpace as AtomSpace).getAtomsByType(AtomType.Node);
        const lowImportanceAtoms = allAtoms
            .filter(atom => atom.attentionValue && atom.attentionValue.sti < -100)
            .slice(0, 10); // Remove up to 10 atoms per cycle

        for (const atom of lowImportanceAtoms) {
            this.atomSpace.removeAtom(atom.id);
        }
    }

    private async initializeCoreProcesses(): Promise<void> {
        // Pattern Matching Process
        this.registerProcess(new PatternMatchingProcess());
        
        // Inference Process
        this.registerProcess(new InferenceProcess());
        
        // Learning Process
        this.registerProcess(new LearningProcess());
        
        // Goal-directed Process
        this.registerProcess(new GoalDirectedProcess());
    }
}

// Core cognitive processes implementations
class PatternMatchingProcess implements ICognitiveProcess {
    name = 'PatternMatching';
    priority = 80;

    async execute(atomSpace: IAtomSpace): Promise<boolean> {
        // Find patterns in the atomspace
        const atoms = (atomSpace as AtomSpace).getAtomsByType(AtomType.ConceptNode);
        
        // Simple similarity detection
        for (let i = 0; i < atoms.length - 1; i++) {
            for (let j = i + 1; j < atoms.length; j++) {
                const similarity = this.calculateSimilarity(atoms[i], atoms[j]);
                if (similarity > 0.7) {
                    // Create similarity link
                    const similarityLink = new Atom(
                        AtomType.SimilarityLink,
                        undefined,
                        new TruthValue(similarity, 0.8)
                    );
                    similarityLink.outgoing = [atoms[i].id, atoms[j].id];
                    atomSpace.addAtom(similarityLink);
                }
            }
        }
        
        return true;
    }

    canExecute(atomSpace: IAtomSpace): boolean {
        return (atomSpace as AtomSpace).getAtomsByType(AtomType.ConceptNode).length > 1;
    }

    private calculateSimilarity(atom1: any, atom2: any): number {
        // Simple name-based similarity
        if (!atom1.name || !atom2.name) return 0;
        
        const name1 = atom1.name.toLowerCase();
        const name2 = atom2.name.toLowerCase();
        
        // Jaccard similarity for words
        const words1 = new Set(name1.split(' '));
        const words2 = new Set(name2.split(' '));
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }
}

class InferenceProcess implements ICognitiveProcess {
    name = 'Inference';
    priority = 70;

    async execute(atomSpace: IAtomSpace): Promise<boolean> {
        // Simple inheritance chain reasoning
        const inheritanceLinks = (atomSpace as AtomSpace).getAtomsByType(AtomType.InheritanceLink);
        
        for (const link of inheritanceLinks) {
            if (link.outgoing.length === 2) {
                const [childId, parentId] = link.outgoing;
                const child = atomSpace.getAtom(childId);
                const parent = atomSpace.getAtom(parentId);
                
                if (child && parent) {
                    // Strengthen the inheritance relationship based on evidence
                    link.tv.strength = Math.min(1.0, link.tv.strength + 0.01);
                }
            }
        }
        
        return true;
    }

    canExecute(atomSpace: IAtomSpace): boolean {
        return (atomSpace as AtomSpace).getAtomsByType(AtomType.InheritanceLink).length > 0;
    }
}

class LearningProcess implements ICognitiveProcess {
    name = 'Learning';
    priority = 60;

    async execute(atomSpace: IAtomSpace): Promise<boolean> {
        // Implement reinforcement learning for successful patterns
        const focusAtoms = (atomSpace as AtomSpace).getAttentionalFocus(10);
        
        // Strengthen frequently accessed patterns
        for (const atom of focusAtoms) {
            if (atom.attentionValue) {
                atom.tv.confidence = Math.min(1.0, atom.tv.confidence + 0.001);
            }
        }
        
        return true;
    }

    canExecute(atomSpace: IAtomSpace): boolean {
        return (atomSpace as AtomSpace).getAttentionalFocus(0).length > 0;
    }
}

class GoalDirectedProcess implements ICognitiveProcess {
    name = 'GoalDirected';
    priority = 90;

    async execute(atomSpace: IAtomSpace): Promise<boolean> {
        // Find and prioritize goal-related atoms
        const goalAtoms = (atomSpace as AtomSpace).findAtoms({
            type: AtomType.ConceptNode,
            name: 'goal'
        });
        
        // Increase attention for goal-related concepts
        for (const goalAtom of goalAtoms) {
            if (goalAtom.attentionValue) {
                goalAtom.attentionValue.sti += 10;
            }
        }
        
        return true;
    }

    canExecute(atomSpace: IAtomSpace): boolean {
        return true; // Always can execute
    }
}