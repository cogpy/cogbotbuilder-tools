#!/usr/bin/env node

/**
 * Basic usage example for OpenCog Orchestrator
 */

const { AutonomousOrchestrator, TaskType, TaskStatus } = require('../lib/index.js');

async function basicExample() {
    console.log('🧠 OpenCog Orchestrator - Basic Usage Example');
    console.log('==========================================');

    try {
        // Initialize the orchestrator
        console.log('1. Initializing orchestrator...');
        const orchestrator = new AutonomousOrchestrator();
        
        // Listen to events
        orchestrator.on('initialized', () => {
            console.log('✓ Orchestrator initialized with cognitive synergy architecture');
        });
        
        orchestrator.on('taskSubmitted', (taskId) => {
            console.log(`✓ Task submitted: ${taskId}`);
        });
        
        await orchestrator.initialize();
        
        // Submit a language understanding task
        console.log('\n2. Submitting autonomous task...');
        const task = {
            id: 'example-task-001',
            type: TaskType.LanguageUnderstanding,
            priority: 8,
            requirements: ['intent-recognition', 'entity-extraction'],
            context: {
                userIntent: 'Create a customer service bot with LUIS',
                domainKnowledge: [],
                previousResults: [],
                constraints: [],
                preferences: []
            },
            status: TaskStatus.Pending,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const taskId = await orchestrator.submitTask(task);
        
        // Check task status
        setTimeout(async () => {
            const status = await orchestrator.getTaskStatus(taskId);
            console.log(`\n3. Task Status: ${status}`);
            
            // Shutdown
            console.log('\n4. Shutting down orchestrator...');
            await orchestrator.shutdown();
            console.log('✓ Orchestrator shutdown complete');
        }, 2000);
        
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

// Run the example
if (require.main === module) {
    basicExample();
}

module.exports = { basicExample };