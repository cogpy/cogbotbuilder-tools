"use strict";
/**
 * Core interfaces for OpenCog-based cognitive synergy architecture
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttentionValue = exports.TruthValue = exports.AtomType = void 0;
var AtomType;
(function (AtomType) {
    // Basic types
    AtomType["Node"] = "Node";
    AtomType["Link"] = "Link";
    // Concept types
    AtomType["ConceptNode"] = "ConceptNode";
    AtomType["PredicateNode"] = "PredicateNode";
    AtomType["SchemaNode"] = "SchemaNode";
    // Link types
    AtomType["InheritanceLink"] = "InheritanceLink";
    AtomType["SimilarityLink"] = "SimilarityLink";
    AtomType["ImplicationLink"] = "ImplicationLink";
    AtomType["ExecutionLink"] = "ExecutionLink";
    AtomType["EvaluationLink"] = "EvaluationLink";
    // Bot tool specific types
    AtomType["BotToolNode"] = "BotToolNode";
    AtomType["TaskNode"] = "TaskNode";
    AtomType["ContextNode"] = "ContextNode";
    AtomType["StrategyNode"] = "StrategyNode";
})(AtomType = exports.AtomType || (exports.AtomType = {}));
class TruthValue {
    constructor(strength = 1.0, confidence = 1.0) {
        this.strength = strength;
        this.confidence = confidence;
    }
    static simple(strength, confidence) {
        return new TruthValue(strength, confidence);
    }
}
exports.TruthValue = TruthValue;
class AttentionValue {
    constructor(sti = 0, lti = 0, vlti = false) {
        this.sti = sti;
        this.lti = lti;
        this.vlti = vlti;
    }
}
exports.AttentionValue = AttentionValue;
