// Global variables
let web3;
let contract;
let userAccount;
let myAnalysis = [];

// Contract ABI for forensic analyst functions
const contractABI = [
    {
        "inputs": [{"internalType": "string", "name": "_evidenceId", "type": "string"}, {"internalType": "string", "name": "_forensicNotes", "type": "string"}],
        "name": "addForensicAnalysis",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_evidenceId", "type": "string"}, {"internalType": "uint8", "name": "_newStatus", "type": "uint8"}],
        "name": "updateEvidenceStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_evidenceId", "type": "string"}],
        "name": "getEvidence",
        "outputs": [{"internalType": "string", "name": "caseNumber", "type": "string"}, {"internalType": "string", "name": "itemNumber", "type": "string"}, {"internalType": "string", "name": "description", "type": "string"}, {"internalType": "string", "name": "category", "type": "string"}, {"internalType": "string", "name": "collectionDate", "type": "string"}, {"internalType": "string", "name": "collectionLocation", "type": "string"}, {"internalType": "string", "name": "collectedBy", "type": "string"}, {"internalType": "string", "name": "ipfsHash", "type": "string"}, {"internalType": "string", "name": "fileType", "type": "string"}, {"internalType": "string", "name": "fileSize", "type": "string"}, {"internalType": "bytes32", "name": "fileHash", "type": "bytes32"}, {"internalType": "string", "name": "submitterName", "type": "string"}, {"internalType": "uint256", "name": "submissionTime", "type": "uint256"}, {"internalType": "uint8", "name": "status", "type": "uint8"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAccessibleEvidence",
        "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "", "type": "string"}],
        "name": "evidence",
        "outputs": [{"internalType": "string", "name": "evidenceId", "type": "string"}, {"internalType": "string", "name": "caseNumber", "type": "string"}, {"internalType": "string", "name": "itemNumber", "type": "string"}, {"internalType": "string", "name": "description", "type": "string"}, {"internalType": "string", "name": "category", "type": "string"}, {"internalType": "string", "name": "collectionDate", "type": "string"}, {"internalType": "string", "name": "collectionLocation", "type": "string"}, {"internalType": "string", "name": "collectedBy", "type": "string"}, {"internalType": "string", "name": "ipfsHash", "type": "string"}, {"internalType": "string", "name": "fileType", "type": "string"}, {"internalType": "string", "name": "fileSize", "type": "string"}, {"internalType": "bytes32", "name": "fileHash", "type": "bytes32"}, {"internalType": "address", "name": "submittedBy", "type": "address"}, {"internalType": "string", "name": "submitterName", "type": "string"}, {"internalType": "string", "name": "submitterBadge", "type": "string"}, {"internalType": "uint256", "name": "submissionTime", "type": "uint256"}, {"internalType": "uint8", "name": "status", "type": "uint8"}, {"internalType": "uint8", "name": "visibility", "type": "uint8"}, {"internalType": "bool", "name": "releasedToPublic", "type": "bool"}, {"internalType": "address", "name": "releasedBy", "type": "address"}, {"internalType": "string", "name": "releasedByName", "type": "string"}, {"internalType": "uint256", "name": "releaseDate", "type": "uint256"}, {"internalType": "string", "name": "releaseReason", "type": "string"}, {"internalType": "string", "name": "forensicNotes", "type": "string"}, {"internalType": "address", "name": "analyzedBy", "type": "address"}, {"internalType": "uint256", "name": "analysisDate", "type": "uint256"}, {"internalType": "bool", "name": "exists", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        await initWeb3();
        await loadStatistics();
        await loadMyAnalysis();
        setupEventListeners();
    } catch (error) {
        showAlert('Failed to initialize application: ' + error.message, 'error');
    }
}

async function initWeb3() {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is required');
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
        throw new Error('Please connect your wallet');
    }

    userAccount = accounts[0];
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, config.CONTRACT_ADDRESS);

    // Display wallet address
    document.getElementById('userWallet').textContent = userAccount.substring(0, 6) + '...' + userAccount.substring(38);
}

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Form submissions
    document.getElementById('uploadAnalysisForm').addEventListener('submit', handleUploadAnalysis);

    // Load evidence details
    document.getElementById('loadEvidenceBtn').addEventListener('click', loadEvidenceDetails);

    // Refresh buttons
    document.getElementById('refreshMyAnalysis').addEventListener('click', loadMyAnalysis);
    document.getElementById('refreshAssignedCases').addEventListener('click', loadAssignedCases);

    // Verify evidence
    document.getElementById('verifyEvidenceBtn').addEventListener('click', verifyEvidence);
    document.getElementById('bulkVerifyBtn').addEventListener('click', bulkVerifyEvidence);

    // Quick analysis
    document.getElementById('addQuickAnalysis').addEventListener('click', addQuickAnalysis);

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    // Load content if needed
    if (tabName === 'assigned-cases') {
        loadAssignedCases();
    }
}

