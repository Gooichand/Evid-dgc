// Global variables
let web3;
let contract;
let userAccount;
let currentCaseId = '';
let currentEvidenceId = '';

// Contract ABI for public viewer functions
const contractABI = [
    {
        "inputs": [],
        "name": "getPublicReleasedCases",
        "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
        "stateMutability": "view",
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
        "inputs": [{"internalType": "string", "name": "_caseNumber", "type": "string"}],
        "name": "getPublicCaseDetails",
        "outputs": [{"internalType": "string", "name": "caseTitle", "type": "string"}, {"internalType": "string", "name": "description", "type": "string"}, {"internalType": "string", "name": "incidentDate", "type": "string"}, {"internalType": "string", "name": "location", "type": "string"}, {"internalType": "string[]", "name": "suspects", "type": "string[]"}, {"internalType": "string[]", "name": "victims", "type": "string[]"}, {"internalType": "uint8", "name": "status", "type": "uint8"}, {"internalType": "string", "name": "leadInvestigatorName", "type": "string"}, {"internalType": "uint256", "name": "createdAt", "type": "uint256"}, {"internalType": "string[]", "name": "evidenceIds", "type": "string[]"}],
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
        "inputs": [{"internalType": "string", "name": "_targetId", "type": "string"}, {"internalType": "string", "name": "_targetType", "type": "string"}, {"internalType": "string", "name": "_commentText", "type": "string"}],
        "name": "addPublicComment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_targetId", "type": "string"}, {"internalType": "string", "name": "_targetType", "type": "string"}],
        "name": "getCommentsForTarget",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
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
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "publicComments",
        "outputs": [{"internalType": "uint256", "name": "commentId", "type": "uint256"}, {"internalType": "string", "name": "targetId", "type": "string"}, {"internalType": "string", "name": "targetType", "type": "string"}, {"internalType": "address", "name": "commenter", "type": "address"}, {"internalType": "string", "name": "commenterName", "type": "string"}, {"internalType": "string", "name": "commentText", "type": "string"}, {"internalType": "uint256", "name": "timestamp", "type": "uint256"}, {"internalType": "bool", "name": "exists", "type": "bool"}],
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
        await loadPublicCases();
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

    // Refresh buttons
    document.getElementById('refreshCases').addEventListener('click', loadPublicCases);
    document.getElementById('refreshEvidence').addEventListener('click', loadPublicEvidence);

    // Search functionality
    document.getElementById('searchCaseBtn').addEventListener('click', searchCase);
    document.getElementById('searchEvidenceBtn').addEventListener('click', searchEvidence);

    // Filters
    document.getElementById('caseFilter').addEventListener('input', filterCases);
    document.getElementById('evidenceFilter').addEventListener('input', filterEvidence);
    document.getElementById('evidenceCategory').addEventListener('change', filterEvidence);

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    // Comment buttons
    document.getElementById('addCaseComment').addEventListener('click', addCaseComment);
    document.getElementById('addEvidenceComment').addEventListener('click', addEvidenceComment);

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
    if (tabName === 'evidence') {
        loadPublicEvidence();
    }
}

