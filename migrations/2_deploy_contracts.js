const EvidenceManagementSystem = artifacts.require("EvidenceManagementSystem");
const fs = require('fs');
const path = require('path');

module.exports = function (deployer) {
  deployer.deploy(EvidenceManagementSystem).then(() => {
    // Update config.js with deployed contract address
    const configPath = path.join(__dirname, '../public/config.js');
    const contractAddress = EvidenceManagementSystem.address;
    
    const configContent = `var config = {
    CONTRACT_ADDRESS: '${contractAddress}',
    PINATA_API_KEY: 'YOUR_PINATA_API_KEY',
    PINATA_SECRET_KEY: 'YOUR_PINATA_SECRET_KEY',
    IPFS_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
    NETWORK_ID: 80001,
    NETWORK_NAME: 'Polygon Mumbai Testnet'
};`;
    
    fs.writeFileSync(configPath, configContent);
    console.log(`Contract deployed at: ${contractAddress}`);
    console.log(`Config updated at: ${configPath}`);
  });
};