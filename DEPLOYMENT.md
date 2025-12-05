# 🚀 Quick Deployment Guide

## 🎯 Instant Setup (2 minutes)

### 1. Install & Run
```bash
npm install -g http-server
cd public
http-server -p 8080 -o
```

### 2. Access Application
- Open: `http://localhost:8080`
- Connect MetaMask (demo mode works without blockchain)
- Register and explore!

## 🔧 Blockchain Deployment (Optional)

### Smart Contract
```bash
npm install -g truffle
truffle compile
truffle migrate --network sepolia
```

### Update Config
```javascript
// config.js
CONTRACT_ADDRESS: 'YOUR_DEPLOYED_ADDRESS'
DEMO_MODE: false
```

## 🌐 Live Deployment

### Vercel (Free)
```bash
npm install -g vercel
vercel --cwd public
```

### Netlify (Free)
- Drag & drop `public` folder to netlify.com
- Instant deployment!

## ✅ That's it!

Your modern blockchain evidence management system is ready!