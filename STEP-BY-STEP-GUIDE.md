# 🚀 Complete Step-by-Step Setup Guide for Evid-DGC

Follow these exact steps to get Evid-DGC running on your system.

## 📋 STEP 1: Install Prerequisites

### 1.1 Install Node.js
1. Go to https://nodejs.org/
2. Download LTS version (v18 or higher)
3. Run installer and follow prompts
4. Open terminal/command prompt
5. Verify: `node --version` (should show v18+)

### 1.2 Install MetaMask
1. Go to https://metamask.io/
2. Click "Download" → "Install MetaMask for Chrome"
3. Add to browser and create wallet
4. **IMPORTANT**: Save your seed phrase securely!

### 1.3 Install Git (if not installed)
1. Go to https://git-scm.com/
2. Download and install
3. Verify: `git --version`

## 📁 STEP 2: Setup Project

### 2.1 Navigate to Project
```bash
cd "d:\projects and intership\Evid-block chain\evidence-management-system"
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Install Global Tools
```bash
npm install -g truffle ganache-cli http-server
```

## 🔗 STEP 3: Setup Local Blockchain

### 3.1 Start Ganache (Terminal 1)
```bash
ganache-cli
```
**Keep this terminal open!** Note the accounts and private keys shown.

### 3.2 Import Account to MetaMask
1. Open MetaMask
2. Click account icon → Import Account
3. Paste private key from Ganache (first account)
4. Name it "Ganache Admin"

### 3.3 Add Ganache Network to MetaMask
1. MetaMask → Networks → Add Network
2. **Network Name**: Ganache Local
3. **RPC URL**: http://127.0.0.1:8545
4. **Chain ID**: 1337
5. **Currency**: ETH
6. Save

## 📄 STEP 4: Deploy Smart Contract

### 4.1 Compile Contract (Terminal 2)
```bash
truffle compile
```

### 4.2 Deploy Contract
```bash
truffle migrate --network development
```

### 4.3 Note Contract Address
Copy the contract address from output (looks like: `0x1234...abcd`)

## 🌐 STEP 5: Setup IPFS (Pinata)

### 5.1 Create Pinata Account
1. Go to https://pinata.cloud/
2. Sign up (FREE account)
3. Verify email

### 5.2 Get API Keys
1. Login to Pinata
2. Go to "API Keys" section
3. Click "New Key"
4. Enable "pinFileToIPFS" permission
5. Name it "Evid-DGC"
6. Copy API Key and Secret Key

## ⚙️ STEP 6: Configure Frontend

### 6.1 Update Config File
1. Open `public/config.js`
2. Replace with your values:
```javascript
var config = {
    CONTRACT_ADDRESS: 'YOUR_CONTRACT_ADDRESS_FROM_STEP_4',
    PINATA_API_KEY: 'YOUR_PINATA_API_KEY',
    PINATA_SECRET_KEY: 'YOUR_PINATA_SECRET_KEY',
    IPFS_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
    NETWORK_ID: 1337,
    NETWORK_NAME: 'Ganache Local'
};
```

## 🚀 STEP 7: Start Frontend

### 7.1 Start Web Server (Terminal 3)
```bash
cd public
http-server -p 3000
```

### 7.2 Access Application
1. Open browser to http://localhost:3000
2. Connect MetaMask (should auto-detect Ganache network)

## 🧪 STEP 8: Test the System

### 8.1 Register as Administrator
1. Click "Connect MetaMask"
2. You're automatically admin (deployer account)
3. Click "Go to Dashboard"

### 8.2 Create Test Accounts
1. In MetaMask, create 4 new accounts:
   - Account 2: "Investigator"
   - Account 3: "Forensic Analyst" 
   - Account 4: "Court Official"
   - Account 5: "Public Viewer"

2. Send ETH to each account:
   - Switch to Ganache Admin account
   - Send 1 ETH to each new account

### 8.3 Register Different Roles
For each account:
1. Switch MetaMask account
2. Go to http://localhost:3000
3. Register with appropriate role:
   - **Investigator**: Badge "INV001", Dept "Police", Jurisdiction "City"
   - **Forensic**: Badge "FOR001", Dept "Crime Lab", Jurisdiction "State"
   - **Court**: Badge "CRT001", Dept "District Court", Jurisdiction "Federal"
   - **Public**: Just name, no credentials needed

### 8.4 Test Complete Workflow
1. **Investigator**: Create case "CASE-2024-001"
2. **Investigator**: Upload evidence file
3. **Forensic**: Add analysis to evidence
4. **Court**: Release case to public
5. **Public**: View and comment on released case

## 🌐 STEP 9: Deploy to Mumbai Testnet (Optional)

### 9.1 Get Mumbai MATIC
1. Go to https://faucet.polygon.technology/
2. Select Mumbai network
3. Enter your MetaMask address
4. Get free MATIC tokens

### 9.2 Add Mumbai to MetaMask
1. Networks → Add Network
2. **Network Name**: Polygon Mumbai
3. **RPC URL**: https://rpc-mumbai.maticvigil.com/
4. **Chain ID**: 80001
5. **Currency**: MATIC
6. **Explorer**: https://mumbai.polygonscan.com/

### 9.3 Create Environment File
```bash
echo "MNEMONIC=your twelve word seed phrase here" > .env
```

### 9.4 Deploy to Mumbai
```bash
truffle migrate --network mumbai
```

### 9.5 Update Config for Mumbai
```javascript
var config = {
    CONTRACT_ADDRESS: 'NEW_MUMBAI_CONTRACT_ADDRESS',
    PINATA_API_KEY: 'YOUR_PINATA_API_KEY',
    PINATA_SECRET_KEY: 'YOUR_PINATA_SECRET_KEY',
    IPFS_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
    NETWORK_ID: 80001,
    NETWORK_NAME: 'Polygon Mumbai'
};
```

## 🌍 STEP 10: Deploy to Vercel (Optional)

### 10.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 10.2 Deploy
```bash
vercel
```
Follow prompts:
- Project name: `evid-dgc`
- Directory: `./public`

## ✅ STEP 11: Verification Checklist

- [ ] Ganache running with accounts
- [ ] MetaMask connected to Ganache
- [ ] Smart contract deployed
- [ ] Pinata API keys working
- [ ] Frontend accessible at localhost:3000
- [ ] Can register different user roles
- [ ] Can create cases and upload evidence
- [ ] Can release items to public
- [ ] Public viewers can see released items

## 🔧 Common Issues & Solutions

### Issue: "Contract not found"
**Solution**: Check CONTRACT_ADDRESS in config.js matches deployed address

### Issue: "MetaMask connection failed"
**Solution**: Ensure MetaMask is on correct network (Ganache Local)

### Issue: "IPFS upload failed"
**Solution**: Verify Pinata API keys are correct in config.js

### Issue: "Transaction failed"
**Solution**: Ensure account has enough ETH for gas fees

### Issue: "Access denied"
**Solution**: Make sure user is registered with correct role

## 🎉 Success!

You now have Evid-DGC running with:
- ✅ 8 user roles with different permissions
- ✅ Case and evidence management
- ✅ IPFS file storage
- ✅ Blockchain verification
- ✅ Public transparency features
- ✅ Complete audit trail

**Your Evid-DGC system is ready for use!** 🚀