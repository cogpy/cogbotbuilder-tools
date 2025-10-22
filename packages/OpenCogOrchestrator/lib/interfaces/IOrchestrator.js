"use strict";
/**
 * Interfaces for autonomous orchestration of BotBuilder tools
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceType = exports.ConstraintType = exports.TaskStatus = exports.TaskType = void 0;
var TaskType;
(function (TaskType) {
    TaskType["LanguageUnderstanding"] = "LanguageUnderstanding";
    TaskType["QnAGeneration"] = "QnAGeneration";
    TaskType["BotConfiguration"] = "BotConfiguration";
    TaskType["ConversationDesign"] = "ConversationDesign";
    TaskType["ModelTraining"] = "ModelTraining";
    TaskType["Deployment"] = "Deployment";
    TaskType["Testing"] = "Testing";
    TaskType["Optimization"] = "Optimization";
})(TaskType = exports.TaskType || (exports.TaskType = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["Pending"] = "Pending";
    TaskStatus["InProgress"] = "InProgress";
    TaskStatus["Completed"] = "Completed";
    TaskStatus["Failed"] = "Failed";
    TaskStatus["Cancelled"] = "Cancelled";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
var ConstraintType;
(function (ConstraintType) {
    ConstraintType["MaxExecutionTime"] = "MaxExecutionTime";
    ConstraintType["MaxMemoryUsage"] = "MaxMemoryUsage";
    ConstraintType["RequiredTools"] = "RequiredTools";
    ConstraintType["QualityThreshold"] = "QualityThreshold";
})(ConstraintType = exports.ConstraintType || (exports.ConstraintType = {}));
var PreferenceType;
(function (PreferenceType) {
    PreferenceType["Speed"] = "Speed";
    PreferenceType["Quality"] = "Quality";
    PreferenceType["ResourceEfficiency"] = "ResourceEfficiency";
    PreferenceType["Reliability"] = "Reliability";
})(PreferenceType = exports.PreferenceType || (exports.PreferenceType = {}));
