# NFT Launchpad - Setup & Testing Checklist

## Pre-Setup Requirements

- [ ] Node.js v18+ installed (`node -v`)
- [ ] npm v9+ installed (`npm -v`)
- [ ] Docker v20+ installed (`docker --version`)
- [ ] Docker Compose v1.29+ installed (`docker-compose --version`)
- [ ] Git installed (`git --version`)
- [ ] MetaMask browser extension installed
- [ ] Code editor (VSCode recommended)

## Installation Checklist

### Step 1: Clone Repository
- [ ] Repository cloned locally
- [ ] Current directory: `nft-launchpad/`

### Step 2: Root Setup
```bash
npm install
```
- [ ] Root dependencies installed
- [ ] `node_modules/` directory created
- [ ] `package-lock.json` generated

### Step 3: Frontend Setup
```bash
cd frontend
npm install
cd ..
```
- [ ] Frontend dependencies installed
- [ ] `frontend/node_modules/` created
- [ ] Ready for local development

## Project Structure Verification

Run validation:
```bash
node validate.js
```

**Expected Output:** ✅ All files found

### Key Directories
- [ ] `contracts/` - Contains MyNFT.sol
- [ ] `scripts/` - Contains deploy.js and generate-merkle.js
- [ ] `test/` - Contains MyNFT.test.js
- [ ] `frontend/` - Contains Next.js application
- [ ] `artifacts/` - Will contain compiled contracts

## Docker Setup Testing

### Build Services
```bash
docker-compose build
```
- [ ] Dockerfile builds without errors
- [ ] Both services build successfully
- [ ] No dependency conflicts

### Start Services
```bash
docker-compose up
```
- [ ] Hardhat node starts and listens on port 8545
- [ ] Health check passes
- [ ] Contract deploys successfully
- [ ] Frontend builds successfully
- [ ] Frontend starts on port 3000

**Watch for:**
```
hardhat-node | Account #0: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
hardhat-node | Started HTTP and WebSocket JSON-RPC server
frontend | ready - started server on 0.0.0.0:3000
```

### Verify Access
- [ ] Frontend accessible: http://localhost:3000
- [ ] Hardhat RPC accessible: http://localhost:8545
- [ ] No console errors in Docker logs

## Local Development Testing

### Terminal 1: Start Hardhat Node
```bash
npm run node
```
- [ ] Node starts successfully
- [ ] Listens on http://127.0.0.1:8545
- [ ] Shows 20 test accounts
- [ ] Shows network chain ID (31337)

### Terminal 2: Deploy Contract
```bash
npm run deploy
```
- [ ] Compilation successful
- [ ] Contract deployed
- [ ] Address logged (starts with 0x)
- [ ] ABI saved to frontend
- [ ] Address saved to .env.local

### Terminal 3: Generate Merkle Tree
```bash
npm run generate-merkle
```
- [ ] Reads allowlist.json successfully
- [ ] Outputs Merkle root (32 bytes)
- [ ] Generates merkle-tree.json
- [ ] Generates merkle-proofs.json

### Terminal 4: Start Frontend
```bash
cd frontend && npm run dev
```
- [ ] Build completes without errors
- [ ] Accessible at http://localhost:3000
- [ ] Shows "Next.js app running on port 3000"

## Frontend Testing

### Wallet Connection
1. [ ] Load http://localhost:3000
2. [ ] Click "Connect Wallet"
3. [ ] MetaMask popup appears
4. [ ] Ensure network is localhost:8545 (Chain ID: 31337)
5. [ ] Approve connection
6. [ ] Address displays on page
7. [ ] Button shows connected state

### Collection Information
1. [ ] View "Minted" count (should show 0)
2. [ ] View "Max Supply" (should show 10000)
3. [ ] View "Sale Status" (should show current state)
4. [ ] View "Price per NFT"

### Minting Interface
1. [ ] Quantity input appears
2. [ ] Default quantity is 1
3. [ ] Can change quantity 1-10
4. [ ] Mint button is visible
5. [ ] Button is disabled if wallet not connected

## Smart Contract Testing

### Run Test Suite
```bash
npm run test
```

**Expected Results:**
```
MyNFT Contract
  Deployment
    ✓ Should set correct name and symbol
    ✓ Should have correct max supply
    ...
  Owner Configuration
    ✓ Should allow owner to set price
    ...
  Allowlist Minting
    ✓ Should allow whitelisted address to mint
    ...
  Public Minting
    ✓ Should allow anyone to mint in public phase
    ...
  Reveal Mechanism
    ✓ Should return unrevealed URI before reveal
    ...
  Pause and Unpause
    ...
  Withdrawal
    ...

Passing: All tests should pass
```

All tests should pass (50+ tests).

## Configuration Files Verification

