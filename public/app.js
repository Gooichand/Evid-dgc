// Modern Evidence Management System
let web3, userAccount;

const roleNames = {
    0: 'None', 1: 'Public Viewer', 2: 'Investigator', 3: 'Forensic Analyst',
    4: 'Legal Professional', 5: 'Court Official', 6: 'Evidence Manager',
    7: 'Auditor', 8: 'Administrator'
};

const roleDashboards = {
    1: 'dashboard-public-viewer.html', 2: 'dashboard-public-viewer.html',
    3: 'dashboard-public-viewer.html', 4: 'dashboard-public-viewer.html',
    5: 'dashboard-public-viewer.html', 6: 'dashboard-public-viewer.html',
    7: 'dashboard-public-viewer.html', 8: 'dashboard-public-viewer.html'
};

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);
    document.getElementById('goToDashboard').addEventListener('click', goToDashboard);

    const accounts = await window.ethereum?.request({ method: 'eth_accounts' }) || [];
    if (accounts.length > 0) {
        await connectWallet();
    }
}

async function connectWallet() {
    try {
        showLoading(true);
        
        if (config.DEMO_MODE) {
            userAccount = '0x1234567890123456789012345678901234567890';
            document.getElementById('walletAddress').textContent = userAccount;
            document.getElementById('walletStatus').classList.remove('hidden');
            document.getElementById('connectWallet').textContent = 'Connected (Demo)';
            document.getElementById('connectWallet').disabled = true;
            await checkRegistrationStatus();
            showLoading(false);
            return;
        }
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        web3 = new Web3(window.ethereum);

        document.getElementById('walletAddress').textContent = userAccount;
        document.getElementById('walletStatus').classList.remove('hidden');
        document.getElementById('connectWallet').textContent = 'Connected';
        document.getElementById('connectWallet').disabled = true;

        await checkRegistrationStatus();
        showLoading(false);
    } catch (error) {
        showLoading(false);
        showAlert('Failed to connect wallet: ' + error.message, 'error');
    }
}

async function checkRegistrationStatus() {
    try {
        const savedUser = localStorage.getItem('evidUser_' + userAccount);
        
        if (savedUser) {
            const userInfo = JSON.parse(savedUser);
            document.getElementById('userName').textContent = userInfo.fullName;
            document.getElementById('userRoleName').textContent = roleNames[userInfo.role];
            document.getElementById('userRoleName').className = `badge badge-${getRoleClass(userInfo.role)}`;
            document.getElementById('userDepartment').textContent = userInfo.department || 'Public';
            
            document.getElementById('walletSection').classList.add('hidden');
            document.getElementById('alreadyRegisteredSection').classList.remove('hidden');
            return;
        }
        
        document.getElementById('walletSection').classList.add('hidden');
        document.getElementById('registrationSection').classList.remove('hidden');
    } catch (error) {
        document.getElementById('walletSection').classList.add('hidden');
        document.getElementById('registrationSection').classList.remove('hidden');
    }
}

async function handleRegistration(event) {
    event.preventDefault();
    
    try {
        showLoading(true);
        
        const fullName = document.getElementById('fullName').value;
        const role = parseInt(document.getElementById('userRole').value);
        
        const userData = {
            fullName: fullName,
            role: role,
            department: role === 1 ? 'Public' : document.getElementById('department').value,
            badgeNumber: role === 1 ? '' : document.getElementById('badgeNumber').value,
            jurisdiction: role === 1 ? 'Public' : document.getElementById('jurisdiction').value,
            registrationDate: Date.now(),
            isRegistered: true,
            isActive: true
        };
        
        localStorage.setItem('evidUser_' + userAccount, JSON.stringify(userData));
        
        showLoading(false);
        showAlert('Registration successful! Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            window.location.href = roleDashboards[role];
        }, 2000);
        
    } catch (error) {
        showLoading(false);
        showAlert('Registration failed: ' + error.message, 'error');
    }
}

async function goToDashboard() {
    const savedUser = localStorage.getItem('evidUser_' + userAccount);
    if (savedUser) {
        const userInfo = JSON.parse(savedUser);
        window.location.href = roleDashboards[userInfo.role];
    }
}

function getRoleClass(role) {
    const roleClasses = {
        1: 'public', 2: 'investigator', 3: 'forensic', 4: 'legal',
        5: 'court', 6: 'manager', 7: 'auditor', 8: 'admin'
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

if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        location.reload();
    });
    window.ethereum.on('chainChanged', function (chainId) {
        location.reload();
    });
}