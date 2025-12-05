# 🔗 Blockchain-Based Evidence Management System

A decentralized evidence management system built on Ethereum blockchain with IPFS storage for secure, transparent, and immutable legal evidence handling.

## 🌟 Features

### 🔐 Role-Based Access Control (8 Roles)
- **Public Viewer**: View publicly released cases and evidence
- **Investigator**: Create cases, upload evidence, manage investigations
- **Forensic Analyst**: Upload forensic analysis and reports
- **Legal Professional**: View authorized cases, request evidence access
- **Court Official**: Approve access requests, release evidence to public
- **Evidence Manager**: Full evidence access, manage permissions
- **Auditor**: Read-only access to all data, view audit trails
- **Administrator**: Full system access and user management

### 🛡️ Security Features
- Blockchain-based immutable records
- IPFS distributed file storage
- SHA-256 file integrity verification
- Chain of custody tracking
- Access control and audit logging
- MetaMask wallet integration

### 📊 Core Functionality
- Case creation and management
- Evidence upload with IPFS storage
- Forensic analysis and verification
- Access request and approval workflow
- Public release mechanism for transparency
- Public commenting system
- Real-time statistics and monitoring
- Search and filter capabilities

## 🛠️ Technology Stack

- **Smart Contract**: Solidity ^0.8.0
- **Blockchain**: Ethereum (Polygon Mumbai Testnet)
- **Storage**: IPFS (Pinata for pinning)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Web3**: Web3.js v1.8.0
- **Wallet**: MetaMask integration
- **Development**: Truffle v5.8.0, Ganache for local testing

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ installed
- MetaMask browser extension
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-username/evidence-management-system.git
cd evidence-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Local Development
```bash
# Install Ganache CLI for local blockchain
npm install -g ganache-cli

# Start local blockchain
ganache-cli

# In another terminal, compile and deploy contracts
npm run compile
npm run migrate
```

### 4. Configure Frontend
1. Update `public/config.js` with your deployed contract address
2. Get free Pinata API keys from https://pinata.cloud
3. Add your Pinata API keys to `config.js`

### 5. Run Frontend
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🌐 Deployment

### Deploy to Mumbai Testnet

1. **Get Mumbai MATIC tokens**:
   - Visit https://faucet.polygon.technology/
   - Enter your wallet address
   - Get free testnet tokens

2. **Set up environment**:
   ```bash
   # Create .env file
   echo "MNEMONIC=your twelve word mnemonic phrase here" > .env
   ```

3. **Deploy contract**:
   ```bash
   npm run migrate:mumbai
   ```

4. **Deploy frontend to Vercel** (FREE):
   ```bash
   npm install -g vercel
   vercel
   ```

## 📁 Project Structure

```
evidence-management-system/
├── contracts/
│   ├── EvidenceManagementSystem.sol    # Main smart contract
│   └── Migrations.sol                  # Truffle migrations
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js           # Contract deployment
├── public/
│   ├── index.html                      # Landing page
│   ├── dashboard-public-viewer.html    # Public dashboard
│   ├── dashboard-investigator.html     # Investigator dashboard
│   ├── dashboard-forensic.html         # Forensic dashboard
│   ├── dashboard-legal.html            # Legal dashboard
│   ├── dashboard-court.html            # Court dashboard
│   ├── dashboard-manager.html          # Manager dashboard
│   ├── dashboard-auditor.html          # Auditor dashboard
│   ├── dashboard-admin.html            # Admin dashboard
│   ├── app.js                          # Main app logic
│   ├── dashboard-*.js                  # Dashboard scripts
│   ├── config.js                       # Configuration
│   └── styles.css                      # Styling
├── truffle-config.js                   # Truffle configuration
├── package.json                        # Dependencies
└── README.md                           # This file
```

## 🎯 User Roles & Permissions

### Public Viewer
- ✅ View publicly released cases and evidence
- ✅ Download public evidence files
- ✅ Add comments on public cases/evidence
- ❌ No credentials required

### Investigator
- ✅ Create cases
- ✅ Upload evidence to their cases
- ✅ View own cases and evidence
- ✅ Authorize viewers for their evidence
- 🔐 Requires: Badge number, Department, Jurisdiction

### Forensic Analyst
- ✅ Upload forensic analysis and reports
- ✅ Add forensic notes to evidence
- ✅ Verify evidence status
- ✅ View cases they're assigned to
- 🔐 Requires: Badge number, Department, Jurisdiction

