#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const readline = require('readline');
const axios = require('axios');

// Konfiguration aus .env laden
require('dotenv').config();

const CONFIG = {
    n8nHost: process.env.N8N_HOST || 'localhost',
    n8nPort: process.env.N8N_PORT || '5678',
    n8nProtocol: process.env.N8N_PROTOCOL || 'http',
    n8nApiKey: process.env.N8N_API_KEY,
    n8nApiUrl: process.env.N8N_API_URL || `http://localhost:5678/api/v1`,
    testWorkflowsDir: './test-workflows',
    backupDir: './backup'
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Hilfsfunktionen
const log = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️', question: '❓' };
    console.log(`${timestamp} ${icons[type]} ${message}`);
};

const question = (query) => {
    return new Promise(resolve => rl.question(`❓ ${query}`, resolve));
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Docker-Funktionen
const isDockerRunning = () => {
    try {
        execSync('docker ps', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
};

const isN8nContainerRunning = () => {
    try {
        const result = execSync('docker-compose ps -q n8n', { encoding: 'utf8' }).trim();
        if (!result) return false;
        
        const status = execSync(`docker inspect ${result} --format="{{.State.Status}}"`, { encoding: 'utf8' }).trim();
        return status === 'running';
    } catch {
        return false;
    }
};

const stopN8nContainer = () => {
    try {
        log('Stoppe n8n Container...');
        execSync('docker-compose down', { stdio: 'inherit' });
        log('Container gestoppt', 'success');
    } catch (error) {
        log(`Fehler beim Stoppen: ${error.message}`, 'error');
        throw error;
    }
};

const startN8nContainer = () => {
    try {
        log('Starte n8n Container...');
        execSync('docker-compose up -d', { stdio: 'inherit' });
        log('Container gestartet', 'success');
    } catch (error) {
        log(`Fehler beim Starten: ${error.message}`, 'error');
        throw error;
    }
};

// n8n API-Funktionen
const waitForN8n = async (maxRetries = 30) => {
    log('Warte auf n8n...');
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            await axios.get(`${CONFIG.n8nProtocol}://${CONFIG.n8nHost}:${CONFIG.n8nPort}/healthz`);
            log('n8n ist bereit!', 'success');
            return true;
        } catch {
            process.stdout.write('.');
            await sleep(2000);
        }
    }
    
    log('n8n ist nicht erreichbar', 'error');
    return false;
};

const getApiHeaders = () => {
    if (!CONFIG.n8nApiKey) {
        log('N8N_API_KEY ist nicht gesetzt. Stelle sicher, dass Sie einen API-Key in der .env-Datei haben.', 'warning');
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
            log('Überspringe Workflow-Prüfung (kein API-Key)', 'warning');
            return [];
        }
        
        const response = await axios.get(`${CONFIG.n8nApiUrl}/workflows`, { headers });
        return response.data.data || [];
    } catch (error) {
        log(`Fehler beim Abrufen der Workflows: ${error.message}`, 'error');
        return [];
    }
};

const backupWorkflows = async (workflows) => {
    if (!workflows.length) {
        log('Keine Workflows zum Backup vorhanden');
        return;
    }
    
    // Erstelle backup Verzeichnis
    if (!fs.existsSync(CONFIG.backupDir)) {
        fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFolder = path.join(CONFIG.backupDir, `backup-${timestamp}`);
    fs.mkdirSync(backupFolder);
    
    log(`Erstelle Backup in ${backupFolder}...`);
    
    for (const workflow of workflows) {
        try {
            const headers = getApiHeaders();
            const response = await axios.get(`${CONFIG.n8nApiUrl}/workflows/${workflow.id}`, { headers });
            const workflowData = response.data.data;
            
            const filename = `${workflow.name.replace(/[^a-zA-Z0-9]/g, '_')}_${workflow.id}.json`;
            const filepath = path.join(backupFolder, filename);
            
            fs.writeFileSync(filepath, JSON.stringify(workflowData, null, 2));
            log(`Workflow "${workflow.name}" gesichert`, 'success');
        } catch (error) {
            log(`Fehler beim Backup von "${workflow.name}": ${error.message}`, 'error');
        }
    }
    
    log(`Backup abgeschlossen: ${workflows.length} Workflows gesichert`, 'success');
};

const deleteWorkflows = async (workflows) => {
    if (!workflows.length) {
        log('Keine Workflows zum Löschen vorhanden');
        return;
    }
    
    log(`Lösche ${workflows.length} Workflows...`);
    
    for (const workflow of workflows) {
        try {
            const headers = getApiHeaders();
            await axios.delete(`${CONFIG.n8nApiUrl}/workflows/${workflow.id}`, { headers });
            log(`Workflow "${workflow.name}" gelöscht`, 'success');
        } catch (error) {
            log(`Fehler beim Löschen von "${workflow.name}": ${error.message}`, 'error');
        }
    }
    
    log('Alle Workflows gelöscht', 'success');
};

// Workflow-Datei-Funktionen
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
        
        // Entferne ID für neue Workflows
        delete workflowData.id;
        
        // Ersetze Node-Typ für lokalen Custom-Node
        const workflowString = JSON.stringify(workflowData);
        const updatedWorkflowString = workflowString.replace(
            /"type":\s*"n8n-nodes-sevdesk-v2\.sevDesk"/g,
            '"type": "CUSTOM.sevDesk"'
        );
        const updatedWorkflowData = JSON.parse(updatedWorkflowString);
        
        const response = await axios.post(`${CONFIG.n8nApiUrl}/workflows`, updatedWorkflowData, { headers });
        log(`Workflow "${updatedWorkflowData.name}" hochgeladen (Node-Typ angepasst)`, 'success');
        return response.data.data;
    } catch (error) {
        log(`Fehler beim Hochladen von ${path.basename(filePath)}: ${error.message}`, 'error');
        return null;
    }
};