async function loadStatistics() {
    try {
        const accessibleEvidence = await contract.methods.getAccessibleEvidence().call({ from: userAccount });
        
        let analyzedCount = 0;
        let pendingCount = 0;
        let verifiedCount = 0;
        
        for (const evidenceId of accessibleEvidence) {
            try {
                const evidenceData = await contract.methods.evidence(evidenceId).call();
                if (evidenceData.analyzedBy.toLowerCase() === userAccount.toLowerCase()) {
                    analyzedCount++;
                    if (evidenceData.status === '1') verifiedCount++;
                } else if (evidenceData.status === '0') {
                    pendingCount++;
                }
            } catch (error) {
                // Skip inaccessible evidence
            }
        }

        document.getElementById('assignedCasesCount').textContent = '0'; // Would need case assignment logic
        document.getElementById('analyzedEvidenceCount').textContent = analyzedCount;
        document.getElementById('pendingAnalysisCount').textContent = pendingCount;
        document.getElementById('verifiedEvidenceCount').textContent = verifiedCount;
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

async function loadMyAnalysis() {
    try {
        const container = document.getElementById('myAnalysisContainer');
        container.innerHTML = '<div class="text-center p-8"><div class="loading mb-4"></div><p>Loading your analysis...</p></div>';

        const accessibleEvidence = await contract.methods.getAccessibleEvidence().call({ from: userAccount });
        myAnalysis = [];
        
        for (const evidenceId of accessibleEvidence) {
            try {
                const evidenceData = await contract.methods.evidence(evidenceId).call();
                if (evidenceData.analyzedBy.toLowerCase() === userAccount.toLowerCase() && evidenceData.forensicNotes) {
                    myAnalysis.push({ evidenceId, ...evidenceData });
                }
            } catch (error) {
                // Skip inaccessible evidence
            }
        }

        if (myAnalysis.length === 0) {
            container.innerHTML = '<div class="text-center p-8"><p>No analysis found. Start analyzing evidence!</p></div>';
            return;
        }

        container.innerHTML = '';
        
        for (const analysisData of myAnalysis) {
            const analysisCard = createAnalysisCard(analysisData);
            container.appendChild(analysisCard);
        }
    } catch (error) {
        document.getElementById('myAnalysisContainer').innerHTML = '<div class="alert alert-error">Failed to load analysis: ' + error.message + '</div>';
    }
}

async function loadAssignedCases() {
    try {
        const container = document.getElementById('assignedCasesContainer');
        container.innerHTML = '<div class="text-center p-8"><div class="loading mb-4"></div><p>Loading assigned cases...</p></div>';

        // In a real implementation, you would have a function to get cases assigned to forensic analysts
        // For now, we'll show accessible evidence grouped by case
        const accessibleEvidence = await contract.methods.getAccessibleEvidence().call({ from: userAccount });
        const caseGroups = {};
        
        for (const evidenceId of accessibleEvidence) {
            try {
                const evidenceData = await contract.methods.evidence(evidenceId).call();
                if (!caseGroups[evidenceData.caseNumber]) {
                    caseGroups[evidenceData.caseNumber] = [];
                }
                caseGroups[evidenceData.caseNumber].push({ evidenceId, ...evidenceData });
            } catch (error) {
                // Skip inaccessible evidence
            }
        }

        if (Object.keys(caseGroups).length === 0) {
            container.innerHTML = '<div class="text-center p-8"><p>No assigned cases found.</p></div>';
            return;
        }

        container.innerHTML = '';
        
        for (const [caseNumber, evidenceList] of Object.entries(caseGroups)) {
            const caseCard = createCaseCard(caseNumber, evidenceList);
            container.appendChild(caseCard);
        }
    } catch (error) {
        document.getElementById('assignedCasesContainer').innerHTML = '<div class="alert alert-error">Failed to load cases: ' + error.message + '</div>';
    }
}

async function loadEvidenceDetails() {
    const evidenceId = document.getElementById('analysisEvidenceId').value.trim();
    if (!evidenceId) {
        showAlert('Please enter an evidence ID', 'warning');
        return;
    }

    try {
        const evidenceData = await contract.methods.evidence(evidenceId).call();
        if (!evidenceData.exists) {
            throw new Error('Evidence not found');
        }

        const detailsDiv = document.getElementById('evidenceDetails');
        const infoDiv = document.getElementById('evidenceInfo');
        
        const statusBadge = getEvidenceStatusBadge(evidenceData.status);
        const date = new Date(evidenceData.submissionTime * 1000).toLocaleDateString();
        
        infoDiv.innerHTML = `
            <p><strong>Evidence ID:</strong> ${evidenceId}</p>
            <p><strong>Case:</strong> ${evidenceData.caseNumber}</p>
            <p><strong>Description:</strong> ${evidenceData.description}</p>
            <p><strong>Category:</strong> ${evidenceData.category}</p>
            <p><strong>Status:</strong> <span class="badge ${statusBadge.class}">${statusBadge.text}</span></p>
            <p><strong>Submitted by:</strong> ${evidenceData.submitterName}</p>
            <p><strong>Submission Date:</strong> ${date}</p>
            ${evidenceData.forensicNotes ? `<p><strong>Existing Analysis:</strong> ${evidenceData.forensicNotes}</p>` : ''}
        `;
        
        detailsDiv.classList.remove('hidden');
    } catch (error) {
        showAlert('Failed to load evidence details: ' + error.message, 'error');
    }
}

async function handleUploadAnalysis(event) {
    event.preventDefault();
    
    try {
        showLoading(true, 'Uploading forensic analysis...');
        
        const evidenceId = document.getElementById('analysisEvidenceId').value;
        const forensicNotes = document.getElementById('forensicNotes').value;
        const analysisStatus = parseInt(document.getElementById('analysisStatus').value);
        const analysisFile = document.getElementById('analysisFile').files[0];
        
        let finalNotes = forensicNotes;
        
        // Upload analysis file to IPFS if provided
        if (analysisFile) {
            showLoading(true, 'Uploading analysis file to IPFS...');
            const ipfsResult = await uploadToIPFS(analysisFile);
            finalNotes += `\n\nAnalysis Report: ${config.IPFS_GATEWAY}${ipfsResult.IpfsHash}`;
        }
        
        // Add forensic analysis
        await contract.methods.addForensicAnalysis(evidenceId, finalNotes).send({ from: userAccount });
        
        // Update evidence status
        await contract.methods.updateEvidenceStatus(evidenceId, analysisStatus).send({ from: userAccount });
        
        showLoading(false);
        showAlert('Forensic analysis uploaded successfully!', 'success');
        
        // Reset form
        document.getElementById('uploadAnalysisForm').reset();
        document.getElementById('evidenceDetails').classList.add('hidden');
        
        // Reload analysis
        await loadMyAnalysis();
        await loadStatistics();
        
    } catch (error) {
        showLoading(false);
        showAlert('Failed to upload analysis: ' + error.message, 'error');
    }
}

async function uploadToIPFS(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
            'pinata_api_key': config.PINATA_API_KEY,
            'pinata_secret_api_key': config.PINATA_SECRET_KEY
        },
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Failed to upload to IPFS');
    }
    
    return await response.json();
}

