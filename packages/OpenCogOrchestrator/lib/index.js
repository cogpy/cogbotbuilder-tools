"use strict";
/**
 * OpenCog Orchestrator - Main library entry point
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core cognitive architecture
__exportStar(require("./interfaces/ICognitiveArchitecture"), exports);
__exportStar(require("./interfaces/IOrchestrator"), exports);
__exportStar(require("./core/AtomSpace"), exports);
__exportStar(require("./core/CognitiveSynergyEngine"), exports);
// Orchestrator
__exportStar(require("./orchestrator/AutonomousOrchestrator"), exports);
// Tool adapters
__exportStar(require("./tools/BotBuilderToolAdapter"), exports);
// CLI
__exportStar(require("./cli/SimpleCLI"), exports);
