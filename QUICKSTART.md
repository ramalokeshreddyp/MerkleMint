# NFT Launchpad - Quick Reference

## Quick Start Commands

### Docker (Recommended)
```bash
# One command to start everything
docker-compose up --build

# Access at http://localhost:3000
```

### Local Development
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

### Testing
```bash
npm run test
```

## Environment Variables

### `.env.local` (Root)
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_ID
PRIVATE_KEY=your_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

## Key Files

| File | Purpose |
|------|---------|
| `contracts/MyNFT.sol` | ERC-721 smart contract |
| `scripts/deploy.js` | Contract deployment |
| `scripts/generate-merkle.js` | Merkle tree generation |
| `allowlist.json` | Whitelist addresses |
| `test/MyNFT.test.js` | Test suite |
| `frontend/pages/index.tsx` | Main DApp page |
| `Dockerfile` | Multi-stage build |
| `docker-compose.yml` | Service orchestration |
| `README.md` | Full documentation |

## Contract Functions

### Minting
- `allowlistMint(bytes32[] proof, uint256 qty)` - Allowlist mint
- `publicMint(uint256 qty)` - Public mint

### Owner Functions
- `setPrice(uint256)` - Update price
- `setMerkleRoot(bytes32)` - Set whitelist root
- `setSaleState(SaleState)` - Change sale phase
- `reveal()` - Reveal final metadata
- `pause()` / `unpause()` - Pause/resume sales
- `withdraw()` - Withdraw funds

## Frontend Components

- **WalletButton**: Wallet connection
- **MintingComponent**: Minting interface  
- **StatsDisplay**: Collection statistics

## Common Tasks

### Deploy to Testnet
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Generate New Merkle Root
```bash
# Update allowlist.json first
node scripts/generate-merkle.js
```

### Set Contract Price
```bash
npx hardhat run -c "
  const contract = await ethers.getContractAt('MyNFT', ADDRESS);
  await contract.setPrice(ethers.parseEther('0.05'));
"
```

### Start Public Minting
```bash
# 2 = Public state
npx hardhat run -c "
  const contract = await ethers.getContractAt('MyNFT', ADDRESS);
  await contract.setSaleState(2);
"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| Port 8545 in use | `lsof -i :8545` then `kill -9 <PID>` |
| MetaMask not connecting | Ensure localhost:8545 in MetaMask settings |
| Contract address missing | Run `npm run deploy` again |
| Merkle proof fails | Update `allowlist.json` and regenerate |

## Network Details

### Local Hardhat
- Chain ID: 31337
- RPC: http://localhost:8545
- Gas: Unlimited (free)

### Sepolia Testnet
- Chain ID: 11155111
- RPC: https://sepolia.infura.io/v3/YOUR_ID
- Faucet: https://sepoliafaucet.com

## Contract Constants

- Max Supply: 10,000 NFTs
- Max Per Wallet: 10 NFTs
- Royalty: 5%

## Test Accounts (Hardhat)

```
Account #0: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Account #1: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Account #2: 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ea
```

All come with 10,000 test ETH.

## Useful Links

- Hardhat Docs: https://hardhat.org
- OpenZeppelin: https://docs.openzeppelin.com/contracts
- Ethers.js: https://docs.ethers.org/v6/
- ERC-721 Spec: https://eips.ethereum.org/EIPS/eip-721
- Merkle Trees: https://en.wikipedia.org/wiki/Merkle_tree

## Support

- Check logs: `docker-compose logs -f`
- Run tests: `npm run test`
- Review README.md for detailed info
- Check DEPLOYMENT.md for deployment help