function createAnalysisCard(analysisData) {
    const card = document.createElement('div');
    card.className = 'evidence-card';
    card.onclick = () => showAnalysisDetails(analysisData.evidenceId);
    
    const statusBadge = getEvidenceStatusBadge(analysisData.status);
    const analysisDate = new Date(analysisData.analysisDate * 1000).toLocaleDateString();
    
    card.innerHTML = `
        <div class="evidence-header">
            <div>
                <div class="evidence-id">${analysisData.evidenceId}</div>
                <div class="evidence-meta">Analyzed: ${analysisDate}</div>
            </div>
            <div class="badge ${statusBadge.class}">${statusBadge.text}</div>
        </div>
        <h3 class="mb-2">${analysisData.description}</h3>
        <div class="evidence-meta">
            <span>📂 ${analysisData.category}</span>
            <span>📋 Case: ${analysisData.caseNumber}</span>
        </div>
        <div class="mt-3">
            <p class="text-sm"><strong>Analysis:</strong> ${analysisData.forensicNotes.substring(0, 100)}${analysisData.forensicNotes.length > 100 ? '...' : ''}</p>
        </div>
    `;
    
    return card;
}

function createCaseCard(caseNumber, evidenceList) {
    const card = document.createElement('div');
    card.className = 'case-card';
    
    const pendingCount = evidenceList.filter(e => e.status === '0').length;
    const analyzedCount = evidenceList.filter(e => e.analyzedBy.toLowerCase() === userAccount.toLowerCase()).length;
    
    card.innerHTML = `
        <div class="case-header">
            <div>
                <div class="case-number">${caseNumber}</div>
                <div class="case-meta">${evidenceList.length} Evidence Items</div>
            </div>
            <div class="flex gap-2">
                <div class="badge badge-warning">${pendingCount} Pending</div>
                <div class="badge badge-success">${analyzedCount} Analyzed</div>
            </div>
        </div>
        <h3 class="mb-2">Forensic Assignment</h3>
        <div class="grid gap-2 mt-3">
            ${evidenceList.map(evidence => `
                <button class="btn btn-sm btn-outline text-left" onclick="showEvidenceDetails('${evidence.evidenceId}')">
                    ${evidence.evidenceId} - ${evidence.category}
                </button>
            `).join('')}
        </div>
    `;
    
    return card;
}

