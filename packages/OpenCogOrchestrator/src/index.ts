/**
 * OpenCog Orchestrator - Main library entry point
 */

// Core cognitive architecture
export * from './interfaces/ICognitiveArchitecture';
export * from './interfaces/IOrchestrator';
export * from './core/AtomSpace';
export * from './core/CognitiveSynergyEngine';

// Orchestrator
export * from './orchestrator/AutonomousOrchestrator';

// Tool adapters
export * from './tools/BotBuilderToolAdapter';

// CLI
export * from './cli/SimpleCLI';