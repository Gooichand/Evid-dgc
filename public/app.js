// Global variables
let web3;
let contract;
let userAccount;

// Contract ABI (simplified for key functions)
const contractABI = [
    {
        "inputs": [{"internalType": "string", "name": "_fullName", "type": "string"}, {"internalType": "string", "name": "_badgeNumber", "type": "string"}, {"internalType": "string", "name": "_department", "type": "string"}, {"internalType": "string", "name": "_jurisdiction", "type": "string"}, {"internalType": "uint8", "name": "_role", "type": "uint8"}],
        "name": "registerUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_fullName", "type": "string"}],
        "name": "registerAsPublicViewer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
        "name": "getUserInfo",
        "outputs": [{"components": [{"internalType": "string", "name": "fullName", "type": "string"}, {"internalType": "string", "name": "badgeNumber", "type": "string"}, {"internalType": "string", "name": "department", "type": "string"}, {"internalType": "string", "name": "jurisdiction", "type": "string"}, {"internalType": "uint8", "name": "role", "type": "uint8"}, {"internalType": "bool", "name": "isActive", "type": "bool"}, {"internalType": "bool", "name": "isRegistered", "type": "bool"}, {"internalType": "uint256", "name": "registrationDate", "type": "uint256"}, {"internalType": "uint256", "name": "lastLogin", "type": "uint256"}], "internalType": "struct EvidenceManagementSystem.User", "name": "", "type": "tuple"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
        "name": "isUserRegistered",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "updateLastLogin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Role mappings
const roleNames = {
    0: 'None',
    1: 'Public Viewer',
    2: 'Investigator', 
    3: 'Forensic Analyst',
    4: 'Legal Professional',
    5: 'Court Official',
    6: 'Evidence Manager',
    7: 'Auditor',
    8: 'Administrator'
};

const roleDashboards = {
    1: 'dashboard-public-viewer.html',
    2: 'dashboard-investigator.html',
    3: 'dashboard-forensic.html',
    4: 'dashboard-legal.html',
    5: 'dashboard-court.html',
    6: 'dashboard-manager.html',
    7: 'dashboard-auditor.html',
    8: 'dashboard-admin.html'
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
        showAlert('MetaMask is required to use this application. Please install MetaMask and refresh the page.', 'error');
        return;
    }

    // Set up event listeners
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('userRole').addEventListener('change', handleRoleChange);
    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);
    document.getElementById('goToDashboard').addEventListener('click', goToDashboard);

    // Check if already connected
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
        await connectWallet();
    }
}

async function connectWallet() {
    try {
        showLoading(true);
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];

        // Initialize Web3
        web3 = new Web3(window.ethereum);
        
        // Check network
        const networkId = await web3.eth.net.getId();
        if (networkId !== config.NETWORK_ID) {
            throw new Error(`Please switch to ${config.NETWORK_NAME}`);
        }

        // Initialize contract
        contract = new web3.eth.Contract(contractABI, config.CONTRACT_ADDRESS);

        // Update UI
        document.getElementById('walletAddress').textContent = userAccount;
        document.getElementById('walletStatus').classList.remove('hidden');
        document.getElementById('connectWallet').textContent = 'Connected';
        document.getElementById('connectWallet').disabled = true;

        // Check if user is registered
        await checkRegistrationStatus();

        showLoading(false);
    } catch (error) {
        showLoading(false);
        showAlert('Failed to connect wallet: ' + error.message, 'error');
    }
}

async function checkRegistrationStatus() {
    try {
        const isRegistered = await contract.methods.isUserRegistered(userAccount).call();
        
        if (isRegistered) {
            // User is registered, get their info
            const userInfo = await contract.methods.getUserInfo(userAccount).call();
            
            // Update last login
            await contract.methods.updateLastLogin().send({ from: userAccount });
            
            // Show user info
            document.getElementById('userName').textContent = userInfo.fullName;
            document.getElementById('userRoleName').textContent = roleNames[userInfo.role];
            document.getElementById('userRoleName').className = `badge badge-${getRoleClass(userInfo.role)}`;
            document.getElementById('userDepartment').textContent = userInfo.department;
            
            // Show already registered section
            document.getElementById('walletSection').classList.add('hidden');
            document.getElementById('alreadyRegisteredSection').classList.remove('hidden');
        } else {
            // User needs to register
            document.getElementById('walletSection').classList.add('hidden');
            document.getElementById('registrationSection').classList.remove('hidden');
        }
    } catch (error) {
        showAlert('Failed to check registration status: ' + error.message, 'error');
    }
}

function handleRoleChange() {
    const role = document.getElementById('userRole').value;
    const professionalFields = document.getElementById('professionalFields');
    
    if (role === '1') { // Public Viewer
        professionalFields.classList.add('hidden');
        // Clear required attributes
        document.getElementById('badgeNumber').required = false;
        document.getElementById('department').required = false;
        document.getElementById('jurisdiction').required = false;
    } else {
        professionalFields.classList.remove('hidden');
        // Add required attributes
        document.getElementById('badgeNumber').required = true;
        document.getElementById('department').required = true;
        document.getElementById('jurisdiction').required = true;
    }
}

async function handleRegistration(event) {
    event.preventDefault();
    
    try {
        showLoading(true);
        
        const fullName = document.getElementById('fullName').value;
        const role = parseInt(document.getElementById('userRole').value);
        
        if (role === 1) {
            // Register as public viewer
            await contract.methods.registerAsPublicViewer(fullName).send({ from: userAccount });
        } else {
            // Register with professional credentials
            const badgeNumber = document.getElementById('badgeNumber').value;
            const department = document.getElementById('department').value;
            const jurisdiction = document.getElementById('jurisdiction').value;
            
            await contract.methods.registerUser(
                fullName,
                badgeNumber,
                department,
                jurisdiction,
                role
            ).send({ from: userAccount });
        }
        
        showLoading(false);
        showAlert('Registration successful! Redirecting to dashboard...', 'success');
        
        // Redirect to appropriate dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = roleDashboards[role];
        }, 2000);
        
    } catch (error) {
        showLoading(false);
        showAlert('Registration failed: ' + error.message, 'error');
    }
}

async function goToDashboard() {
    try {
        const userInfo = await contract.methods.getUserInfo(userAccount).call();
        const role = userInfo.role;
        window.location.href = roleDashboards[role];
    } catch (error) {
        showAlert('Failed to redirect to dashboard: ' + error.message, 'error');
    }
}

function getRoleClass(role) {
    const roleClasses = {
        1: 'public',
        2: 'investigator',
        3: 'forensic',
        4: 'legal',
        5: 'court',
        6: 'manager',
        7: 'auditor',
        8: 'admin'
    };
    return roleClasses[role] || 'public';
}

function showLoading(show) {
    const modal = document.getElementById('loadingModal');
    if (show) {
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
    }
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = message;
    
    // Insert at top of container
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Handle account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            // User disconnected
            location.reload();
        } else {
            // User switched accounts
            location.reload();
        }
    });

    window.ethereum.on('chainChanged', function (chainId) {
        // User switched networks
        location.reload();
    });
}