async function showEvidenceDetails(evidenceId) {
    try {
        const evidenceData = await contract.methods.evidence(evidenceId).call();
        
        const modal = document.getElementById('evidenceModal');
        const content = document.getElementById('modalEvidenceContent');
        
        document.getElementById('modalEvidenceTitle').textContent = `Evidence: ${evidenceId}`;
        
        const statusBadge = getEvidenceStatusBadge(evidenceData.status);
        const date = new Date(evidenceData.submissionTime * 1000).toLocaleDateString();
        const analysisDate = evidenceData.analysisDate > 0 ? new Date(evidenceData.analysisDate * 1000).toLocaleDateString() : 'Not analyzed';
        
        content.innerHTML = `
            <div class="grid gap-4">
                <div>
                    <strong>Evidence ID:</strong> ${evidenceId}<br>
                    <strong>Case Number:</strong> ${evidenceData.caseNumber}<br>
                    <strong>Category:</strong> ${evidenceData.category}<br>
                    <strong>Status:</strong> <span class="badge ${statusBadge.class}">${statusBadge.text}</span><br>
                    <strong>Submitted by:</strong> ${evidenceData.submitterName}<br>
                    <strong>Submission Date:</strong> ${date}
                </div>
                <div>
                    <strong>Description:</strong><br>
                    <p>${evidenceData.description}</p>
                </div>
                <div>
                    <strong>Collection Details:</strong><br>
                    <strong>Date:</strong> ${evidenceData.collectionDate}<br>
                    <strong>Location:</strong> ${evidenceData.collectionLocation}<br>
                    <strong>Collected By:</strong> ${evidenceData.collectedBy}
                </div>
                <div>
                    <strong>File Information:</strong><br>
                    <strong>Type:</strong> ${evidenceData.fileType}<br>
                    <strong>Size:</strong> ${evidenceData.fileSize}<br>
                    <strong>IPFS Hash:</strong> <code class="text-sm">${evidenceData.ipfsHash}</code>
                </div>
                ${evidenceData.forensicNotes ? `
                <div>
                    <strong>Forensic Analysis:</strong><br>
                    <strong>Analyzed by:</strong> ${evidenceData.analyzedBy.toLowerCase() === userAccount.toLowerCase() ? 'You' : 'Another analyst'}<br>
                    <strong>Analysis Date:</strong> ${analysisDate}<br>
                    <div class="p-3 bg-light rounded mt-2">
                        <p>${evidenceData.forensicNotes}</p>
                    </div>
                </div>
                ` : ''}
                <div class="text-center">
                    <button class="btn btn-primary" onclick="downloadEvidence('${evidenceData.ipfsHash}', '${evidenceId}')">
                        📥 Download Evidence File
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    } catch (error) {
        showAlert('Failed to load evidence details: ' + error.message, 'error');
    }
}

async function showAnalysisDetails(evidenceId) {
    try {
        const evidenceData = await contract.methods.evidence(evidenceId).call();
        
        const modal = document.getElementById('analysisModal');
        const content = document.getElementById('modalAnalysisContent');
        
        document.getElementById('modalAnalysisTitle').textContent = `Analysis: ${evidenceId}`;
        
        const statusBadge = getEvidenceStatusBadge(evidenceData.status);
        const analysisDate = new Date(evidenceData.analysisDate * 1000).toLocaleDateString();
        
        content.innerHTML = `
            <div class="grid gap-4">
                <div>
                    <strong>Evidence ID:</strong> ${evidenceId}<br>
                    <strong>Case Number:</strong> ${evidenceData.caseNumber}<br>
                    <strong>Status:</strong> <span class="badge ${statusBadge.class}">${statusBadge.text}</span><br>
                    <strong>Analysis Date:</strong> ${analysisDate}
                </div>
                <div>
                    <strong>Evidence Description:</strong><br>
                    <p>${evidenceData.description}</p>
                </div>
                <div>
                    <strong>Forensic Analysis:</strong><br>
                    <div class="p-4 bg-light rounded">
                        <pre style="white-space: pre-wrap; font-family: inherit;">${evidenceData.forensicNotes}</pre>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    } catch (error) {
        showAlert('Failed to load analysis details: ' + error.message, 'error');
    }
}