const selectWorkflowDirectory = async (directories) => {
    if (directories.length === 0) {
        log('Keine Workflow-Verzeichnisse gefunden');
        return null;
    }
    
    console.log('\n📁 Verfügbare Workflow-Verzeichnisse:');
    directories.forEach((dir, index) => {
        console.log(`${index + 1}. ${dir.name} (${dir.workflowCount} Workflows)`);
    });
    console.log(`${directories.length + 1}. Alle Verzeichnisse`);
    console.log('0. Abbrechen');
    
    const choice = await question('\nWählen Sie ein Verzeichnis (Nummer): ');
    const choiceNum = parseInt(choice);
    
    if (choiceNum === 0) {
        return null;
    } else if (choiceNum === directories.length + 1) {
        return directories;
    } else if (choiceNum >= 1 && choiceNum <= directories.length) {
        return [directories[choiceNum - 1]];
    } else {
        log('Ungültige Auswahl', 'error');
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
        log(`Browser geöffnet: ${url}`, 'success');
    } catch (error) {
        log(`Konnte Browser nicht öffnen. Bitte öffnen Sie manuell: ${url}`, 'warning');
    }
};

// Hauptfunktion
const main = async () => {
    console.log('🚀 n8n SevDesk-Node Starter');
    console.log('============================\n');
    
    try {
        // 1. Node build
        log('1. Erstelle Build...');
        execSync('npm run build', { stdio: 'inherit' });
        log('Build erfolgreich', 'success');
        
        // 2. Docker prüfen
        log('2. Prüfe Docker-Status...');
        if (!isDockerRunning()) {
            log('Docker ist nicht verfügbar. Bitte starten Sie Docker.', 'error');
            process.exit(1);
        }
        
        // 3. n8n Container stoppen falls läuft
        if (isN8nContainerRunning()) {
            log('3. n8n Container läuft bereits...');
            const shouldStop = await question('Container stoppen? (j/N): ');
            if (shouldStop.toLowerCase().startsWith('j')) {
                stopN8nContainer();
            }
        }
        
        // 4. Docker starten
        log('4. Starte Docker Container...');
        startN8nContainer();
        
        // Warte auf n8n
        const isReady = await waitForN8n();
        if (!isReady) {
            log('n8n konnte nicht gestartet werden', 'error');
            process.exit(1);
        }
        
        // 5. Workflows prüfen
        log('5. Prüfe vorhandene Workflows...');
        const existingWorkflows = await getWorkflows();
        log(`${existingWorkflows.length} Workflows gefunden`);
        
        // 6. Backup anbieten
        if (existingWorkflows.length > 0) {
            const wantBackup = await question('6. Backup der vorhandenen Workflows erstellen? (J/n): ');
            if (!wantBackup.toLowerCase().startsWith('n')) {
                await backupWorkflows(existingWorkflows);
            }
            
            // 8. Workflows löschen anbieten
            const shouldDelete = await question('8. Vorhandene Workflows löschen? (j/N): ');
            if (shouldDelete.toLowerCase().startsWith('j')) {
                await deleteWorkflows(existingWorkflows);
            }
        }
        
        // 9-10. Test-Workflows hochladen
        log('9. Suche Test-Workflows...');
        
        // Prüfe auf direkte JSON-Dateien
        const directWorkflowFiles = findWorkflowFiles(CONFIG.testWorkflowsDir);
        
        if (directWorkflowFiles.length > 0) {
            log(`${directWorkflowFiles.length} Workflow-Dateien gefunden`);
            const shouldUpload = await question('Test-Workflows hochladen? (J/n): ');
            if (!shouldUpload.toLowerCase().startsWith('n')) {
                for (const file of directWorkflowFiles) {
                    await uploadWorkflow(file);
                }
            }
        } else {
            // Prüfe auf Workflow-Verzeichnisse
            const workflowDirs = findWorkflowDirectories(CONFIG.testWorkflowsDir);
            
            if (workflowDirs.length > 0) {
                log(`${workflowDirs.length} Workflow-Verzeichnisse gefunden`);
                const selectedDirs = await selectWorkflowDirectory(workflowDirs);
                
                if (selectedDirs) {
                    for (const dir of selectedDirs) {
                        log(`Lade Workflows aus ${dir.name}...`);
                        const files = findWorkflowFiles(dir.path);
                        for (const file of files) {
                            await uploadWorkflow(file);
                        }
                    }
                }
            } else {
                log('Keine Test-Workflows gefunden', 'warning');
            }
        }
        
        // 11. Browser öffnen
        log('11. Öffne n8n im Browser...');
        await sleep(2000); // Kurz warten
        openBrowser();
        
        log('\n🎉 Start-Prozess abgeschlossen!', 'success');
        
    } catch (error) {
        log(`Fehler: ${error.message}`, 'error');
        process.exit(1);
    } finally {
        rl.close();
    }
};

// Programm starten
if (require.main === module) {
    main();
} 