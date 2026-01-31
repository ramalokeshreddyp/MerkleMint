# 🚀 NFT Launchpad - Get Started in 2 Minutes

## Option 1: Docker (Recommended - All-in-One)

```bash
# One command to start everything
docker-compose up --build
```

✅ Hardhat node runs on http://localhost:8545
✅ Frontend runs on http://localhost:3000
✅ Contract auto-deploys on startup

**That's it!** Open http://localhost:3000 in your browser.

---

## Option 2: Local Development (Terminal-by-Terminal)

### Terminal 1: Start Hardhat Node
```bash
npm run node
```
Waits for: `Started HTTP and WebSocket JSON-RPC server`

### Terminal 2: Deploy Contract
```bash
npm run deploy
```
Waits for: Contract address printed

### Terminal 3: Generate Merkle Tree
```bash
npm run generate-merkle
```
Waits for: Merkle root printed

### Terminal 4: Start Frontend
```bash
cd frontend && npm run dev
```
Waits for: `ready - started server on 0.0.0.0:3000`

**Done!** Open http://localhost:3000 in your browser.

---

## Setup (Do This First)

```bash
# Clone repo
git clone <repo-url>
cd nft-launchpad

# Install all dependencies
npm install
cd frontend && npm install && cd ..

# Copy environment template
cp .env.example .env.local
```

---

## First Time Setup with Docker

```bash
# Build images (5-10 minutes first time)
docker-compose build

# Start services
docker-compose up

# In another terminal, view logs
docker-compose logs -f
```

Access:
- Frontend: http://localhost:3000
- Check logs for contract address

---

## Configure MetaMask

1. Click MetaMask icon
2. Add Network:
   - Network Name: `Localhost`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency: `ETH`
3. Save

---

## First Mint

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Approve in MetaMask
4. Click "Mint 1 NFT"
5. Approve transaction
6. Wait for confirmation ✅

---

## Run Tests

```bash
npm run test
```

Expected: 50+ tests passing

---

## Check Project Status

```bash
node validate.js
```

Expected: ✅ All files found

---

## Stop Services

```bash
# Docker
docker-compose down

# Local (Ctrl+C in each terminal)
```

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `kill $(lsof -t -i:3000)` |
| Port 8545 in use | `kill $(lsof -t -i:8545)` |
| MetaMask won't connect | Add network manually (see above) |
| "Contract address missing" | Run `npm run deploy` again |
| Docker won't build | Run `docker-compose build --no-cache` |

---

## Useful Commands

```bash
npm run compile          # Compile contract
npm run deploy           # Deploy contract
npm run test             # Run tests
npm run generate-merkle  # Generate Merkle tree
npm run node             # Start Hardhat node

# Frontend
cd frontend && npm run dev    # Start dev server
cd frontend && npm run build  # Build for production

# Docker
docker-compose up --build     # Build and start
docker-compose down           # Stop services
docker-compose logs -f        # View logs
docker-compose ps             # Show running services
```

---

## Project Files Quick Guide

| File | Purpose |
|------|---------|
| `contracts/MyNFT.sol` | ERC-721 contract |
| `scripts/deploy.js` | Deploy contract |
| `scripts/generate-merkle.js` | Generate allowlist root |
| `test/MyNFT.test.js` | Tests |
| `frontend/pages/index.tsx` | Main page |
| `allowlist.json` | Whitelist addresses |
| `.env.example` | Environment template |
| `docker-compose.yml` | Docker config |

---

## Full Documentation

- **README.md** - Complete guide
- **DEPLOYMENT.md** - Deployment instructions
- **TESTING.md** - Testing procedures
- **QUICKSTART.md** - Quick reference
- **CHECKLIST.md** - Setup checklist
- **PROJECT_SUMMARY.md** - Project overview

---

## Next Steps

1. ✅ Get running (above)
2. Test minting functionality
3. Review smart contract code
4. Check test suite
5. Deploy to Sepolia testnet (see DEPLOYMENT.md)
6. Launch on mainnet

---

## Get Help

1. Check logs: `docker-compose logs -f`
2. Run validation: `node validate.js`
3. Review CHECKLIST.md
4. See TESTING.md for test procedures

---

**Ready? Start with Docker:**
```bash
docker-compose up --build
```

**Questions? Open http://localhost:3000 after startup**

🎉 Welcome to NFT Launchpad!
