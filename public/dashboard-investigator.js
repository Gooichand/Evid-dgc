// Global variables
let web3;
let contract;
let userAccount;
let myCases = [];
let myEvidence = [];

// Contract ABI for investigator functions
const contractABI = [
    {
        "inputs": [{"internalType": "string", "name": "_caseNumber", "type": "string"}, {"internalType": "string", "name": "_title", "type": "string"}, {"internalType": "string", "name": "_description", "type": "string"}, {"internalType": "string", "name": "_incidentDate", "type": "string"}, {"internalType": "string", "name": "_location", "type": "string"}, {"internalType": "uint8", "name": "_visibility", "type": "uint8"}],
        "name": "createCase",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_caseNumber", "type": "string"}, {"internalType": "string", "name": "_suspectInfo", "type": "string"}],
        "name": "addSuspectToCase",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_caseNumber", "type": "string"}, {"internalType": "string", "name": "_victimInfo", "type": "string"}],
        "name": "addVictimToCase",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_evidenceId", "type": "string"}, {"internalType": "string", "name": "_caseNumber", "type": "string"}, {"internalType": "string", "name": "_itemNumber", "type": "string"}, {"internalType": "string", "name": "_description", "type": "string"}, {"internalType": "string", "name": "_category", "type": "string"}, {"internalType": "string", "name": "_collectionDate", "type": "string"}, {"internalType": "string", "name": "_collectionLocation", "type": "string"}, {"internalType": "string", "name": "_collectedBy", "type": "string"}, {"internalType": "string", "name": "_ipfsHash", "type": "string"}, {"internalType": "string", "name": "_fileType", "type": "string"}, {"internalType": "string", "name": "_fileSize", "type": "string"}, {"internalType": "bytes32", "name": "_fileHash", "type": "bytes32"}],
        "name": "submitEvidence",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMyEvidence",
        "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
        "stateMutability": "view",
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
        "name": "getPublicReleasedEvidence",
        "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalCases",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPublicStatistics",
        "outputs": [{"internalType": "uint256", "name": "publicCases", "type": "uint256"}, {"internalType": "uint256", "name": "publicEvidence", "type": "uint256"}, {"internalType": "uint256", "name": "totalComments", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "", "type": "string"}],
        "name": "cases",
        "outputs": [{"internalType": "string", "name": "caseNumber", "type": "string"}, {"internalType": "string", "name": "caseTitle", "type": "string"}, {"internalType": "string", "name": "description", "type": "string"}, {"internalType": "string", "name": "incidentDate", "type": "string"}, {"internalType": "string", "name": "location", "type": "string"}, {"internalType": "uint8", "name": "status", "type": "uint8"}, {"internalType": "uint8", "name": "visibility", "type": "uint8"}, {"internalType": "address", "name": "leadInvestigator", "type": "address"}, {"internalType": "string", "name": "leadInvestigatorName", "type": "string"}, {"internalType": "uint256", "name": "createdAt", "type": "uint256"}, {"internalType": "uint256", "name": "lastModified", "type": "uint256"}, {"internalType": "bool", "name": "releasedToPublic", "type": "bool"}, {"internalType": "address", "name": "releasedBy", "type": "address"}, {"internalType": "string", "name": "releasedByName", "type": "string"}, {"internalType": "uint256", "name": "releaseDate", "type": "uint256"}, {"internalType": "string", "name": "releaseReason", "type": "string"}, {"internalType": "bool", "name": "exists", "type": "bool"}],
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
        await loadMyCases();
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
    document.getElementById('createCaseForm').addEventListener('submit', handleCreateCase);
    document.getElementById('uploadEvidenceForm').addEventListener('submit', handleUploadEvidence);

    // Refresh buttons
    document.getElementById('refreshMyCases').addEventListener('click', loadMyCases);
    document.getElementById('refreshMyEvidence').addEventListener('click', loadMyEvidence);
    document.getElementById('refreshPublicEvidence').addEventListener('click', loadPublicEvidence);

    // Verify evidence
    document.getElementById('verifyEvidenceBtn').addEventListener('click', verifyEvidence);

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    // Access management
    document.getElementById('grantCaseAccess').addEventListener('click', grantCaseAccess);
    document.getElementById('grantEvidenceAccess').addEventListener('click', grantEvidenceAccess);

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
    if (tabName === 'my-evidence') {
        loadMyEvidence();
    } else if (tabName === 'browse-public') {
        loadPublicEvidence();
    } else if (tabName === 'upload-evidence') {
        loadCaseOptions();
    }
}

async function loadStatistics() {
    try {
        const myEvidenceIds = await contract.methods.getMyEvidence().call({ from: userAccount });
        const totalCases = await contract.methods.getTotalCases().call();
        const publicStats = await contract.methods.getPublicStatistics().call();

        document.getElementById('myCasesCount').textContent = myCases.length;
        document.getElementById('myEvidenceCount').textContent = myEvidenceIds.length;
        document.getElementById('totalCasesCount').textContent = totalCases;
        document.getElementById('publicCasesCount').textContent = publicStats.publicCases;
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

async function loadMyCases() {
    try {
        const container = document.getElementById('myCasesContainer');
        container.innerHTML = '<div class="text-center p-8"><div class="loading mb-4"></div><p>Loading your cases...</p></div>';

        // Get all cases and filter by lead investigator
        // Note: In a real implementation, you'd have a function to get cases by investigator
        // For now, we'll simulate this by checking a few case numbers
        myCases = [];
        
        // Try to load some common case patterns
        const casePatterns = ['CASE-2024-001', 'CASE-2024-002', 'CASE-2024-003', 'INV-2024-001', 'INV-2024-002'];
        
        for (const caseNumber of casePatterns) {
            try {
                const caseData = await contract.methods.cases(caseNumber).call();
                if (caseData.exists && caseData.leadInvestigator.toLowerCase() === userAccount.toLowerCase()) {
                    myCases.push({ caseNumber, ...caseData });
                }
            } catch (error) {
                // Case doesn't exist, continue
            }
        }

        if (myCases.length === 0) {
            container.innerHTML = '<div class="text-center p-8"><p>No cases found. Create your first case!</p></div>';
            return;
        }

        container.innerHTML = '';
        
        for (const caseData of myCases) {
            const caseCard = createCaseCard(caseData);
            container.appendChild(caseCard);
        }

        // Update statistics
        document.getElementById('myCasesCount').textContent = myCases.length;
    } catch (error) {
        document.getElementById('myCasesContainer').innerHTML = '<div class="alert alert-error">Failed to load cases: ' + error.message + '</div>';
    }
}

async function loadMyEvidence() {
    try {
        const container = document.getElementById('myEvidenceContainer');
        container.innerHTML = '<div class="text-center p-8"><div class="loading mb-4"></div><p>Loading your evidence...</p></div>';

        const evidenceIds = await contract.methods.getMyEvidence().call({ from: userAccount });
        
        if (evidenceIds.length === 0) {
            container.innerHTML = '<div class="text-center p-8"><p>No evidence found. Upload your first evidence!</p></div>';
            return;
        }

        container.innerHTML = '';
        myEvidence = [];
        
        for (const evidenceId of evidenceIds) {
            try {
                const evidenceDetails = await contract.methods.getEvidence(evidenceId).call({ from: userAccount });
                myEvidence.push({ evidenceId, ...evidenceDetails });
                const evidenceCard = createEvidenceCard(evidenceId, evidenceDetails);
                container.appendChild(evidenceCard);
            } catch (error) {
                console.error(`Failed to load evidence ${evidenceId}:`, error);
            }
        }

        // Update statistics
        document.getElementById('myEvidenceCount').textContent = myEvidence.length;
    } catch (error) {
        document.getElementById('myEvidenceContainer').innerHTML = '<div class="alert alert-error">Failed to load evidence: ' + error.message + '</div>';
    }
}

async function loadPublicEvidence() {
    try {
        const container = document.getElementById('publicEvidenceContainer');
        container.innerHTML = '<div class="text-center p-8"><div class="loading mb-4"></div><p>Loading public evidence...</p></div>';

        const evidenceIds = await contract.methods.getPublicReleasedEvidence().call();
        
        if (evidenceIds.length === 0) {
            container.innerHTML = '<div class="text-center p-8"><p>No public evidence available yet.</p></div>';
            return;
        }

        container.innerHTML = '';
        
        for (const evidenceId of evidenceIds) {
            try {
                const evidenceDetails = await contract.methods.getEvidence(evidenceId).call({ from: userAccount });
                const evidenceCard = createEvidenceCard(evidenceId, evidenceDetails, true);
                container.appendChild(evidenceCard);
            } catch (error) {
                console.error(`Failed to load evidence ${evidenceId}:`, error);
            }
        }
    } catch (error) {
        document.getElementById('publicEvidenceContainer').innerHTML = '<div class="alert alert-error">Failed to load evidence: ' + error.message + '</div>';
    }
}

async function loadCaseOptions() {
    const select = document.getElementById('evidenceCaseNumber');
    select.innerHTML = '<option value="">Select Case</option>';
    
    for (const caseData of myCases) {
        const option = document.createElement('option');
        option.value = caseData.caseNumber;
        option.textContent = `${caseData.caseNumber} - ${caseData.caseTitle}`;
        select.appendChild(option);
    }
}

async function handleCreateCase(event) {
    event.preventDefault();
    
    try {
        showLoading(true, 'Creating case...');
        
        const caseNumber = document.getElementById('caseNumber').value;
        const caseTitle = document.getElementById('caseTitle').value;
        const caseDescription = document.getElementById('caseDescription').value;
        const incidentDate = document.getElementById('incidentDate').value;
        const caseLocation = document.getElementById('caseLocation').value;
        const caseVisibility = parseInt(document.getElementById('caseVisibility').value);
        
        // Create case
        await contract.methods.createCase(
            caseNumber,
            caseTitle,
            caseDescription,
            incidentDate,
            caseLocation,
            caseVisibility
        ).send({ from: userAccount });
        
        // Add suspects if provided
        const suspects = document.getElementById('suspects').value.trim();
        if (suspects) {
            const suspectList = suspects.split('\n').filter(s => s.trim());
            for (const suspect of suspectList) {
                await contract.methods.addSuspectToCase(caseNumber, suspect.trim()).send({ from: userAccount });
            }
        }
        
        // Add victims if provided
        const victims = document.getElementById('victims').value.trim();
        if (victims) {
            const victimList = victims.split('\n').filter(v => v.trim());
            for (const victim of victimList) {
                await contract.methods.addVictimToCase(caseNumber, victim.trim()).send({ from: userAccount });
            }
        }
        
        showLoading(false);
        showAlert('Case created successfully!', 'success');
        
        // Reset form
        document.getElementById('createCaseForm').reset();
        
        // Reload cases
        await loadMyCases();
        await loadStatistics();
        
    } catch (error) {
        showLoading(false);
        showAlert('Failed to create case: ' + error.message, 'error');
    }
}

async function handleUploadEvidence(event) {
    event.preventDefault();
    
    try {
        showLoading(true, 'Uploading evidence...');
        
        const evidenceId = document.getElementById('evidenceId').value;
        const caseNumber = document.getElementById('evidenceCaseNumber').value;
        const itemNumber = document.getElementById('itemNumber').value;
        const description = document.getElementById('evidenceDescription').value;
        const category = document.getElementById('evidenceCategory').value;
        const collectionDate = document.getElementById('collectionDate').value;
        const collectionLocation = document.getElementById('collectionLocation').value;
        const collectedBy = document.getElementById('collectedBy').value;
        const file = document.getElementById('evidenceFile').files[0];
        
        if (!file) {
            throw new Error('Please select a file');
        }
        
        // Upload to IPFS
        showLoading(true, 'Uploading file to IPFS...');
        const ipfsResult = await uploadToIPFS(file);
        
        // Calculate file hash
        const fileBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
        const fileHash = '0x' + Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        
        // Submit evidence to blockchain
        showLoading(true, 'Submitting evidence to blockchain...');
        await contract.methods.submitEvidence(
            evidenceId,
            caseNumber,
            itemNumber,
            description,
            category,
            collectionDate,
            collectionLocation,
            collectedBy,
            ipfsResult.IpfsHash,
            file.type || 'application/octet-stream',
            formatFileSize(file.size),
            fileHash
        ).send({ from: userAccount });
        
        showLoading(false);
        showAlert('Evidence uploaded successfully!', 'success');
        
        // Reset form
        document.getElementById('uploadEvidenceForm').reset();
        
        // Reload evidence
        await loadMyEvidence();
        await loadStatistics();
        
    } catch (error) {
        showLoading(false);
        showAlert('Failed to upload evidence: ' + error.message, 'error');
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

function createCaseCard(caseData) {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.onclick = () => showCaseDetails(caseData.caseNumber);
    
    const statusBadge = getStatusBadge(caseData.status);
    const visibilityBadge = getVisibilityBadge(caseData.visibility);
    const date = new Date(caseData.createdAt * 1000).toLocaleDateString();
    
    card.innerHTML = `
        <div class="case-header">
            <div>
                <div class="case-number">${caseData.caseNumber}</div>
                <div class="case-meta">${date} • ${caseData.leadInvestigatorName}</div>
            </div>
            <div class="flex gap-2">
                <div class="badge ${statusBadge.class}">${statusBadge.text}</div>
                <div class="badge ${visibilityBadge.class}">${visibilityBadge.text}</div>
            </div>
        </div>
        <h3 class="mb-2">${caseData.caseTitle}</h3>
        <p class="text-muted mb-2">${caseData.description.substring(0, 150)}${caseData.description.length > 150 ? '...' : ''}</p>
        <div class="case-meta">
            <span>📍 ${caseData.location}</span>
            <span>📅 ${caseData.incidentDate}</span>
        </div>
    `;
    
    return card;
}

function createEvidenceCard(evidenceId, evidenceDetails, isPublic = false) {
    const card = document.createElement('div');
    card.className = 'evidence-card';
    card.onclick = () => showEvidenceDetails(evidenceId);
    
    const statusBadge = getEvidenceStatusBadge(evidenceDetails.status);
    const date = new Date(evidenceDetails.submissionTime * 1000).toLocaleDateString();
    
    card.innerHTML = `
        <div class="evidence-header">
            <div>
                <div class="evidence-id">${evidenceId}</div>
                <div class="evidence-meta">${date} • ${evidenceDetails.submitterName}</div>
            </div>
            <div class="badge ${statusBadge.class}">${statusBadge.text}</div>
        </div>
        <h3 class="mb-2">${evidenceDetails.description}</h3>
        <div class="evidence-meta">
            <span>📂 ${evidenceDetails.category}</span>
            <span>📄 ${evidenceDetails.fileType}</span>
            <span>📏 ${evidenceDetails.fileSize}</span>
        </div>
        <div class="mt-3">
            <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); downloadEvidence('${evidenceDetails.ipfsHash}', '${evidenceId}')">
                📥 Download
            </button>
            ${!isPublic ? `<button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); showEvidenceDetails('${evidenceId}')">
                👁️ View Details
            </button>` : ''}
        </div>
    `;
    
    return card;
}

async function showCaseDetails(caseNumber) {
    try {
        const caseData = await contract.methods.cases(caseNumber).call();
        
        const modal = document.getElementById('caseModal');
        const content = document.getElementById('modalCaseContent');
        
        document.getElementById('modalCaseTitle').textContent = caseData.caseTitle;
        
        const statusBadge = getStatusBadge(caseData.status);
        const visibilityBadge = getVisibilityBadge(caseData.visibility);
        const date = new Date(caseData.createdAt * 1000).toLocaleDateString();
        
        content.innerHTML = `
            <div class="grid gap-4">
                <div>
                    <strong>Case Number:</strong> ${caseNumber}<br>
                    <strong>Status:</strong> <span class="badge ${statusBadge.class}">${statusBadge.text}</span><br>
                    <strong>Visibility:</strong> <span class="badge ${visibilityBadge.class}">${visibilityBadge.text}</span><br>
                    <strong>Incident Date:</strong> ${caseData.incidentDate}<br>
                    <strong>Location:</strong> ${caseData.location}<br>
                    <strong>Lead Investigator:</strong> ${caseData.leadInvestigatorName}<br>
                    <strong>Created:</strong> ${date}
                </div>
                <div>
                    <strong>Description:</strong><br>
                    <p>${caseData.description}</p>
                </div>
                ${caseData.releasedToPublic ? `
                <div class="alert alert-info">
                    <strong>Public Release:</strong> This case has been released to the public<br>
                    <strong>Released by:</strong> ${caseData.releasedByName}<br>
                    <strong>Release date:</strong> ${new Date(caseData.releaseDate * 1000).toLocaleDateString()}<br>
                    <strong>Reason:</strong> ${caseData.releaseReason}
                </div>
                ` : ''}
            </div>
        `;
        
        modal.classList.add('active');
    } catch (error) {
        showAlert('Failed to load case details: ' + error.message, 'error');
    }
}

async function showEvidenceDetails(evidenceId) {
    try {
        const evidenceDetails = await contract.methods.getEvidence(evidenceId).call({ from: userAccount });
        
        const modal = document.getElementById('evidenceModal');
        const content = document.getElementById('modalEvidenceContent');
        
        document.getElementById('modalEvidenceTitle').textContent = `Evidence: ${evidenceId}`;
        
        const statusBadge = getEvidenceStatusBadge(evidenceDetails.status);
        const date = new Date(evidenceDetails.submissionTime * 1000).toLocaleDateString();
        
        content.innerHTML = `
            <div class="grid gap-4">
                <div>
                    <strong>Evidence ID:</strong> ${evidenceId}<br>
                    <strong>Case Number:</strong> ${evidenceDetails.caseNumber}<br>
                    <strong>Item Number:</strong> ${evidenceDetails.itemNumber}<br>
                    <strong>Status:</strong> <span class="badge ${statusBadge.class}">${statusBadge.text}</span><br>
                    <strong>Category:</strong> ${evidenceDetails.category}<br>
                    <strong>Submitted By:</strong> ${evidenceDetails.submitterName}<br>
                    <strong>Submission Date:</strong> ${date}
                </div>
                <div>
                    <strong>Description:</strong><br>
                    <p>${evidenceDetails.description}</p>
                </div>
                <div>
                    <strong>Collection Details:</strong><br>
                    <strong>Date:</strong> ${evidenceDetails.collectionDate}<br>
                    <strong>Location:</strong> ${evidenceDetails.collectionLocation}<br>
                    <strong>Collected By:</strong> ${evidenceDetails.collectedBy}
                </div>
                <div>
                    <strong>File Information:</strong><br>
                    <strong>Type:</strong> ${evidenceDetails.fileType}<br>
                    <strong>Size:</strong> ${evidenceDetails.fileSize}<br>
                    <strong>IPFS Hash:</strong> <code class="text-sm">${evidenceDetails.ipfsHash}</code><br>
                    <strong>File Hash:</strong> <code class="text-sm">${evidenceDetails.fileHash}</code>
                </div>
                <div class="text-center">
                    <button class="btn btn-primary" onclick="downloadEvidence('${evidenceDetails.ipfsHash}', '${evidenceId}')">
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

async function verifyEvidence() {
    const evidenceId = document.getElementById('verifyEvidenceId').value.trim();
    if (!evidenceId) {
        showAlert('Please enter an evidence ID', 'warning');
        return;
    }
    
    try {
        const evidenceDetails = await contract.methods.getEvidence(evidenceId).call({ from: userAccount });
        
        const result = document.getElementById('verificationResult');
        result.innerHTML = `
            <div class="alert alert-success">
                <h4>✅ Evidence Verified</h4>
                <p><strong>Evidence ID:</strong> ${evidenceId}</p>
                <p><strong>Case:</strong> ${evidenceDetails.caseNumber}</p>
                <p><strong>Status:</strong> ${getEvidenceStatusBadge(evidenceDetails.status).text}</p>
                <p><strong>Submitted by:</strong> ${evidenceDetails.submitterName}</p>
                <p><strong>IPFS Hash:</strong> <code>${evidenceDetails.ipfsHash}</code></p>
                <p><strong>File Hash:</strong> <code>${evidenceDetails.fileHash}</code></p>
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

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getStatusBadge(status) {
    const statuses = {
        0: { text: 'Open', class: 'badge-info' },
        1: { text: 'Under Review', class: 'badge-warning' },
        2: { text: 'Closed', class: 'badge-success' },
        3: { text: 'Archived', class: 'badge-secondary' }
    };
    return statuses[status] || { text: 'Unknown', class: 'badge-secondary' };
}

function getVisibilityBadge(visibility) {
    const visibilities = {
        0: { text: 'Public', class: 'badge-success' },
        1: { text: 'Restricted', class: 'badge-warning' },
        2: { text: 'Confidential', class: 'badge-error' },
        3: { text: 'Public Released', class: 'badge-info' }
    };
    return visibilities[visibility] || { text: 'Unknown', class: 'badge-secondary' };
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