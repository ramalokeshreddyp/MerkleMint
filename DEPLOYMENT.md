# NFT Launchpad - Deployment Guide

This guide covers deployment of the NFT Launchpad to various networks.

## Table of Contents

1. [Local Development](#local-development)
2. [Sepolia Testnet](#sepolia-testnet)
3. [Production Deployment](#production-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Troubleshooting](#troubleshooting)

## Local Development

### Prerequisites

```bash
npm install
cd frontend && npm install && cd ..
```

### Start Local Node and Frontend

```bash
# Terminal 1: Start Hardhat node
npm run node

# Terminal 2: Deploy contract
npm run deploy

# Terminal 3: Generate Merkle tree
npm run generate-merkle

# Terminal 4: Start frontend
cd frontend && npm run dev
```

### Access Points

- Frontend: http://localhost:3000
- Hardhat Node RPC: http://localhost:8545

### Test Accounts

The Hardhat node provides 20 test accounts. Import them into MetaMask:

```
Account #0: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #1: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103e1b3c9d1b22c6a47b5d596b51b2ad3f8d43a6f

Account #2: 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ea (10000 ETH)
Private Key: 0x701b615bbdfb9de65240bc28bd21bbc0d996645a3c898d4e5f98bcee5e775472
...
```

(Full list available in Hardhat node startup logs)

## Sepolia Testnet

### Step 1: Get Sepolia ETH

Visit one of these faucets:
- https://sepoliafaucet.com (recommended)
- https://faucet.quicknode.com/ethereum/sepolia
- https://www.infura.io/faucet/sepolia

### Step 2: Configure Environment

Create or update `.env.local`:

```env
# Infura RPC URL for Sepolia
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Your Sepolia testnet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# IPFS Configuration (optional, for metadata)
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_API_KEY=your_pinata_secret

# Will be set after deployment
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

### Step 3: Get Infura API Key

1. Go to https://infura.io
2. Sign up for free
3. Create a new project
4. Copy your Project ID
5. Add to `.env.local` as shown above

### Step 4: Deploy Contract

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

**Output:**
```
Deploying MyNFT contract...
MyNFT deployed to: 0x1234567890123456789012345678901234567890
Contract ABI saved to frontend/public/contracts/MyNFT.json
Contract address saved to .env.local
```

### Step 5: Update Frontend

The contract address is automatically saved to `.env.local`. Verify it's set:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

### Step 6: Interact with Contract

You can now test the contract on Sepolia:

```bash
# View contract on Etherscan
https://sepolia.etherscan.io/address/0x1234567890123456789012345678901234567890
```

### Step 7: Run Frontend on Testnet

Update frontend `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
NEXT_PUBLIC_CHAIN_ID=11155111
```

Then start:

```bash
cd frontend
npm run dev
```

## Production Deployment

### Mainnet Deployment

For Ethereum mainnet, follow the Sepolia steps but:

1. Use mainnet RPC URL: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`
2. Use a mainnet wallet with real ETH for gas
3. Verify contract on Etherscan
4. Update frontend environment accordingly

### Security Checklist

Before mainnet deployment:

- [ ] Contract audited or reviewed
- [ ] Whitelist finalized and Merkle root calculated
- [ ] Price and supply verified
- [ ] Royalty percentage correct
- [ ] Owner address is a multisig wallet (recommended)
- [ ] Withdrawal tested on testnet
- [ ] Frontend tested with real accounts
- [ ] IPFS metadata uploaded and verified
- [ ] Rate limiting implemented (optional)
- [ ] Monitoring and alerting set up

### Network Parameters

```javascript
// Common network configurations
const networks = {
  mainnet: {
    chainId: 1,
    rpc: "https://mainnet.infura.io/v3/PROJECT_ID",
    explorer: "https://etherscan.io"
  },
  sepolia: {
    chainId: 11155111,
    rpc: "https://sepolia.infura.io/v3/PROJECT_ID",
    explorer: "https://sepolia.etherscan.io"
  },
  polygon: {
    chainId: 137,
    rpc: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com"
  },
  arbitrum: {
    chainId: 42161,
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io"
  }
}
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Setup for Docker

Create `.env` in project root (for docker-compose):

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... (will be set by deploy script)
NEXT_PUBLIC_RPC_URL=http://hardhat-node:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

### Docker Compose Services

1. **hardhat-node**: Local blockchain on port 8545
   - Automatically deploys contract on startup
   - Provides test accounts with ETH
   - Health check ensures readiness

2. **frontend**: Next.js application on port 3000
   - Depends on hardhat-node being healthy
   - Automatically connects to contract
   - Hot reload enabled for development

### Build Custom Docker Image

```bash
# Build specific service
docker build -t nft-launchpad-contracts:latest -f Dockerfile --target contracts .

# Build frontend image
docker build -t nft-launchpad-frontend:latest -f Dockerfile --target frontend .
```

### Deploy Existing Container to Production

```bash
# Tag image
docker tag nft-launchpad-frontend:latest myregistry/nft-launchpad-frontend:v1.0.0

# Push to registry
docker push myregistry/nft-launchpad-frontend:v1.0.0

# Deploy with docker-compose on production server
docker-compose -f docker-compose.prod.yml up -d
```

## IPFS Metadata Deployment

### Upload Metadata to IPFS

1. **Prepare metadata files** (one JSON file per token):

```json
{
  "name": "Generative NFT #1",
  "description": "A unique generative collectible",
  "image": "ipfs://QmXxxx.../1.png",
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Eyes", "value": "Laser" }
  ]
}
```

2. **Upload to Pinata** (or similar IPFS service):

```bash
# Using Pinata API
curl -X POST https://api.pinata.cloud/pinning/pinFileToIPFS \
  -H "pinata_api_key: YOUR_API_KEY" \
  -H "pinata_secret_api_key: YOUR_SECRET_KEY" \
  -F "file=@metadata_folder"
```

3. **Get IPFS CID** and set as baseURI:

```bash
# Set unrevealed URI
npx hardhat run scripts/setBaseURI.js --network sepolia

# Later, set revealed URI after reveal
npx hardhat run scripts/setRevealedURI.js --network sepolia
```

## Verification on Etherscan

### Verify Contract Source Code

1. Go to your contract on Etherscan (e.g., https://sepolia.etherscan.io/address/0x...)
2. Click "Contract" tab
3. Click "Verify and Publish"
4. Choose "Solidity (Single file)" or "Multi-file JSON"
5. Select compiler version matching `hardhat.config.js`
6. Paste contract code or upload JSON
7. Submit

This allows users to view and interact with your contract directly on Etherscan.

## Monitoring and Alerting

### Track Deployment

```bash
# Get contract details
npx hardhat run scripts/getContractInfo.js --network sepolia

# Monitor transactions
etherscan.io/address/0xYOUR_CONTRACT_ADDRESS
```

### Set Up Alerts

- Monitor mint transactions
- Track contract balance
- Alert on unusual activity
- Set up wallet notifications

## Rollback Procedures

If issues occur:

1. **Pause minting**: `setSaleState(0)` - Paused
2. **Stop accepting transactions**: Disable frontend
3. **Emergency withdrawal**: `withdraw()` to recover funds
4. **Deploy new contract**: If critical bug found

## Common Deployment Issues

### Issue: "Failed to connect to RPC endpoint"

**Solution**: Verify RPC URL is correct and service is operational

```bash
# Test RPC connection
curl -X POST https://sepolia.infura.io/v3/YOUR_PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

### Issue: "Insufficient funds"

**Solution**: Ensure deployment account has enough ETH

```bash
# Check account balance
npx hardhat run scripts/checkBalance.js --network sepolia
```

### Issue: "Gas limit exceeded"

**Solution**: Increase gas limit in hardhat.config.js

```javascript
networks: {
  sepolia: {
    gasPrice: "auto",
    gas: 8000000,
  }
}
```

## Post-Deployment Checklist

- [ ] Contract deployed successfully
- [ ] Contract verified on block explorer
- [ ] Frontend connected to contract
- [ ] Wallet connection tested
- [ ] Mint transaction successful
- [ ] Reveal mechanism tested
- [ ] Withdrawal function tested
- [ ] Social media/announcements updated
- [ ] Community notified of launch
- [ ] Monitoring set up

## Next Steps

1. Launch your NFT collection
2. Promote to community
3. Monitor transactions
4. Engage with minters
5. Plan secondary marketplace integration
6. Consider future features

## Support

For deployment issues:
1. Check logs: `docker-compose logs -f hardhat-node`
2. Verify configuration: Check `.env` and `.env.local`
3. Test on testnet first
4. Consult Hardhat docs: https://hardhat.org
5. Open GitHub issue with details

---

**Successfully deployed! 🎉**
