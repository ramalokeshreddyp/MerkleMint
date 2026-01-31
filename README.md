# NFT Launchpad - Comprehensive Guide

A production-grade NFT launchpad built with Solidity, Hardhat, and Next.js. Features ERC-721 smart contracts with Merkle tree-based allowlist verification, gas-optimized minting, IPFS metadata integration, and a full-featured React DApp.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [Development](#development)
- [Smart Contract](#smart-contract)
- [Testing](#testing)
- [Deployment](#deployment)
- [Frontend DApp](#frontend-dapp)
- [Scripts](#scripts)
- [Security Considerations](#security-considerations)

## Overview

This project implements a comprehensive NFT collection launch system with:

1. **Smart Contract (MyNFT.sol)**: ERC-721 compliant NFT contract with ERC-2981 royalties
2. **Merkle Tree Allowlist**: Gas-efficient whitelisting using Merkle proofs
3. **Phased Minting**: Support for allowlist and public minting phases
4. **Reveal Mechanism**: Initial unrevealed URIs that can be updated after mint
5. **Frontend DApp**: Next.js application for seamless minting experience
6. **Docker Containerization**: Complete containerized setup for development and testing

## Features

### Smart Contract Features

- ✅ **ERC-721 Standard**: Full NFT implementation with transfer and approval mechanisms
- ✅ **ERC-2981 Royalties**: Built-in royalty support for secondary sales
- ✅ **Merkle Tree Verification**: Gas-efficient allowlist without on-chain storage of addresses
- ✅ **Phased Minting**: Three states - Paused, Allowlist, Public
- ✅ **Reveal Mechanism**: Support for unrevealed then revealed metadata
- ✅ **Owner Controls**: Configuration functions for price, URIs, and sale state
- ✅ **Safe Withdrawal**: Owner-only fund extraction
- ✅ **Per-Wallet Limits**: Mint cap per address to prevent abuse
- ✅ **Custom Errors**: Gas-optimized error handling

### Frontend Features

- ✅ **Wallet Connection**: MetaMask and Web3 wallet integration
- ✅ **Real-time Contract Data**: Display of mint count, supply, and sale status
- ✅ **Minting Interface**: Quantity selector and mint transaction handler
- ✅ **Merkle Proof Generation**: Automatic proof generation for allowlisted users
- ✅ **Transaction Status**: Real-time feedback for user actions
- ✅ **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Project Structure

```
nft-launchpad/
├── contracts/
│   └── MyNFT.sol              # Main ERC-721 contract
├── scripts/
│   ├── deploy.js              # Deployment script
│   └── generate-merkle.js     # Merkle tree generation
├── test/
│   └── MyNFT.test.js          # Comprehensive test suite
├── frontend/
│   ├── pages/
│   │   ├── _app.tsx           # Next.js app wrapper
│   │   ├── index.tsx          # Main page
│   │   └── _document.tsx      # Document template
│   ├── components/
│   │   ├── WalletButton.tsx   # Wallet connection component
│   │   ├── MintingComponent.tsx # Minting interface
│   │   └── StatsDisplay.tsx   # Statistics display
│   ├── context/
│   │   ├── WalletContext.tsx  # Wallet state management
│   │   └── ContractContext.tsx # Contract interaction
│   ├── public/
│   │   └── contracts/
│   │       └── MyNFT.json     # Contract ABI
│   ├── styles/
│   │   └── globals.css        # Global styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── next.config.js
│   ├── tsconfig.json
│   └── package.json
├── artifacts/                 # Compiled contracts (generated)
├── Dockerfile                 # Multi-stage build
├── docker-compose.yml         # Container orchestration
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Project dependencies
├── .env.example               # Environment variables template
├── allowlist.json             # Whitelist addresses
├── README.md                  # This file
└── .gitignore                 # Git ignore rules

```

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Docker**: v20 or higher (for containerized setup)
- **Docker Compose**: v1.29 or higher
- **MetaMask** or compatible Web3 wallet browser extension

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nft-launchpad
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# For testnet deployment
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_ID
PRIVATE_KEY=YOUR_TESTNET_PRIVATE_KEY

# IPFS configuration
PINATA_API_KEY=YOUR_PINATA_API_KEY
PINATA_SECRET_API_KEY=YOUR_PINATA_SECRET

# Frontend configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Set after deployment
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

## Docker Setup

### Build and Start Services

```bash
# Build images and start containers
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### What Happens

1. **Hardhat Node** starts on port `8545`
2. **Contract deploys** automatically to local network
3. **Frontend** starts on port `3000`
4. Contract address is saved to `.env.local`

### Verify Setup

- Hardhat Node: `http://localhost:8545` (should respond to JSON-RPC calls)
- Frontend: `http://localhost:3000`
- Open frontend in browser, connect MetaMask to `localhost:8545` (Chain ID: 31337)

## Development

### Local Development (Without Docker)

#### 1. Start Hardhat Node

```bash
npm run node
```

This starts a local blockchain on `http://localhost:8545` with 20 test accounts.

#### 2. Deploy Contract (in another terminal)

```bash
npm run deploy
```

This deploys the MyNFT contract and saves the ABI and address.

#### 3. Generate Merkle Tree

```bash
npm run generate-merkle
```

This reads `allowlist.json` and generates the Merkle root and proofs.

#### 4. Run Tests

```bash
npm run test
```

#### 5. Start Frontend (in another terminal)

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### Hot Reload

- **Backend**: Restart Hardhat for contract changes
- **Frontend**: Changes auto-reload via Next.js hot module replacement

## Smart Contract

### Contract Interface

#### Configuration Functions (Owner-Only)

```solidity
function setPrice(uint256 newPrice) external onlyOwner
function setBaseURI(string calldata newBaseURI) external onlyOwner
function setRevealedURI(string calldata newRevealedURI) external onlyOwner
function setMerkleRoot(bytes32 newMerkleRoot) external onlyOwner
function setSaleState(SaleState newState) external onlyOwner
function pause() external onlyOwner
function unpause(SaleState targetState) external onlyOwner
function reveal() external onlyOwner
function withdraw() external onlyOwner
```

#### Minting Functions

```solidity
function allowlistMint(bytes32[] calldata merkleProof, uint256 quantity) external payable
function publicMint(uint256 quantity) external payable
```

#### View Functions

```solidity
function tokenURI(uint256 tokenId) public view returns (string memory)
function totalMinted() public view returns (uint256)
function mintedPerWallet(address addr) public view returns (uint256)
function supportsInterface(bytes4 interfaceId) public view returns (bool)
```

### Deployment

The contract is automatically deployed via `scripts/deploy.js`:

```bash
npm run deploy
```

This script:
1. Compiles the contract
2. Deploys to the configured network
3. Saves the ABI to `frontend/public/contracts/MyNFT.json`
4. Saves the address to `.env.local`

### Key Constants

- **MAX_SUPPLY**: 10,000 NFTs
- **MAX_PER_WALLET**: 10 NFTs per address
- **ROYALTY_PERCENTAGE**: 5% (500 basis points)

## Testing

### Run Test Suite

```bash
npm run test
```

### Test Coverage

The test suite covers:

- ✅ Contract initialization and configuration
- ✅ Owner-only function access control
- ✅ Merkle proof verification
- ✅ Allowlist and public minting logic
- ✅ Per-wallet mint limits
- ✅ Sale state transitions
- ✅ Reveal mechanism
- ✅ Pause and unpause functionality
- ✅ Withdrawal function
- ✅ Interface support (ERC-721, ERC-2981)

### Example Test Output

```
MyNFT Contract
  Deployment
    ✓ Should set correct name and symbol
    ✓ Should have correct max supply
    ✓ Should set owner correctly
    ✓ Should support ERC721 interface
    ✓ Should support ERC2981 interface
  Owner Configuration
    ✓ Should allow owner to set price
    ✓ Should revert if non-owner sets price
    ...
```

## Frontend DApp

### Components

#### WalletButton
- Displays connect wallet button when disconnected
- Shows shortened address when connected
- Triggers MetaMask connection flow

#### MintingComponent
- Quantity selector (1-10)
- Mint button with validation
- Transaction status display
- Automatic Merkle proof generation for allowlist phase
- Sale state and supply information

#### StatsDisplay
- Real-time mint progress bar
- Total minted and remaining counts
- Current price display
- Collection statistics

### Context Providers

#### WalletContext
Manages:
- Connected account
- Connection state
- Connection/disconnection logic

#### ContractContext
Manages:
- Contract instance
- Real-time contract data
- Data refresh logic

### Usage Example

```tsx
import { useWallet } from '../context/WalletContext';
import { useContract } from '../context/ContractContext';

export function MyComponent() {
  const { account, connectWallet } = useWallet();
  const { contract, data, refreshData } = useContract();

  // Use these in your component
}
```

## Scripts

### deploy.js

Deploys the MyNFT contract to the configured network:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Output:**
- Contract deployment transaction
- Contract address
- ABI saved to `frontend/public/contracts/MyNFT.json`
- Address saved to `.env.local`

### generate-merkle.js

Generates Merkle tree from allowlist:

```bash
node scripts/generate-merkle.js
```

**Input:** `allowlist.json` - JSON array of Ethereum addresses

**Output:**
- `merkle-tree.json` - Tree data with root
- `merkle-proofs.json` - Individual proofs for each address
- Console output with root and statistics

### Example Allowlist

```json
[
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ea"
]
```

## Deployment to Testnet

### 1. Get Testnet ETH

Get Sepolia ETH from a faucet:
- https://sepoliafaucet.com
- https://faucets.chain.link

### 2. Configure Environment

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY_WITHOUT_0x
```

### 3. Deploy

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. Update Frontend

Copy the deployed address to `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`.

## Security Considerations

### Smart Contract Security

1. **Merkle Proof Verification**: Cryptographically secure allowlist without storage overhead
2. **Access Control**: Owner-only functions protected with `onlyOwner` modifier
3. **Reentrancy Protection**: Follow Checks-Effects-Interactions pattern
4. **Custom Errors**: Gas-efficient error handling without long strings
5. **Max Supply Enforcement**: Prevent minting beyond collection size
6. **Per-Wallet Limits**: Prevent single address from minting entire collection

### Best Practices Implemented

- ✅ **No floating-point math**: All calculations use `uint256`
- ✅ **Explicit state transitions**: Sale state changes are controlled
- ✅ **Safe withdrawal**: Direct transfer to owner address
- ✅ **Interface support**: Properly implements ERC-165
- ✅ **OpenZeppelin dependencies**: Audited library usage

### Frontend Security

- ✅ **Environment variables**: Secrets in `.env.local` not committed
- ✅ **RPC endpoints**: Use Infura or similar reliable providers
- ✅ **MetaMask integration**: Standard Web3 provider pattern

## Merkle Tree Implementation

### How It Works

1. **Addresses collected**: Stored in `allowlist.json`
2. **Tree generated**: Each address is hashed and organized into a binary tree
3. **Root calculated**: Single hash representing the entire list
4. **Root stored on-chain**: Only 32 bytes of data
5. **Proof provided at mint**: User supplies their position in the tree
6. **Verification**: Smart contract verifies proof against stored root

### Gas Savings

- **Traditional approach**: Store 10,000 addresses = ~32GB of storage
- **Merkle approach**: Store 1 root hash = 32 bytes
- **Verification cost**: O(log n) instead of O(n)

## Common Issues

### "Contract address not configured"
- Deploy the contract: `npm run deploy`
- Check `.env.local` has `NEXT_PUBLIC_CONTRACT_ADDRESS`

### "Not on allowlist"
- Ensure address is in `allowlist.json`
- Regenerate Merkle tree: `npm run generate-merkle`
- Ensure contract has correct Merkle root set

### MetaMask Connection Issues
- Ensure MetaMask is set to localhost network (Chain ID: 31337)
- Check Hardhat node is running on `http://localhost:8545`
- Restart MetaMask extension

### "Insufficient funds"
- Get test ETH from a faucet (for testnet)
- Ensure ETH amount equals `price * quantity`

## Performance Optimization

### Smart Contract

- **Custom Errors**: Save ~200 gas per error vs require strings
- **Merkle Verification**: O(log n) instead of O(n) for allowlist
- **Single URI root**: Store base URI instead of per-token metadata

### Frontend

- **Context API**: Minimal re-renders with selective updates
- **Lazy Loading**: Components load only when needed
- **Image Optimization**: Next.js Image component for media

## Roadmap

- [ ] IPFS integration for metadata
- [ ] Generative art script for images
- [ ] Raffle/lottery mint mechanism
- [ ] Dutch auction pricing
- [ ] Multi-tier allowlist (tiers with different pricing)
- [ ] Secondary marketplace integration
- [ ] Gas optimization audit

## Resources

- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [ERC-2981 Royalties](https://eips.ethereum.org/EIPS/eip-2981)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue or contact the development team.

---

**Built with ❤️ for the Web3 community**