### Legal Professional
- ✅ View cases they're authorized for
- ✅ Request access to specific evidence
- ❌ Cannot upload evidence
- 🔐 Requires: Badge number, Department, Jurisdiction

### Court Official
- ✅ View all public and restricted cases
- ✅ Approve access requests
- ✅ Release cases/evidence to public
- ✅ Update case and evidence status
- 🔐 Requires: Badge number, Department, Jurisdiction

### Evidence Manager
- ✅ Full access to all evidence
- ✅ Manage all access permissions
- ✅ Release evidence to public
- ✅ Archive evidence
- ✅ Authorize personnel to cases
- 🔐 Requires: Badge number, Department, Jurisdiction

### Auditor
- ✅ Read-only access to all data
- ✅ View audit trails and access logs
- ✅ Monitor all system activities
- ❌ Cannot modify any data
- 🔐 Requires: Badge number, Department, Jurisdiction

### Administrator
- ✅ Full system access
- ✅ Manage users and settings
- ✅ Perform all operations
- 🔐 Auto-created in contract constructor

## 🔧 Smart Contract Functions

### User Management
- `registerUser()` - Register with professional credentials
- `registerAsPublicViewer()` - Simplified public registration
- `getUserInfo()` - Get user details
- `updateLastLogin()` - Update login timestamp

### Case Management
- `createCase()` - Create new case
- `addSuspectToCase()` - Add suspect information
- `addVictimToCase()` - Add victim information
- `updateCaseStatus()` - Change case status
- `releaseCaseToPublic()` - Release case to public
- `authorizePersonnelToCase()` - Grant case access

### Evidence Management
- `submitEvidence()` - Upload evidence with IPFS hash
- `addForensicAnalysis()` - Add forensic notes
- `updateEvidenceStatus()` - Change evidence status
- `releaseEvidenceToPublic()` - Release evidence to public
- `getEvidence()` - Retrieve evidence details

### Access Control
- `requestAccess()` - Request evidence access
- `approveAccessRequest()` - Approve access request
- `grantDirectAccess()` - Grant direct access

### Public Features
- `getPublicReleasedCases()` - Get public cases
- `getPublicReleasedEvidence()` - Get public evidence
- `addPublicComment()` - Add public comment
- `getCommentsForTarget()` - Get comments for case/evidence

## 🔒 Security Considerations

### Smart Contract Security
- ✅ Reentrancy guards implemented
- ✅ Access control modifiers on all functions
- ✅ Input validation for all parameters
- ✅ Events emitted for all state changes
- ✅ No private data stored on-chain

### Frontend Security
- ✅ Input sanitization and validation
- ✅ XSS protection with textContent
- ✅ MetaMask connection verification
- ✅ Transaction error handling
- ✅ Clear error messages

### Privacy Protection
- ✅ IPFS hashes don't reveal content
- ✅ Access control enforced on-chain
- ✅ Audit logs for all access
- ✅ Public viewers only see released items
- ✅ No personal data in public fields

## 📊 IPFS Integration

### File Upload Process
1. User selects file
2. File is read as buffer
3. SHA-256 hash calculated
4. File uploaded to Pinata IPFS
5. IPFS hash (CID) returned
6. CID + file hash stored in smart contract
7. Success confirmation with download link

### File Retrieval
- Files accessed via Pinata gateway
- IPFS hash used for retrieval
- File integrity verified with SHA-256
- Download links generated dynamically

## 🧪 Testing

### Local Testing
```bash
# Start Ganache
ganache-cli

# Run tests
npm test

# Test frontend
npm run dev
```

### Testnet Testing
1. Deploy to Mumbai testnet
2. Test all user roles
3. Verify IPFS integration
4. Test access control
5. Verify audit logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@evidencemanagement.com
- 💬 Discord: [Join our community](https://discord.gg/evidencemanagement)
- 📖 Documentation: [Full docs](https://docs.evidencemanagement.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/evidence-management-system/issues)

## 🙏 Acknowledgments

- Ethereum Foundation for blockchain infrastructure
- IPFS/Pinata for decentralized storage
- MetaMask for wallet integration
- Truffle Suite for development tools
- OpenZeppelin for security standards

---

**⚖️ Legal Notice**: This system is designed for legitimate legal evidence management. Users must comply with all applicable laws and regulations. The developers are not responsible for misuse of this system.