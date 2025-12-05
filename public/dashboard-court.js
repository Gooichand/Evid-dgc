// Global variables
let web3;
let contract;
let userAccount;
let currentRequestId = null;

// Contract ABI for court official functions
const contractABI = [
    {
        "inputs": [{"internalType": "string", "name": "_caseNumber", "type": "string"}, {"internalType": "uint8", "name": "_newStatus", "type": "uint8"}],
        "name": "updateCaseStatus",
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
        "inputs": [{"internalType": "string", "name": "_caseNumber", "type": "string"}, {"internalType": "string", "name": "_reason", "type": "string"}],
        "name": "releaseCaseToPublic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_evidenceId", "type": "string"}, {"internalType": "string", "name": "_reason", "type": "string"}],
        "name": "releaseEvidenceToPublic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_caseNumber", "type": "string"}, {"internalType": "string", "name": "_reason", "type": "string"}],
        "name": "releaseCaseEvidenceToPublic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_requestId", "type": "uint256"}],
        "name": "approveAccessRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "name": "getTotalEvidence",
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
        "inputs": [{"internalType": "string", "name": "_evidenceId", "type": "string"}],
        "name": "getEvidence",
        "outputs": [{"internalType": "string", "name": "caseNumber", "type": "string"}, {"internalType": "string", "name": "itemNumber", "type": "string"}, {"internalType": "string", "name": "description", "type": "string"}, {"internalType": "string", "name": "category", "type": "string"}, {"internalType": "string", "name": "collectionDate", "type": "string"}, {"internalType": "string", "name": "collectionLocation", "type": "string"}, {"internalType": "string", "name": "collectedBy", "type": "string"}, {"internalType": "string", "name": "ipfsHash", "type": "string"}, {"internalType": "string", "name": "fileType", "type": "string"}, {"internalType": "string", "name": "fileSize", "type": "string"}, {"internalType": "bytes32", "name": "fileHash", "type": "bytes32"}, {"internalType": "string", "name": "submitterName", "type": "string"}, {"internalType": "uint256", "name": "submissionTime", "type": "uint256"}, {"internalType": "uint8", "name": "status", "type": "uint8"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "", "type": "string"}],
        "name": "cases",
        "outputs": [{"internalType": "string", "name": "caseNumber", "type": "string"}, {"internalType": "string", "name": "caseTitle", "type": "string"}, {"internalType": "string", "name": "description", "type": "string"}, {"internalType": "string", "name": "incidentDate", "type": "string"}, {"internalType": "string", "name": "location", "type": "string"}, {"internalType": "uint8", "name": "status", "type": "uint8"}, {"internalType": "uint8", "name": "visibility", "type": "uint8"}, {"internalType": "address", "name": "leadInvestigator", "type": "address"}, {"internalType": "string", "name": "leadInvestigatorName", "type": "string"}, {"internalType": "uint256", "name": "createdAt", "type": "uint256"}, {"internalType": "uint256", "name": "lastModified", "type": "uint256"}, {"internalType": "bool", "name": "releasedToPublic", "type": "bool"}, {"internalType": "address", "name": "releasedBy", "type": "address"}, {"internalType": "string", "name": "releasedByName", "type": "string"}, {"internalType": "uint256", "name": "releaseDate", "type": "uint256"}, {"internalType": "string", "name": "releaseReason", "type": "string"}, {"internalType": "bool", "name": "exists", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "accessRequests",
        "outputs": [{"internalType": "uint256", "name": "requestId", "type": "uint256"}, {"internalType": "address", "name": "requester", "type": "address"}, {"internalType": "string", "name": "requesterName", "type": "string"}, {"internalType": "string", "name": "evidenceId", "type": "string"}, {"internalType": "string", "name": "justification", "type": "string"}, {"internalType": "uint256", "name": "requestDate", "type": "uint256"}, {"internalType": "bool", "name": "approved", "type": "bool"}, {"internalType": "address", "name": "approvedBy", "type": "address"}, {"internalType": "uint256", "name": "approvalDate", "type": "uint256"}, {"internalType": "bool", "name": "exists", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "requestCounter",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
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
        await loadAllCases();
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
    document.getElementById('releaseCaseForm').addEventListener('submit', handleReleaseCase);
    document.getElementById('releaseEvidenceForm').addEventListener('submit', handleReleaseEvidence);
    document.getElementById('updateCaseStatusForm').addEventListener('submit', handleUpdateCaseStatus);
    document.getElementById('updateEvidenceStatusForm').addEventListener('submit', handleUpdateEvidenceStatus);

    // Refresh buttons
    document.getElementById('refreshAllCases').addEventListener('click', loadAllCases);
    document.getElementById('refreshAccessRequests').addEventListener('click', loadAccessRequests);

    // Filters
    document.getElementById('caseStatusFilter').addEventListener('change', filterCases);
    document.getElementById('caseVisibilityFilter').addEventListener('change', filterCases);

    // Verify evidence
    document.getElementById('verifyEvidenceBtn').addEventListener('click', verifyEvidence);

    // Modal actions
    document.getElementById('approveRequest').addEventListener('click', approveAccessRequest);
    document.getElementById('quickReleaseCase').addEventListener('click', quickReleaseCase);
    document.getElementById('quickReleaseEvidence').addEventListener('click', quickReleaseEvidence);

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
    if (tabName === 'access-requests') {
        loadAccessRequests();
    } else if (tabName === 'release-public') {
        loadRecentlyReleased();
    }
}

async function loadStatistics() {
    try {
        const totalCases = await contract.methods.getTotalCases().call();
        const totalEvidence = await contract.methods.getTotalEvidence().call();
        const publicStats = await contract.methods.getPublicStatistics().call();
        
        // Get pending requests count
        const requestCounter = await contract.methods.requestCounter().call();
        let pendingRequests = 0;
        
        for (let i = 1; i <= requestCounter; i++) {
            try {
                const request = await contract.methods.accessRequests(i).call();
                if (request.exists && !request.approved) {
                    pendingRequests++;
                }
            } catch (error) {
                // Skip non-existent requests
            }
        }

        document.getElementById('totalCasesCount').textContent = totalCases;
        document.getElementById('pendingRequestsCount').textContent = pendingRequests;
        document.getElementById('releasedItemsCount').textContent = parseInt(publicStats.publicCases) + parseInt(publicStats.publicEvidence);
        document.getElementById('totalEvidenceCount').textContent = totalEvidence;
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

async function loadAllCases() {
    try {
        const container = document.getElementById('allCasesContainer');
        container.innerHTML = '<div class="text-center p-8"><div class="loading mb-4"></div><p>Loading all cases...</p></div>';

        // Try to load common case patterns (in a real implementation, you'd have a function to get all cases)
        const casePatterns = [];
        for (let year = 2024; year >= 2020; year--) {
            for (let i = 1; i <= 50; i++) {
                casePatterns.push(`CASE-${year}-${i.toString().padStart(3, '0')}`);
                casePatterns.push(`INV-${year}-${i.toString().padStart(3, '0')}`);
            }
        }
        
        const cases = [];
        
        for (const caseNumber of casePatterns.slice(0, 20)) { // Limit to first 20 for demo
            try {
                const caseData = await contract.methods.cases(caseNumber).call();
                if (caseData.exists) {
                    cases.push({ caseNumber, ...caseData });
                }
            } catch (error) {
                // Case doesn't exist, continue
            }
        }

        if (cases.length === 0) {
            container.innerHTML = '<div class="text-center p-8"><p>No cases found in the system.</p></div>';
            return;
        }

        container.innerHTML = '';
        
        for (const caseData of cases) {
            const caseCard = createCaseCard(caseData);
            container.appendChild(caseCard);
        }
    } catch (error) {
        document.getElementById('allCasesContainer').innerHTML = '<div class="alert alert-error">Failed to load cases: ' + error.message + '</div>';
    }
}

async function loadAccessRequests() {
    try {
        const container = document.getElementById('accessRequestsContainer');
        container.innerHTML = '<div class="text-center p-8"><div class="loading mb-4"></div><p>Loading access requests...</p></div>';

        const requestCounter = await contract.methods.requestCounter().call();
        const requests = [];
        
        for (let i = 1; i <= requestCounter; i++) {
            try {
                const request = await contract.methods.accessRequests(i).call();
                if (request.exists) {
                    requests.push(request);
                }
            } catch (error) {
                // Skip non-existent requests
            }
        }

        if (requests.length === 0) {
            container.innerHTML = '<div class="text-center p-8"><p>No access requests found.</p></div>';
            return;
        }

        container.innerHTML = '';
        
        // Sort by date (newest first)
        requests.sort((a, b) => b.requestDate - a.requestDate);
        
        for (const request of requests) {
            const requestCard = createAccessRequestCard(request);
            container.appendChild(requestCard);
        }
    } catch (error) {
        document.getElementById('accessRequestsContainer').innerHTML = '<div class="alert alert-error">Failed to load requests: ' + error.message + '</div>';
    }
}

async function loadRecentlyReleased() {
    try {
        const container = document.getElementById('recentlyReleasedContainer');
        container.innerHTML = '<div class="text-center p-4"><div class="loading mb-4"></div><p>Loading recently released items...</p></div>';

        const publicStats = await contract.methods.getPublicStatistics().call();
        
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-light rounded">
                    <div class="text-2xl font-bold text-success">${publicStats.publicCases}</div>
                    <div class="text-sm text-muted">Public Cases</div>
                </div>
                <div class="text-center p-4 bg-light rounded">
                    <div class="text-2xl font-bold text-success">${publicStats.publicEvidence}</div>
                    <div class="text-sm text-muted">Public Evidence</div>
                </div>
            </div>
            <p class="text-center text-muted mt-4">Items released to public are now accessible by all users</p>
        `;
    } catch (error) {
        document.getElementById('recentlyReleasedContainer').innerHTML = '<div class="alert alert-error">Failed to load released items</div>';
    }
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
                ${caseData.releasedToPublic ? '<div class="badge badge-success">Public</div>' : ''}
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

function createAccessRequestCard(request) {
    const card = document.createElement('div');
    card.className = 'card mb-4';
    card.onclick = () => showAccessRequestDetails(request.requestId);
    
    const date = new Date(request.requestDate * 1000).toLocaleDateString();
    const statusBadge = request.approved ? 
        '<div class="badge badge-success">Approved</div>' : 
        '<div class="badge badge-warning">Pending</div>';
    
    card.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h4>Request #${request.requestId}</h4>
                <p><strong>Requester:</strong> ${request.requesterName}</p>
                <p><strong>Evidence ID:</strong> ${request.evidenceId}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Justification:</strong> ${request.justification.substring(0, 100)}${request.justification.length > 100 ? '...' : ''}</p>
            </div>
            <div>
                ${statusBadge}
            </div>
        </div>
        ${request.approved ? `
            <div class="mt-3 p-3 bg-light rounded">
                <p class="text-sm"><strong>Approved:</strong> ${new Date(request.approvalDate * 1000).toLocaleDateString()}</p>
            </div>
        ` : ''}
    `;
    
    return card;
}

async function handleReleaseCase(event) {
    event.preventDefault();
    
    try {
        showLoading(true, 'Releasing case to public...');
        
        const caseNumber = document.getElementById('releaseCaseNumber').value;
        const reason = document.getElementById('caseReleaseReason').value;
        const releaseAllEvidence = document.getElementById('releaseAllEvidence').checked;
        
        if (releaseAllEvidence) {
            await contract.methods.releaseCaseEvidenceToPublic(caseNumber, reason).send({ from: userAccount });
        } else {
            await contract.methods.releaseCaseToPublic(caseNumber, reason).send({ from: userAccount });
        }
        
        showLoading(false);
        showAlert('Case released to public successfully!', 'success');
        
        // Reset form
        document.getElementById('releaseCaseForm').reset();
        
        // Reload data
        await loadStatistics();
        await loadRecentlyReleased();
        
    } catch (error) {
        showLoading(false);
        showAlert('Failed to release case: ' + error.message, 'error');
    }
}

async function handleReleaseEvidence(event) {
    event.preventDefault();
    
    try {
        showLoading(true, 'Releasing evidence to public...');
        
        const evidenceId = document.getElementById('releaseEvidenceId').value;
        const reason = document.getElementById('evidenceReleaseReason').value;
        
        await contract.methods.releaseEvidenceToPublic(evidenceId, reason).send({ from: userAccount });
        
        showLoading(false);
        showAlert('Evidence released to public successfully!', 'success');
        
        // Reset form
        document.getElementById('releaseEvidenceForm').reset();
        
        // Reload data
        await loadStatistics();
        await loadRecentlyReleased();
        
    } catch (error) {
        showLoading(false);
        showAlert('Failed to release evidence: ' + error.message, 'error');
    }
}

async function handleUpdateCaseStatus(event) {
    event.preventDefault();
    
    try {
        showLoading(true, 'Updating case status...');
        
        const caseNumber = document.getElementById('statusCaseNumber').value;
        const newStatus = parseInt(document.getElementById('newCaseStatus').value);
        
        await contract.methods.updateCaseStatus(caseNumber, newStatus).send({ from: userAccount });
        
        showLoading(false);
        showAlert('Case status updated successfully!', 'success');
        
        // Reset form
        document.getElementById('updateCaseStatusForm').reset();
        
        // Reload cases
        await loadAllCases();
        
    } catch (error) {
        showLoading(false);
        showAlert('Failed to update case status: ' + error.message, 'error');
    }
}

async function handleUpdateEvidenceStatus(event) {
    event.preventDefault();
    
    try {
        showLoading(true, 'Updating evidence status...');
        
        const evidenceId = document.getElementById('statusEvidenceId').value;
        const newStatus = parseInt(document.getElementById('newEvidenceStatus').value);
        
        await contract.methods.updateEvidenceStatus(evidenceId, newStatus).send({ from: userAccount });
        
        showLoading(false);
        showAlert('Evidence status updated successfully!', 'success');
        
        // Reset form
        document.getElementById('updateEvidenceStatusForm').reset();
        
    } catch (error) {
        showLoading(false);
        showAlert('Failed to update evidence status: ' + error.message, 'error');
    }
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

async function showAccessRequestDetails(requestId) {
    try {
        const request = await contract.methods.accessRequests(requestId).call();
        currentRequestId = requestId;
        
        const modal = document.getElementById('accessRequestModal');
        const content = document.getElementById('modalRequestContent');
        
        document.getElementById('modalRequestTitle').textContent = `Access Request #${requestId}`;
        
        const date = new Date(request.requestDate * 1000).toLocaleDateString();
        
        content.innerHTML = `
            <div class="grid gap-4">
                <div>
                    <strong>Request ID:</strong> ${requestId}<br>
                    <strong>Requester:</strong> ${request.requesterName}<br>
                    <strong>Evidence ID:</strong> ${request.evidenceId}<br>
                    <strong>Request Date:</strong> ${date}<br>
                    <strong>Status:</strong> ${request.approved ? 'Approved' : 'Pending'}
                </div>
                <div>
                    <strong>Justification:</strong><br>
                    <p>${request.justification}</p>
                </div>
                ${request.approved ? `
                <div class="alert alert-success">
                    <strong>Approved:</strong> ${new Date(request.approvalDate * 1000).toLocaleDateString()}
                </div>
                ` : ''}
            </div>
        `;
        
        // Hide approve/deny buttons if already approved
        document.getElementById('approveRequest').style.display = request.approved ? 'none' : 'block';
        document.getElementById('denyRequest').style.display = request.approved ? 'none' : 'block';
        
        modal.classList.add('active');
    } catch (error) {
        showAlert('Failed to load request details: ' + error.message, 'error');
    }
}

async function approveAccessRequest() {
    if (!currentRequestId) return;
    
    try {
        showLoading(true, 'Approving access request...');
        
        await contract.methods.approveAccessRequest(currentRequestId).send({ from: userAccount });
        
        showLoading(false);
        showAlert('Access request approved successfully!', 'success');
        
        // Close modal and reload requests
        document.getElementById('accessRequestModal').classList.remove('active');
        await loadAccessRequests();
        await loadStatistics();
        
    } catch (error) {
        showLoading(false);
        showAlert('Failed to approve request: ' + error.message, 'error');
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
        const statusBadge = getEvidenceStatusBadge(evidenceDetails.status);
        
        result.innerHTML = `
            <div class="alert alert-success">
                <h4>✅ Evidence Verified</h4>
                <p><strong>Evidence ID:</strong> ${evidenceId}</p>
                <p><strong>Case:</strong> ${evidenceDetails.caseNumber}</p>
                <p><strong>Status:</strong> <span class="badge ${statusBadge.class}">${statusBadge.text}</span></p>
                <p><strong>Submitted by:</strong> ${evidenceDetails.submitterName}</p>
                <p><strong>File Hash:</strong> <code>${evidenceDetails.fileHash}</code></p>
                <p><strong>IPFS Hash:</strong> <code>${evidenceDetails.ipfsHash}</code></p>
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

function filterCases() {
    const statusFilter = document.getElementById('caseStatusFilter').value;
    const visibilityFilter = document.getElementById('caseVisibilityFilter').value;
    const cards = document.querySelectorAll('.case-card');
    
    cards.forEach(card => {
        let show = true;
        
        if (statusFilter) {
            const statusBadge = card.querySelector('.badge');
            // This is a simplified filter - in a real implementation, you'd store the status value
            show = show && statusBadge.textContent.toLowerCase().includes(getStatusText(statusFilter).toLowerCase());
        }
        
        if (visibilityFilter) {
            // Similar simplified filter for visibility
            show = show && card.textContent.toLowerCase().includes(getVisibilityText(visibilityFilter).toLowerCase());
        }
        
        card.style.display = show ? 'block' : 'none';
    });
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

function getStatusText(status) {
    return getStatusBadge(parseInt(status)).text;
}

function getVisibilityText(visibility) {
    return getVisibilityBadge(parseInt(visibility)).text;
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