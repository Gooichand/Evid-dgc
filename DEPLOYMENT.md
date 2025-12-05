# 🚀 Deployment Guide - Evid-DGC

This guide will help you deploy and run Evid-DGC - the Blockchain-Based Evidence Management System.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js v16+** - [Download here](https://nodejs.org/)
- **MetaMask Browser Extension** - [Install here](https://metamask.io/)
- **Git** - [Download here](https://git-scm.com/)

## 🛠️ Quick Setup (5 minutes)

### Step 1: Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd evidence-management-system

# Install dependencies
npm install
```

### Step 2: Install Truffle and Ganache
```bash
# Install Truffle globally
npm install -g truffle

# Install Ganache CLI for local blockchain
npm install -g ganache-cli
```

### Step 3: Start Local Blockchain
```bash
# Start Ganache (keep this terminal open)
ganache-cli
```

### Step 4: Deploy Smart Contract
```bash
# In a new terminal, compile and deploy
truffle compile
truffle migrate --network development
```

### Step 5: Get Pinata API Keys (FREE)
1. Go to [Pinata.cloud](https://pinata.cloud)
2. Sign up for a free account
3. Go to API Keys section
4. Create new API key
5. Copy the API Key and Secret Key

### Step 6: Configure Frontend
1. Open `public/config.js`
2. Update with your values:
```javascript
var config = {
    CONTRACT_ADDRESS: 'YOUR_DEPLOYED_CONTRACT_ADDRESS', // From step 4
    PINATA_API_KEY: 'YOUR_PINATA_API_KEY',
    PINATA_SECRET_KEY: 'YOUR_PINATA_SECRET_KEY',
    IPFS_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
    NETWORK_ID: 5777, // Ganache default
    NETWORK_NAME: 'Ganache Local'
};
```

### Step 7: Run Frontend
```bash
# Install http-server globally
npm install -g http-server

# Start the frontend
cd public
http-server -p 3000
```

### Step 8: Access Application
1. Open browser to `http://localhost:3000`
2. Connect MetaMask to Ganache (localhost:8545)
3. Import Ganache accounts into MetaMask
4. Register as different user roles and test!

## 🌐 Deploy to Mumbai Testnet (FREE)

### Step 1: Get Mumbai MATIC Tokens
1. Go to [Polygon Faucet](https://faucet.polygon.technology/)
2. Enter your MetaMask wallet address
3. Get free testnet MATIC tokens

### Step 2: Configure MetaMask for Mumbai
- **Network Name**: Polygon Mumbai Testnet
- **RPC URL**: https://rpc-mumbai.maticvigil.com/
- **Chain ID**: 80001
- **Currency Symbol**: MATIC
- **Block Explorer**: https://mumbai.polygonscan.com/

### Step 3: Set Environment Variables
```bash
# Create .env file in project root
echo "MNEMONIC=your twelve word mnemonic phrase here" > .env
```

### Step 4: Deploy to Mumbai
```bash
truffle migrate --network mumbai
```

### Step 5: Update Config
Update `public/config.js` with Mumbai settings:
```javascript
var config = {
    CONTRACT_ADDRESS: 'YOUR_MUMBAI_CONTRACT_ADDRESS',
    PINATA_API_KEY: 'YOUR_PINATA_API_KEY',
    PINATA_SECRET_KEY: 'YOUR_PINATA_SECRET_KEY',
    IPFS_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
    NETWORK_ID: 80001,
    NETWORK_NAME: 'Polygon Mumbai Testnet'
};
```

## 🌍 Deploy Frontend to Vercel (FREE)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
# From project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? evidence-management-system
# - Directory? ./public
```

### Step 3: Access Your Live App
Vercel will provide a live URL like: `https://evidence-management-system.vercel.app`

## 🧪 Testing Different User Roles

### 1. Administrator (Auto-created)
- Use the deployer wallet address
- Full system access

### 2. Public Viewer
- Register with any wallet
- Choose "Public Viewer" role
- No credentials needed

### 3. Professional Roles
- Register with different wallets
- Choose role (Investigator, Forensic, Legal, Court, Manager, Auditor)
- Provide badge number, department, jurisdiction

### Test Workflow:
1. **Investigator**: Create case → Upload evidence
2. **Forensic Analyst**: Add analysis to evidence
3. **Court Official**: Release case/evidence to public
4. **Public Viewer**: View released items and comment
5. **Auditor**: Monitor all activities

## 🔧 Troubleshooting

### Common Issues:

**MetaMask Connection Failed**
- Ensure MetaMask is installed and unlocked
- Check network settings match your deployment

**Contract Not Found**
- Verify CONTRACT_ADDRESS in config.js
- Ensure contract is deployed to correct network

**IPFS Upload Failed**
- Check Pinata API keys are correct
- Verify internet connection
- Ensure file size is under 50MB

**Transaction Failed**
- Check you have enough MATIC/ETH for gas
- Verify you're on the correct network
- Try increasing gas limit

### Reset Local Environment:
```bash
# Stop Ganache (Ctrl+C)
# Restart Ganache
ganache-cli

# Redeploy contracts
truffle migrate --reset

# Update config.js with new contract address
```

## 📊 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Blockchain    │    │   IPFS Storage  │
│   (HTML/JS)     │◄──►│   (Ethereum)    │◄──►│   (Pinata)      │
│                 │    │                 │    │                 │
│ • 9 Dashboards  │    │ • Smart Contract│    │ • File Storage  │
│ • Role-based UI │    │ • Access Control│    │ • Hash Verification│
│ • MetaMask      │    │ • Event Logs    │    │ • Public Gateway│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔒 Security Checklist

- [ ] Smart contract deployed and verified
- [ ] Pinata API keys secured (not in public repos)
- [ ] MetaMask seed phrase backed up securely
- [ ] Test all user roles and permissions
- [ ] Verify IPFS file uploads and downloads
- [ ] Check access control enforcement
- [ ] Test public release workflow
- [ ] Verify audit logging works

## 📈 Next Steps

1. **Customize**: Modify roles, permissions, or UI as needed
2. **Scale**: Deploy to Ethereum mainnet for production
3. **Integrate**: Connect with existing legal systems
4. **Monitor**: Set up monitoring and alerting
5. **Backup**: Implement regular backup procedures

## 🆘 Support

If you encounter issues:

1. Check the [README.md](README.md) for detailed documentation
2. Review the troubleshooting section above
3. Check contract events on block explorer
4. Verify network connectivity and gas fees

## 🎉 Success!

Once deployed, you'll have a fully functional blockchain-based evidence management system with:

- ✅ 8 different user roles with appropriate permissions
- ✅ Secure evidence upload to IPFS
- ✅ Immutable blockchain records
- ✅ Public transparency features
- ✅ Complete audit trail
- ✅ Professional-grade UI

**Congratulations on deploying your Evidence Management System!** 🎊