async function addQuickAnalysis() {
    const notes = document.getElementById('quickAnalysisNotes').value.trim();
    if (!notes) {
        showAlert('Please enter analysis notes', 'warning');
        return;
    }
    
    try {
        // This would need the current evidence ID from the modal context
        // For now, we'll show a placeholder
        showAlert('Quick analysis feature would be implemented with modal context', 'info');
    } catch (error) {
        showAlert('Failed to add analysis: ' + error.message, 'error');
    }
}

async function verifyEvidence() {
    const evidenceId = document.getElementById('verifyEvidenceId').value.trim();
    if (!evidenceId) {
        showAlert('Please enter an evidence ID', 'warning');
        return;
    }
    
    try {
        const evidenceData = await contract.methods.evidence(evidenceId).call();
        
        const result = document.getElementById('verificationResult');
        const statusBadge = getEvidenceStatusBadge(evidenceData.status);
        
        result.innerHTML = `
            <div class="alert alert-success">
                <h4>✅ Evidence Verified</h4>
                <p><strong>Evidence ID:</strong> ${evidenceId}</p>
                <p><strong>Case:</strong> ${evidenceData.caseNumber}</p>
                <p><strong>Status:</strong> <span class="badge ${statusBadge.class}">${statusBadge.text}</span></p>
                <p><strong>Submitted by:</strong> ${evidenceData.submitterName}</p>
                <p><strong>File Hash:</strong> <code>${evidenceData.fileHash}</code></p>
                <p><strong>IPFS Hash:</strong> <code>${evidenceData.ipfsHash}</code></p>
                ${evidenceData.forensicNotes ? `<p><strong>Analysis Status:</strong> ✅ Analyzed</p>` : `<p><strong>Analysis Status:</strong> ⏳ Pending</p>`}
            </div>
        `;
    } catch (error) {
        const result = document.getElementById('verificationResult');
        result.innerHTML = `
            <div class="alert alert-error">
                <h4>❌ Verification Failed</h4>
                <p>Evidence not found or access denied: ${error.message}</p>
            </div>
        `;
    }
}

async function bulkVerifyEvidence() {
    const evidenceIds = document.getElementById('bulkEvidenceIds').value.trim().split('\n').filter(id => id.trim());
    if (evidenceIds.length === 0) {
        showAlert('Please enter evidence IDs', 'warning');
        return;
    }
    
    const result = document.getElementById('bulkVerificationResult');
    result.innerHTML = '<div class="loading mb-4"></div><p>Verifying evidence...</p>';
    
    let verified = 0;
    let failed = 0;
    let results = [];
    
    for (const evidenceId of evidenceIds) {
        try {
            const evidenceData = await contract.methods.evidence(evidenceId.trim()).call();
            verified++;
            results.push(`✅ ${evidenceId.trim()} - Verified`);
        } catch (error) {
            failed++;
            results.push(`❌ ${evidenceId.trim()} - Failed: ${error.message}`);
        }
    }
    
    result.innerHTML = `
        <div class="alert alert-info">
            <h4>Bulk Verification Results</h4>
            <p><strong>Total:</strong> ${evidenceIds.length} | <strong>Verified:</strong> ${verified} | <strong>Failed:</strong> ${failed}</p>
            <div class="mt-3">
                ${results.map(r => `<div class="text-sm">${r}</div>`).join('')}
            </div>
        </div>
    `;
}

function downloadEvidence(ipfsHash, evidenceId) {
    const url = config.IPFS_GATEWAY + ipfsHash;
    const link = document.createElement('a');
    link.href = url;
    link.download = evidenceId;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getEvidenceStatusBadge(status) {
    const statuses = {
        0: { text: 'Submitted', class: 'badge-info' },
        1: { text: 'Verified', class: 'badge-success' },
        2: { text: 'Challenged', class: 'badge-warning' },
        3: { text: 'Accepted', class: 'badge-success' },
        4: { text: 'Rejected', class: 'badge-error' }
    };
    return statuses[status] || { text: 'Unknown', class: 'badge-secondary' };
}

function showLoading(show, message = 'Processing...') {
    const modal = document.getElementById('loadingModal');
    const messageEl = document.getElementById('loadingMessage');
    
    if (show) {
        messageEl.textContent = message;
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
    }
}

function showAlert(message, type) {
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}