# 🔐 EVID-DGC - Blockchain Evidence Management System

Modern blockchain-based evidence management system with 8 user roles and IPFS storage.

## ✨ Features

- 🔒 **Blockchain Security** - Immutable evidence storage
- 🌐 **IPFS Integration** - Decentralized file storage
- 👥 **8 User Roles** - Complete access control
- 📱 **Modern UI** - Black theme with 3D effects
- 💾 **Local Storage** - Persistent user sessions

## 🚀 Quick Start

1. **Install dependencies**
```bash
npm install
npm install -g http-server
```

2. **Start the application**
```bash
cd public
http-server -p 8080
```

3. **Open browser**
```
http://localhost:8080
```

## 👥 User Roles

1. 👁️ **Public Viewer** - View public cases/evidence
2. 🕵️ **Investigator** - Create and manage cases
3. 🔬 **Forensic Analyst** - Analyze evidence
4. ⚖️ **Legal Professional** - Legal review
5. 🏛️ **Court Official** - Court proceedings
6. 📋 **Evidence Manager** - Manage evidence lifecycle
7. 🔍 **Auditor** - System auditing
8. 👑 **Administrator** - Full system access

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Blockchain**: Ethereum/Polygon
- **Storage**: IPFS (Pinata)
- **Wallet**: MetaMask integration

## 📁 Project Structure

```
public/
├── index.html              # Main registration page
├── dashboard-*.html        # Role-specific dashboards
├── styles.css             # Modern black theme
├── app.js                 # Main application logic
├── config.js              # Configuration
└── dashboard-*.js         # Dashboard functionality
```

## 🎨 Design Features

- **Black gradient background** with animated particles
- **3D card effects** with perspective transforms
- **Neon color accents** (blue, purple, green)
- **Glass morphism** design elements
- **Responsive layout** for all devices

## 🔧 Configuration

Update `config.js` with your settings:
- Contract address (after deployment)
- Pinata API keys for IPFS
- Network configuration

## 📄 License

MIT License - Open source blockchain evidence management system.