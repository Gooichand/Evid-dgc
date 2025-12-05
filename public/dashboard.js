// Modern Public Viewer Dashboard
let web3, contract, userAccount;

const contractABI = [
    {
        "inputs": [],
        "name": "getPublicCases",
        "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPublicEvidence", 
        "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
        "stateMutability": "view",
        "type": "function"
    }
];

document.addEventListener('DOMContentLoaded', async function() {
    await initializeDashboard();
    loadDashboardData();
});

async function initializeDashboard() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            
            if (userAccount) {
                document.getElementById('userWallet').textContent = 
                    userAccount.substring(0, 6) + '...' + userAccount.substring(38);
            }
            
            if (config.CONTRACT_ADDRESS && !config.DEMO_MODE) {
                contract = new web3.eth.Contract(contractABI, config.CONTRACT_ADDRESS);
            }
        }
    } catch (error) {
        console.log('Demo mode active');
    }
}

async function loadDashboardData() {
    // Demo data
    const demoData = {
        publicCases: ['CASE-2024-001', 'CASE-2024-002', 'CASE-2024-003'],
        publicEvidence: ['EVID-001', 'EVID-002', 'EVID-003', 'EVID-004'],
        comments: 12
    };
    
    document.getElementById('publicCasesCount').textContent = demoData.publicCases.length;
    document.getElementById('publicEvidenceCount').textContent = demoData.publicEvidence.length;
    document.getElementById('totalCommentsCount').textContent = demoData.comments;
    
    loadCases(demoData.publicCases);
    loadEvidence(demoData.publicEvidence);
}

function loadCases(cases) {
    const container = document.getElementById('casesContainer');
    container.innerHTML = '';
    
    cases.forEach(caseId => {
        const caseCard = createCaseCard(caseId);
        container.appendChild(caseCard);
    });
}

function loadEvidence(evidence) {
    const container = document.getElementById('evidenceContainer');
    container.innerHTML = '';
    
    evidence.forEach(evidId => {
        const evidCard = createEvidenceCard(evidId);
        container.appendChild(evidCard);
    });
}

function createCaseCard(caseId) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h3>📁 ${caseId}</h3>
        <p><strong>Status:</strong> <span class="badge badge-success">Public</span></p>
        <p><strong>Released:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Type:</strong> Criminal Investigation</p>
        <button class="btn btn-primary" onclick="viewCase('${caseId}')">
            👁️ View Details
        </button>
    `;
    return card;
}

function createEvidenceCard(evidId) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h3>🔍 ${evidId}</h3>
        <p><strong>Type:</strong> Digital Evidence</p>
        <p><strong>Size:</strong> 2.4 MB</p>
        <p><strong>Hash:</strong> 0x${Math.random().toString(16).substr(2, 8)}...</p>
        <button class="btn btn-primary" onclick="viewEvidence('${evidId}')">
            👁️ View Details
        </button>
    `;
    return card;
}

function viewCase(caseId) {
    const modal = document.getElementById('caseModal');
    document.getElementById('modalCaseTitle').textContent = `Case: ${caseId}`;
    document.getElementById('modalCaseContent').innerHTML = `
        <div class="case-details">
            <p><strong>📋 Case Number:</strong> ${caseId}</p>
            <p><strong>📅 Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>🏛️ Status:</strong> <span class="badge badge-success">Closed - Public</span></p>
            <p><strong>📍 Location:</strong> Downtown District</p>
            <p><strong>👮 Lead Investigator:</strong> Detective Smith</p>
            <p><strong>📝 Description:</strong> Public case released for transparency</p>
        </div>
    `;
    modal.classList.add('active');
}

function viewEvidence(evidId) {
    const modal = document.getElementById('evidenceModal');
    document.getElementById('modalEvidenceTitle').textContent = `Evidence: ${evidId}`;
    document.getElementById('modalEvidenceContent').innerHTML = `
        <div class="evidence-details">
            <p><strong>🔍 Evidence ID:</strong> ${evidId}</p>
            <p><strong>📁 Type:</strong> Digital Document</p>
            <p><strong>📊 Size:</strong> 2.4 MB</p>
            <p><strong>🔗 IPFS Hash:</strong> Qm${Math.random().toString(36).substr(2, 9)}</p>
            <p><strong>📅 Submitted:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>✅ Status:</strong> <span class="badge badge-success">Verified</span></p>
            <button class="btn btn-success">📥 Download from IPFS</button>
        </div>
    `;
    modal.classList.add('active');
}