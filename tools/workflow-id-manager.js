#!/usr/bin/env node
/**
 * n8n SevDesk Workflow ID Manager
 * 
 * Systematically analyzes and updates node IDs across all workflows
 * to ensure uniqueness and consistent naming patterns.
 * 
 * Usage:
 *   node tools/workflow-id-manager.js analyze     # Analyze current IDs
 *   node tools/workflow-id-manager.js generate    # Generate new ID mappings
 *   node tools/workflow-id-manager.js update      # Update all workflow files
 *   node tools/workflow-id-manager.js validate    # Validate updated files
 */

const fs = require('fs');
const path = require('path');

// Configuration
const WORKFLOWS_DIR = path.join(__dirname, '..', 'test-workflows');
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'workflow-id-mappings');

// Function code definitions
const FUNCTION_CODES = {
  TRG: 'Triggers',
  MRG: 'Merge operations',
  EXT: 'Extract/Parse',
  VAL: 'Validate/Check',
  SVC: 'Service/API calls',
  TRF: 'Transform/Process',
  FWD: 'Forward/Send',
  ERR: 'Error handling',
  LOG: 'Logging/Monitoring',
  NOT: 'Notifications',
  DOC: 'Documentation',
  SPL: 'Split operations',
  FIL: 'File operations',
  OUT: 'Output operations'
};

// Node type to function code mapping
const NODE_TYPE_TO_FUNCTION = {
  'n8n-nodes-base.scheduleTrigger': 'TRG',
  'n8n-nodes-base.webhook': 'TRG',
  'n8n-nodes-base.localFileTrigger': 'TRG',
  'n8n-nodes-base.emailTrigger': 'TRG',
  'n8n-nodes-base.merge': 'MRG',
  'n8n-nodes-base.code': 'TRF', // Default, can be EXT/VAL/LOG based on content
  'n8n-nodes-base.if': 'VAL',
  'n8n-nodes-base.httpRequest': 'SVC', // Default, can be FWD
  'n8n-nodes-base.emailSend': 'NOT',
  'n8n-nodes-base.stickyNote': 'DOC',
  'n8n-nodes-base.splitInBatches': 'SPL',
  'n8n-nodes-base.readBinaryFile': 'FIL',
  'n8n-nodes-base.writeBinaryFile': 'FIL',
  'nodes-base.sevDesk': 'SVC'
};

/**
 * Analyzes all workflows and extracts node information
 */
class WorkflowAnalyzer {
  constructor() {
    this.workflows = [];
    this.allNodes = new Map();
    this.duplicateIds = new Set();
  }

