#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {execSync, spawn} = require('child_process');
const readline = require('readline');
const axios = require('axios');

// Load configuration from .env
require('dotenv').config();

// Environment configuration with consistent defaults
const DEFAULT_CONFIG = {
	n8nHost: 'localhost',
	n8nPort: '5678',
	n8nProtocol: 'http',
	n8nApiUrl: 'http://localhost:5678/api/v1',
	testWorkflowsDir: './test-workflows',
	backupDir: './backup'
};

const CONFIG = {
	n8nHost: process.env.N8N_HOST || DEFAULT_CONFIG.n8nHost,
	n8nPort: process.env.N8N_PORT || DEFAULT_CONFIG.n8nPort,
	n8nProtocol: process.env.N8N_PROTOCOL || DEFAULT_CONFIG.n8nProtocol,
	n8nApiKey: process.env.N8N_API_KEY,
	n8nApiUrl: process.env.N8N_API_URL ||
		`${process.env.N8N_PROTOCOL || DEFAULT_CONFIG.n8nProtocol}://${process.env.N8N_HOST || DEFAULT_CONFIG.n8nHost}:${process.env.N8N_PORT || DEFAULT_CONFIG.n8nPort}/api/v1`,
	testWorkflowsDir: DEFAULT_CONFIG.testWorkflowsDir,
	backupDir: DEFAULT_CONFIG.backupDir
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// Helper functions
const log = (message, type = 'info') => {
	const timestamp = new Date().toLocaleTimeString();
	const icons = {info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️', question: '❓'};
	console.log(`${timestamp} ${icons[type]} ${message}`);
};

const question = (query) => {
	return new Promise(resolve => rl.question(`❓ ${query}`, resolve));
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Docker functions
const isDockerRunning = () => {
	try {
		execSync('docker ps', {stdio: 'ignore'});
		return true;
	} catch {
		return false;
	}
};

const isN8nContainerRunning = () => {
	try {
		const result = execSync('docker-compose ps -q n8n', {encoding: 'utf8'}).trim();
		if (!result) return false;

		const status = execSync(`docker inspect ${result} --format="{{.State.Status}}"`, {encoding: 'utf8'}).trim();
		return status === 'running';
	} catch {
		return false;
	}
};

const stopN8nContainer = () => {
	try {
		log('Stopping n8n container...');
		execSync('docker-compose down', {stdio: 'inherit'});
		log('Container stopped', 'success');
	} catch (error) {
		log(`Error stopping: ${error.message}`, 'error');
		throw error;
	}
};

const startN8nContainer = () => {
	try {
		log('Starting n8n container...');
		execSync('docker-compose up -d', {stdio: 'inherit'});
		log('Container started', 'success');
	} catch (error) {
		log(`Error starting: ${error.message}`, 'error');
		throw error;
	}
};

// n8n API functions
const waitForN8n = async (maxRetries = 30) => {
	log('Waiting for n8n...');

	for (let i = 0; i < maxRetries; i++) {
		try {
			await axios.get(`${CONFIG.n8nProtocol}://${CONFIG.n8nHost}:${CONFIG.n8nPort}/healthz`);
			log('n8n is ready!', 'success');
			return true;
		} catch {
			process.stdout.write('.');
			await sleep(2000);
		}
	}

	log('n8n is not reachable', 'error');
	return false;
};

const getApiHeaders = () => {
	if (!CONFIG.n8nApiKey) {
		log('N8N_API_KEY is not set. Make sure you have an API key in the .env file.', 'warning');
		return {};
	}
	return {
		'X-N8N-API-KEY': CONFIG.n8nApiKey,
		'Content-Type': 'application/json'
	};
};

const getWorkflows = async () => {
	try {
		const headers = getApiHeaders();
		if (!headers['X-N8N-API-KEY']) {
			log('Skipping workflow check (no API key)', 'warning');
			return [];
		}

		const response = await axios.get(`${CONFIG.n8nApiUrl}/workflows`, {headers});
		return response.data.data || [];
	} catch (error) {
		log(`Error fetching workflows: ${error.message}`, 'error');
		return [];
	}
};

const backupWorkflows = async (workflows) => {
	if (!workflows.length) {
		log('No workflows available for backup');
		return;
	}

	// Create backup directory
	if (!fs.existsSync(CONFIG.backupDir)) {
		fs.mkdirSync(CONFIG.backupDir, {recursive: true});
	}

	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const backupFolder = path.join(CONFIG.backupDir, `backup-${timestamp}`);
	fs.mkdirSync(backupFolder);

	log(`Creating backup in ${backupFolder}...`);

	for (const workflow of workflows) {
		try {
			const headers = getApiHeaders();
			const response = await axios.get(`${CONFIG.n8nApiUrl}/workflows/${workflow.id}`, {headers});
			const workflowData = response.data.data;

			const filename = `${workflow.name.replace(/[^a-zA-Z0-9]/g, '_')}_${workflow.id}.json`;
			const filepath = path.join(backupFolder, filename);

			fs.writeFileSync(filepath, JSON.stringify(workflowData, null, 2));
			log(`Workflow "${workflow.name}" backed up`, 'success');
		} catch (error) {
			log(`Error backing up "${workflow.name}": ${error.message}`, 'error');
		}
	}

	log(`Backup completed: ${workflows.length} workflows backed up`, 'success');
};

const deleteWorkflows = async (workflows) => {
	if (!workflows.length) {
		log('No workflows available for deletion');
		return;
	}

	log(`Deleting ${workflows.length} workflows...`);

	for (const workflow of workflows) {
		try {
			const headers = getApiHeaders();
			await axios.delete(`${CONFIG.n8nApiUrl}/workflows/${workflow.id}`, {headers});
			log(`Workflow "${workflow.name}" deleted`, 'success');
		} catch (error) {
			log(`Error deleting "${workflow.name}": ${error.message}`, 'error');
		}
	}

	log('All workflows deleted', 'success');
};

// Workflow file functions
const findWorkflowFiles = (dir) => {
	const files = [];

	if (!fs.existsSync(dir)) {
		return files;
	}

	const items = fs.readdirSync(dir);

	for (const item of items) {
		const fullPath = path.join(dir, item);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			files.push(...findWorkflowFiles(fullPath));
		} else if (item.endsWith('.json')) {
			files.push(fullPath);
		}
	}

	return files;
};

const findWorkflowDirectories = (baseDir) => {
	const directories = [];

	if (!fs.existsSync(baseDir)) {
		return directories;
	}

	const items = fs.readdirSync(baseDir);

	for (const item of items) {
		const fullPath = path.join(baseDir, item);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			const hasWorkflows = findWorkflowFiles(fullPath).length > 0;
			if (hasWorkflows) {
				directories.push({
					name: item,
					path: fullPath,
					workflowCount: findWorkflowFiles(fullPath).length
				});
			}
		}
	}

	return directories;
};

const uploadWorkflow = async (filePath) => {
	try {
		const workflowData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		const headers = getApiHeaders();

		// Clean the workflow for import
		delete workflowData.id;
		delete workflowData.versionId;
		delete workflowData.meta;
		delete workflowData.tags;
		delete workflowData.pinData;

		// Ensure the "settings" property exists
		if (!workflowData.settings) {
			workflowData.settings = {};
		}

		// Replace Node type for local Custom-Node
		const workflowString = JSON.stringify(workflowData);
		const updatedWorkflowString = workflowString.replace(
			/"type":\s*"sevDesk"/g,
			'"type": "CUSTOM.sevDesk"'
		);
		const updatedWorkflowData = JSON.parse(updatedWorkflowString);

		const response = await axios.post(`${CONFIG.n8nApiUrl}/workflows`, updatedWorkflowData, {headers});
		log(`Workflow "${updatedWorkflowData.name}" uploaded (Node type adjusted)`, 'success');
		return response.data.data;
	} catch (error) {
		const errorMessage = error.response ? JSON.stringify(error.response.data, null, 2) : error.message;
		log(`Error uploading ${path.basename(filePath)}: ${errorMessage}`, 'error');
		return null;
	}
};

const selectWorkflowDirectory = async (directories) => {
	if (directories.length === 0) {
		log('No workflow directories found');
		return null;
	}

	console.log('\n📁 Available workflow directories:');
	directories.forEach((dir, index) => {
		console.log(`${index + 1}. ${dir.name} (${dir.workflowCount} workflows)`);
	});
	console.log(`${directories.length + 1}. All directories`);
	console.log('0. Cancel');

	const choice = await question('\nSelect a directory (number): ');
	const choiceNum = parseInt(choice);

	if (choiceNum === 0) {
		return null;
	} else if (choiceNum === directories.length + 1) {
		return directories;
	} else if (choiceNum >= 1 && choiceNum <= directories.length) {
		return [directories[choiceNum - 1]];
	} else {
		log('Invalid selection', 'error');
		return await selectWorkflowDirectory(directories);
	}
};

const openBrowser = () => {
	const url = `${CONFIG.n8nProtocol}://${CONFIG.n8nHost}:${CONFIG.n8nPort}`;
	const platform = process.platform;

	try {
		if (platform === 'win32') {
			execSync(`start ${url}`);
		} else if (platform === 'darwin') {
			execSync(`open ${url}`);
		} else {
			execSync(`xdg-open ${url}`);
		}
		log(`Browser opened: ${url}`, 'success');
	} catch (error) {
		log(`Could not open browser. Please open manually: ${url}`, 'warning');
	}
};

// Main function
const main = async () => {
	console.log('🚀 n8n SevDesk-Node Starter');
	console.log('============================\n');

	try {
		// 1. Node build
		//log('1. Creating build...');
		//execSync('npm run build', { stdio: 'inherit' });
		//log('Build successful', 'success');

		// 2. Add Node to Docker
		//log('2. Copy Node to Docker Volume...');
		//const nodeSourcePath = './dist';
		//const nodeTargetPath = './n8n_data/nodes';

		//if (fs.existsSync(nodeSourcePath)) {
		// Create nodes directory if not present
		//    if (!fs.existsSync(nodeTargetPath)) {
		//       fs.mkdirSync(nodeTargetPath, { recursive: true });
		//    }

		// Copy the compiled Node
		//     execSync(`cp -r ${nodeSourcePath}/* ${nodeTargetPath}/`, { stdio: 'inherit' });
		//    log('Node successfully copied', 'success');
		//} else {
		//    log('Build directory not found', 'error');
		//     process.exit(1);
		// }

		// 3. Check Docker
		log('3. Checking Docker status...');
		if (!isDockerRunning()) {
			log('Docker is not available. Please start Docker.', 'error');
			process.exit(1);
		}

		// 4. Stop n8n container if running
		if (isN8nContainerRunning()) {
			log('4. n8n container is already running...');
			const shouldStop = await question('Stop container? (y/N): ');
			if (shouldStop.toLowerCase().startsWith('y')) {
				stopN8nContainer();
			}
		}

		// 5. Start Docker
		log('5. Starting Docker container...');
		startN8nContainer();

		// Wait for n8n
		const isReady = await waitForN8n();
		if (!isReady) {
			log('n8n could not be started', 'error');
			process.exit(1);
		}

		// 6. Check workflows
		log('6. Checking existing workflows...');
		const existingWorkflows = await getWorkflows();
		log(`${existingWorkflows.length} workflows found`);

		// 7. Offer backup
		if (existingWorkflows.length > 0) {
			const wantBackup = await question('7. Create backup of existing workflows? (Y/n): ');
			if (!wantBackup.toLowerCase().startsWith('n')) {
				await backupWorkflows(existingWorkflows);
			}

			// 8. Offer to delete workflows
			const shouldDelete = await question('8. Delete existing workflows? (y/N): ');
			if (shouldDelete.toLowerCase().startsWith('y')) {
				await deleteWorkflows(existingWorkflows);
			}
		}

		// 9. Upload test workflows
		log('9. Searching for test workflows...');
		const workflowDirs = findWorkflowDirectories(CONFIG.testWorkflowsDir);

		if (workflowDirs.length > 0) {
			log(`${workflowDirs.length} workflow directories found`);
			const selectedDirs = await selectWorkflowDirectory(workflowDirs);

			if (selectedDirs) {
				for (const dir of selectedDirs) {
					log(`Loading workflows from ${dir.name}...`);
					const files = findWorkflowFiles(dir.path);
					for (const file of files) {
						await uploadWorkflow(file);
					}
				}
			}
		} else {
			log('No test workflows found', 'warning');
		}

		// 10. Open browser
		log('10. Opening n8n in browser...');
		await sleep(2000); // Wait briefly
		openBrowser();

		log('\n🎉 Start process completed!', 'success');

	} catch (error) {
		log(`Error: ${error.message}`, 'error');
		process.exit(1);
	} finally {
		rl.close();
	}
};

// Start program
if (require.main === module) {
	main();
}