async function loadStatistics() {
    try {
        const stats = await contract.methods.getPublicStatistics().call();
        document.getElementById('publicCasesCount').textContent = stats.publicCases;
        document.getElementById('publicEvidenceCount').textContent = stats.publicEvidence;
        document.getElementById('totalCommentsCount').textContent = stats.totalComments;
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

async function loadPublicCases() {
    try {
        const container = document.getElementById('casesContainer');
        container.innerHTML = '<div class="text-center p-8"><div class="loading mb-4"></div><p>Loading public cases...</p></div>';

        const caseNumbers = await contract.methods.getPublicReleasedCases().call();
        
        if (caseNumbers.length === 0) {
            container.innerHTML = '<div class="text-center p-8"><p>No public cases available yet.</p></div>';
            return;
        }

        container.innerHTML = '';
        
        for (const caseNumber of caseNumbers) {
            try {
                const caseDetails = await contract.methods.getPublicCaseDetails(caseNumber).call();
                const caseCard = createCaseCard(caseNumber, caseDetails);
                container.appendChild(caseCard);
            } catch (error) {
                console.error(`Failed to load case ${caseNumber}:`, error);
            }
        }
    } catch (error) {
        document.getElementById('casesContainer').innerHTML = '<div class="alert alert-error">Failed to load cases: ' + error.message + '</div>';
    }
}

async function loadPublicEvidence() {
    try {
        const container = document.getElementById('evidenceContainer');
        container.innerHTML = '<div class="text-center p-8"><div class="loading mb-4"></div><p>Loading public evidence...</p></div>';

        const evidenceIds = await contract.methods.getPublicReleasedEvidence().call();
        
        if (evidenceIds.length === 0) {
            container.innerHTML = '<div class="text-center p-8"><p>No public evidence available yet.</p></div>';
            return;
        }

        container.innerHTML = '';
        
        for (const evidenceId of evidenceIds) {
            try {
                const evidenceDetails = await contract.methods.getEvidence(evidenceId).call();
                const evidenceCard = createEvidenceCard(evidenceId, evidenceDetails);
                container.appendChild(evidenceCard);
            } catch (error) {
                console.error(`Failed to load evidence ${evidenceId}:`, error);
            }
        }
    } catch (error) {
        document.getElementById('evidenceContainer').innerHTML = '<div class="alert alert-error">Failed to load evidence: ' + error.message + '</div>';
    }
}

function createCaseCard(caseNumber, caseDetails) {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.onclick = () => showCaseDetails(caseNumber);
    
    const statusBadge = getStatusBadge(caseDetails.status);
    const date = new Date(caseDetails.createdAt * 1000).toLocaleDateString();
    
    card.innerHTML = `
        <div class="case-header">
            <div>
                <div class="case-number">${caseNumber}</div>
                <div class="case-meta">${date} • ${caseDetails.leadInvestigatorName}</div>
            </div>
            <div class="badge ${statusBadge.class}">${statusBadge.text}</div>
        </div>
        <h3 class="mb-2">${caseDetails.caseTitle}</h3>
        <p class="text-muted mb-2">${caseDetails.description.substring(0, 150)}${caseDetails.description.length > 150 ? '...' : ''}</p>
        <div class="case-meta">
            <span>📍 ${caseDetails.location}</span>
            <span>📁 ${caseDetails.evidenceIds.length} Evidence Items</span>
        </div>
    `;
    
    return card;
}

function createEvidenceCard(evidenceId, evidenceDetails) {
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
        </div>
    `;
    
    return card;
}

async function showCaseDetails(caseNumber) {
    try {
        currentCaseId = caseNumber;
        const caseDetails = await contract.methods.getPublicCaseDetails(caseNumber).call();
        
        const modal = document.getElementById('caseModal');
        const content = document.getElementById('modalCaseContent');
        
        document.getElementById('modalCaseTitle').textContent = caseDetails.caseTitle;
        
        const statusBadge = getStatusBadge(caseDetails.status);
        const date = new Date(caseDetails.createdAt * 1000).toLocaleDateString();
        
        content.innerHTML = `
            <div class="grid gap-4">
                <div>
                    <strong>Case Number:</strong> ${caseNumber}<br>
                    <strong>Status:</strong> <span class="badge ${statusBadge.class}">${statusBadge.text}</span><br>
                    <strong>Incident Date:</strong> ${caseDetails.incidentDate}<br>
                    <strong>Location:</strong> ${caseDetails.location}<br>
                    <strong>Lead Investigator:</strong> ${caseDetails.leadInvestigatorName}<br>
                    <strong>Created:</strong> ${date}
                </div>
                <div>
                    <strong>Description:</strong><br>
                    <p>${caseDetails.description}</p>
                </div>
                ${caseDetails.suspects.length > 0 ? `
                <div>
                    <strong>Suspects:</strong><br>
                    <ul class="list-disc pl-6">
                        ${caseDetails.suspects.map(suspect => `<li>${suspect}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                ${caseDetails.victims.length > 0 ? `
                <div>
                    <strong>Victims:</strong><br>
                    <ul class="list-disc pl-6">
                        ${caseDetails.victims.map(victim => `<li>${victim}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                <div>
                    <strong>Evidence Items (${caseDetails.evidenceIds.length}):</strong><br>
                    <div class="grid gap-2 mt-2">
                        ${caseDetails.evidenceIds.map(id => `
                            <button class="btn btn-sm btn-outline text-left" onclick="showEvidenceDetails('${id}')">${id}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        await loadComments(caseNumber, 'case');
        modal.classList.add('active');
    } catch (error) {
        showAlert('Failed to load case details: ' + error.message, 'error');
    }
}

async function showEvidenceDetails(evidenceId) {
    try {
        currentEvidenceId = evidenceId;
        const evidenceDetails = await contract.methods.getEvidence(evidenceId).call();
        
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
        
        await loadComments(evidenceId, 'evidence');
        modal.classList.add('active');
    } catch (error) {
        showAlert('Failed to load evidence details: ' + error.message, 'error');
    }
}

async function loadComments(targetId, targetType) {
    try {
        const commentIds = await contract.methods.getCommentsForTarget(targetId, targetType).call();
        const container = targetType === 'case' ? document.getElementById('caseComments') : document.getElementById('evidenceComments');
        
        if (commentIds.length === 0) {
            container.innerHTML = '<p class="text-muted">No comments yet. Be the first to comment!</p>';
            return;
        }
        
        container.innerHTML = '';
        
        for (const commentId of commentIds) {
            try {
                const comment = await contract.methods.publicComments(commentId).call();
                const commentElement = createCommentElement(comment);
                container.appendChild(commentElement);
            } catch (error) {
                console.error(`Failed to load comment ${commentId}:`, error);
            }
        }
    } catch (error) {
        console.error('Failed to load comments:', error);
    }
}

function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment';
    
    const date = new Date(comment.timestamp * 1000).toLocaleString();
    
    div.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${comment.commenterName}</span>
            <span class="comment-date">${date}</span>
        </div>
        <p>${comment.commentText}</p>
    `;
    
    return div;
}

async function addCaseComment() {
    const commentText = document.getElementById('newCaseComment').value.trim();
    if (!commentText) {
        showAlert('Please enter a comment', 'warning');
        return;
    }
    
    try {
        await contract.methods.addPublicComment(currentCaseId, 'case', commentText).send({ from: userAccount });
        document.getElementById('newCaseComment').value = '';
        await loadComments(currentCaseId, 'case');
        showAlert('Comment added successfully!', 'success');
    } catch (error) {
        showAlert('Failed to add comment: ' + error.message, 'error');
    }
}

async function addEvidenceComment() {
    const commentText = document.getElementById('newEvidenceComment').value.trim();
    if (!commentText) {
        showAlert('Please enter a comment', 'warning');
        return;
    }
    
    try {
        await contract.methods.addPublicComment(currentEvidenceId, 'evidence', commentText).send({ from: userAccount });
        document.getElementById('newEvidenceComment').value = '';
        await loadComments(currentEvidenceId, 'evidence');
        showAlert('Comment added successfully!', 'success');
    } catch (error) {
        showAlert('Failed to add comment: ' + error.message, 'error');
    }
}

async function searchCase() {
    const caseId = document.getElementById('searchCaseId').value.trim();
    if (!caseId) {
        showAlert('Please enter a case number', 'warning');
        return;
    }
    
    try {
        const caseDetails = await contract.methods.getPublicCaseDetails(caseId).call();
        showCaseDetails(caseId);
        document.getElementById('searchResults').innerHTML = '<div class="alert alert-success">Case found! Opening details...</div>';
    } catch (error) {
        document.getElementById('searchResults').innerHTML = '<div class="alert alert-error">Case not found or not public</div>';
    }
}

async function searchEvidence() {
    const evidenceId = document.getElementById('searchEvidenceId').value.trim();
    if (!evidenceId) {
        showAlert('Please enter an evidence ID', 'warning');
        return;
    }
    
    try {
        const evidenceDetails = await contract.methods.getEvidence(evidenceId).call();
        showEvidenceDetails(evidenceId);
        document.getElementById('searchResults').innerHTML = '<div class="alert alert-success">Evidence found! Opening details...</div>';
    } catch (error) {
        document.getElementById('searchResults').innerHTML = '<div class="alert alert-error">Evidence not found or not public</div>';
    }
}

function filterCases() {
    const filter = document.getElementById('caseFilter').value.toLowerCase();
    const cards = document.querySelectorAll('.case-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(filter) ? 'block' : 'none';
    });
}

function filterEvidence() {
    const filter = document.getElementById('evidenceFilter').value.toLowerCase();
    const category = document.getElementById('evidenceCategory').value;
    const cards = document.querySelectorAll('.evidence-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matchesFilter = text.includes(filter);
        const matchesCategory = !category || text.includes(category.toLowerCase());
        
        card.style.display = (matchesFilter && matchesCategory) ? 'block' : 'none';
    });
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

function getStatusBadge(status) {
    const statuses = {
        0: { text: 'Open', class: 'badge-info' },
        1: { text: 'Under Review', class: 'badge-warning' },
        2: { text: 'Closed', class: 'badge-success' },
        3: { text: 'Archived', class: 'badge-secondary' }
    };
    return statuses[status] || { text: 'Unknown', class: 'badge-secondary' };
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