  /**
   * Scan all workflow files and extract node information
   */
  async analyzeWorkflows() {
    console.log('🔍 Analyzing all workflows...');
    
    const categories = fs.readdirSync(WORKFLOWS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    for (const category of categories) {
      const categoryPath = path.join(WORKFLOWS_DIR, category);
      const parts = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .sort();

      for (const part of parts) {
        const partPath = path.join(categoryPath, part);
        const files = fs.readdirSync(partPath)
          .filter(file => file.endsWith('.json'))
          .sort();

        for (const file of files) {
          const filePath = path.join(partPath, file);
          const workflow = this.parseWorkflowFile(filePath, category, part, file);
          if (workflow) {
            this.workflows.push(workflow);
            this.extractNodes(workflow);
          }
        }
      }
    }

    this.identifyDuplicates();
    return this.generateReport();
  }

  /**
   * Parse individual workflow file
   */
  parseWorkflowFile(filePath, category, part, filename) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const workflow = JSON.parse(content);
      
      return {
        category,
        part,
        filename,
        filePath,
        name: workflow.name || filename.replace('.json', ''),
        nodes: workflow.nodes || [],
        connections: workflow.connections || {}
      };
    } catch (error) {
      console.error(`❌ Error parsing ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Extract nodes from workflow and track IDs
   */
  extractNodes(workflow) {
    for (const node of workflow.nodes) {
      // Skip nodes without IDs
      if (!node.id) {
        console.warn(`⚠️  Node without ID found in ${workflow.filePath}: ${node.name || 'unnamed'}`);
        continue;
      }

      const nodeInfo = {
        id: node.id,
        name: node.name,
        type: node.type,
        workflow: workflow.category + '/' + workflow.part,
        filePath: workflow.filePath
      };

      if (this.allNodes.has(node.id)) {
        this.duplicateIds.add(node.id);
      }
      
      this.allNodes.set(node.id, nodeInfo);
    }
  }

  /**
   * Identify duplicate IDs across workflows
   */
  identifyDuplicates() {
    const idCounts = new Map();
    
    for (const [id, nodeInfo] of this.allNodes) {
      if (!idCounts.has(id)) {
        idCounts.set(id, []);
      }
      idCounts.get(id).push(nodeInfo);
    }

    for (const [id, occurrences] of idCounts) {
      if (occurrences.length > 1) {
        this.duplicateIds.add(id);
      }
    }
  }

  /**
   * Generate analysis report
   */
  generateReport() {
    const report = {
      totalWorkflows: this.workflows.length,
      totalNodes: this.allNodes.size,
      duplicateIds: Array.from(this.duplicateIds),
      workflows: this.workflows.map(w => ({
        category: w.category,
        part: w.part,
        filename: w.filename,
        nodeCount: w.nodes.length
      }))
    };

    console.log('\n📊 Analysis Report:');
    console.log(`   Total workflows: ${report.totalWorkflows}`);
    console.log(`   Total nodes: ${report.totalNodes}`);
    console.log(`   Duplicate IDs found: ${report.duplicateIds.length}`);
    
    if (report.duplicateIds.length > 0) {
      console.log('\n⚠️  Duplicate IDs:');
      report.duplicateIds.forEach(id => {
        console.log(`   - ${id}`);
      });
    }

    return report;
  }
}

/**
 * Generates new systematic node ID mappings
 */
class IDMappingGenerator {
  constructor(analyzer) {
    this.analyzer = analyzer;
    this.mappings = new Map();
    this.counters = new Map();
  }

  /**
   * Generate new ID mappings for all workflows
   */
  generateMappings() {
    console.log('\n🔄 Generating new ID mappings...');

    for (const workflow of this.analyzer.workflows) {
      const categoryNum = workflow.category.split('-')[0];
      const partNum = workflow.part.match(/Teil(\d+)/)[1];
      const prefix = `${categoryNum}${partNum}`;

      this.generateWorkflowMapping(workflow, prefix);
    }

    return this.mappings;
  }

  /**
   * Generate ID mapping for a single workflow
   */
  generateWorkflowMapping(workflow, prefix) {
    const workflowKey = `${workflow.category}/${workflow.part}`;
    
    if (!this.counters.has(workflowKey)) {
      this.counters.set(workflowKey, new Map());
    }

    const workflowCounters = this.counters.get(workflowKey);

    for (const node of workflow.nodes) {
      const functionCode = this.determineFunctionCode(node);
      const counterKey = `${prefix}_${functionCode}`;

      if (!workflowCounters.has(counterKey)) {
        workflowCounters.set(counterKey, 0);
      }

      const counter = workflowCounters.get(counterKey) + 1;
      workflowCounters.set(counterKey, counter);

      const newId = `${prefix}_${functionCode}_${counter.toString().padStart(2, '0')}`;
      
      this.mappings.set(node.id, {
        oldId: node.id,
        newId,
        name: node.name,
        type: node.type,
        workflow: workflowKey,
        functionCode
      });
    }
  }

  /**
   * Determine function code based on node type and name
   */
  determineFunctionCode(node) {
    // Direct mapping from node type
    if (NODE_TYPE_TO_FUNCTION[node.type]) {
      let baseCode = NODE_TYPE_TO_FUNCTION[node.type];
      
      // Special cases for code nodes
      if (node.type === 'n8n-nodes-base.code') {
        const name = node.name.toLowerCase();
        if (name.includes('extract') || name.includes('parse')) {
          baseCode = 'EXT';
        } else if (name.includes('validate') || name.includes('check')) {
          baseCode = 'VAL';
        } else if (name.includes('log')) {
          baseCode = 'LOG';
        }
      }
      
      // Special cases for HTTP requests
      if (node.type === 'n8n-nodes-base.httpRequest') {
        const name = node.name.toLowerCase();
        if (name.includes('forward') || name.includes('send to') || name.includes('weiterleiten')) {
          baseCode = 'FWD';
        }
      }
      
      return baseCode;
    }

    // Fallback based on name patterns
    const name = node.name.toLowerCase();
    if (name.includes('trigger')) return 'TRG';
    if (name.includes('merge')) return 'MRG';
    if (name.includes('extract') || name.includes('parse')) return 'EXT';
    if (name.includes('validate') || name.includes('check') || name.includes('if')) return 'VAL';
    if (name.includes('api') || name.includes('service')) return 'SVC';
    if (name.includes('transform') || name.includes('process')) return 'TRF';
    if (name.includes('forward') || name.includes('send to')) return 'FWD';
    if (name.includes('error') || name.includes('fehler')) return 'ERR';
    if (name.includes('log') || name.includes('protokoll')) return 'LOG';
    if (name.includes('notify') || name.includes('email') || name.includes('nachricht')) return 'NOT';
    if (name.includes('note') || name.includes('description')) return 'DOC';
    if (name.includes('split') || name.includes('batch')) return 'SPL';
    if (name.includes('file') || name.includes('datei')) return 'FIL';
    if (name.includes('output') || name.includes('export')) return 'OUT';

    return 'TRF'; // Default fallback
  }

  /**
   * Save mappings to file
   */
  saveMappings() {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const mappingFile = path.join(OUTPUT_DIR, 'node-id-mappings.json');
    const mappingData = {
      generated: new Date().toISOString(),
      totalMappings: this.mappings.size,
      mappings: Array.from(this.mappings.entries()).map(([oldId, mapping]) => mapping)
    };

    fs.writeFileSync(mappingFile, JSON.stringify(mappingData, null, 2));
    console.log(`✅ Mappings saved to: ${mappingFile}`);
    
    return mappingFile;
  }
}

/**
 * Updates workflow files with new node IDs
 */
class WorkflowUpdater {
  constructor(analyzer, generator) {
    this.analyzer = analyzer;
    this.generator = generator;
    this.mappings = generator.mappings;
  }

  /**
   * Update all workflow files with new IDs
   */
  async updateAllWorkflows() {
    console.log('\n🔄 Updating all workflow files...');
    
    let updateCount = 0;
    
    for (const workflow of this.analyzer.workflows) {
      const updated = await this.updateWorkflow(workflow);
      if (updated) {
        updateCount++;
      }
    }
    
    console.log(`✅ Updated ${updateCount} workflows`);
  }

  /**
   * Update a single workflow file
   */
  async updateWorkflow(workflow) {
    try {
      const originalContent = fs.readFileSync(workflow.filePath, 'utf8');
      const workflowData = JSON.parse(originalContent);
      let hasChanges = false;

      // Update node IDs
      if (workflowData.nodes) {
        for (const node of workflowData.nodes) {
          if (node.id && this.mappings.has(node.id)) {
            const mapping = this.mappings.get(node.id);
            console.log(`   Updating node: ${node.id} → ${mapping.newId}`);
            node.id = mapping.newId;
            hasChanges = true;
          }
        }
      }

      // Update connection references
      if (workflowData.connections) {
        const newConnections = {};
        
        for (const [nodeId, connections] of Object.entries(workflowData.connections)) {
          const newNodeId = this.mappings.has(nodeId) ? this.mappings.get(nodeId).newId : nodeId;
          
          // Update connection targets
          const updatedConnections = {};
          for (const [outputType, outputConnections] of Object.entries(connections)) {
            updatedConnections[outputType] = outputConnections.map(connectionGroup => 
              connectionGroup.map(connection => ({
                ...connection,
                node: this.mappings.has(connection.node) ? this.mappings.get(connection.node).newId : connection.node
              }))
            );
          }
          
          newConnections[newNodeId] = updatedConnections;
          hasChanges = true;
        }
        
        workflowData.connections = newConnections;
      }

      // Write updated file if changes were made
      if (hasChanges) {
        fs.writeFileSync(workflow.filePath, JSON.stringify(workflowData, null, 2));
        console.log(`✅ Updated: ${workflow.filePath}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`❌ Error updating ${workflow.filePath}:`, error.message);
      return false;
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  const command = process.argv[2];
  
  if (!command) {
    console.log('Usage: node tools/workflow-id-manager.js <command>');
    console.log('Commands: analyze, generate, update, validate');
    process.exit(1);
  }

  try {
    const analyzer = new WorkflowAnalyzer();
    
    switch (command) {
      case 'analyze':
        await analyzer.analyzeWorkflows();
        break;
        
      case 'generate':
        await analyzer.analyzeWorkflows();
        const generator = new IDMappingGenerator(analyzer);
        generator.generateMappings();
        generator.saveMappings();
        break;
        
      case 'update':
        await analyzer.analyzeWorkflows();
        const mappingGenerator = new IDMappingGenerator(analyzer);
        mappingGenerator.generateMappings();
        const updater = new WorkflowUpdater(analyzer, mappingGenerator);
        await updater.updateAllWorkflows();
        break;
        
      case 'validate':
        console.log('✅ Validation functionality will be implemented next...');
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { WorkflowAnalyzer, IDMappingGenerator, WorkflowUpdater };