### .env.example
- [ ] File exists at project root
- [ ] Contains all required variables
- [ ] No real secrets (placeholder values only)
- [ ] Documented with comments

### hardhat.config.js
- [ ] Proper Solidity version (0.8.20)
- [ ] Networks configured (localhost, sepolia)
- [ ] Paths configured correctly
- [ ] Compiler optimizations enabled

### docker-compose.yml
- [ ] Both services defined
- [ ] Ports correctly exposed (8545, 3000)
- [ ] Health check configured
- [ ] depends_on conditions set

### Dockerfile
- [ ] Multi-stage build
- [ ] contracts stage compiles contract
- [ ] frontend stage builds Next.js
- [ ] Proper base images used

## Environment Variables Testing

### Create .env.local
```bash
cp .env.example .env.local
```

- [ ] File created at project root
- [ ] Contains required variables
- [ ] No real secrets included
- [ ] Can be safely ignored by git

### Test Contract Address
After deployment:
- [ ] `NEXT_PUBLIC_CONTRACT_ADDRESS` is set
- [ ] Starts with 0x
- [ ] 42 characters total (0x + 40 hex)
- [ ] Valid format

## Frontend Components Testing

### WalletButton Component
- [ ] Renders correctly
- [ ] Shows connect button when disconnected
- [ ] Shows address when connected
- [ ] Has data-test-id="connect-wallet-button"
- [ ] Has data-test-id="connected-address"

### MintingComponent Component
- [ ] Renders correctly
- [ ] Shows quantity input (data-test-id="quantity-input")
- [ ] Shows mint button (data-test-id="mint-button")
- [ ] Shows sale status (data-test-id="sale-status")
- [ ] Shows mint count (data-test-id="mint-count")
- [ ] Shows total supply (data-test-id="total-supply")
- [ ] Updates when connected

### StatsDisplay Component
- [ ] Shows progress bar
- [ ] Updates supply information
- [ ] Displays price
- [ ] Updates after transactions

## Contract Functionality Testing

### Set Price
```bash
# From Hardhat console or script
await contract.setPrice(ethers.parseEther("0.05"))
```
- [ ] Only owner can execute
- [ ] Updates price correctly
- [ ] Non-owner reverts

### Set Merkle Root
```bash
await contract.setMerkleRoot("0x...")
```
- [ ] Only owner can execute
- [ ] Updates root correctly

### Configure Sale State
```bash
// 0 = Paused, 1 = Allowlist, 2 = Public
await contract.setSaleState(1)
```
- [ ] Transitions between states work
- [ ] Enforces owner-only access

### Test Minting
1. Set sale state to Public (2)
2. Call publicMint with correct value
3. [ ] Transaction succeeds
4. [ ] NFT minted to caller
5. [ ] totalMinted increments

### Test Reveal
1. Mint an NFT
2. Get tokenURI before reveal
   - [ ] Shows unrevealed URI
3. Call reveal()
4. Get tokenURI after reveal
   - [ ] Shows revealed URI

## Documentation Review

- [ ] README.md exists and is comprehensive
- [ ] DEPLOYMENT.md covers all deployment scenarios
- [ ] QUICKSTART.md provides quick reference
- [ ] All code is commented
- [ ] Function parameters documented

## Final Checklist

- [ ] All files present and correct
- [ ] Docker setup working
- [ ] Local development working
- [ ] Frontend accessible
- [ ] Wallet connection functional
- [ ] Smart contract deployable
- [ ] Tests passing
- [ ] No console errors
- [ ] No warnings in logs
- [ ] Git repo initialized
- [ ] .gitignore configured

## Troubleshooting Summary

| Issue | Solution |
|-------|----------|
| Port in use | Kill process or use different port |
| Contract deploy fails | Check compilation: `npm run compile` |
| Frontend not connecting | Verify contract address set |
| MetaMask error | Add network 31337 to MetaMask |
| Tests fail | Check Hardhat node running |

## Next Steps After Verification

1. [ ] Customize project settings
2. [ ] Update allowlist.json with real addresses
3. [ ] Design NFT metadata
4. [ ] Create deployment strategy
5. [ ] Test on Sepolia testnet
6. [ ] Prepare for mainnet launch

## Notes

- Keep `.env.local` and `.env` out of version control
- Never commit real private keys
- Test thoroughly on local and testnet before mainnet
- Monitor gas prices for deployment
- Set up monitoring for production

## Support Resources

- Hardhat Docs: https://hardhat.org/docs
- OpenZeppelin: https://docs.openzeppelin.com
- Ethers.js: https://docs.ethers.org
- Solidity Docs: https://docs.soliditylang.org
- Next.js Docs: https://nextjs.org/docs

---

**Project Setup Verified! 🎉**

You're ready to deploy and launch your NFT collection!
