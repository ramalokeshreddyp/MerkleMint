# NFT Launchpad - Testing Guide

This guide provides step-by-step instructions for testing all functionality of the NFT Launchpad.

## Setup for Testing

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

## Backend (Smart Contract) Testing

### Run Automated Tests

```bash
npm run test
```

This runs the comprehensive test suite covering:
- Contract deployment and initialization
- Owner configuration functions
- Allowlist minting with Merkle proofs
- Public minting
- Reveal mechanism
- Pause/unpause functionality
- Withdrawal function
- Interface support

**Expected:** 50+ tests passing

### Manual Testing via Hardhat Console

Start the Hardhat console:
```bash
npx hardhat console --network localhost
```

#### Test 1: Get Contract Instance

```javascript
const MyNFT = await ethers.getContractFactory("MyNFT");
const contract = await MyNFT.attach("0x..."); // Use address from deploy

// Get owner
const owner = await contract.owner();
console.log("Owner:", owner);

// Get total supply
const supply = await contract.totalMinted();
console.log("Minted:", supply);
```

#### Test 2: Set Configuration (Owner Only)

```javascript
// Set price to 0.05 ETH
await contract.setPrice(ethers.parseEther("0.05"));
console.log("Price:", await contract.price());

// Set base URI
await contract.setBaseURI("ipfs://placeholder_cid");
console.log("Base URI:", await contract.baseURI());

// Set revealed URI
await contract.setRevealedURI("ipfs://final_cid");
console.log("Revealed URI:", await contract.revealedURI());

// Set Merkle root (from generate-merkle.js output)
const merkleRoot = "0x..."; // Use generated root
await contract.setMerkleRoot(merkleRoot);
console.log("Merkle Root set");
```

#### Test 3: Set Sale State

```javascript
// Enable allowlist phase (1 = Allowlist)
await contract.setSaleState(1);
console.log("Sale state:", await contract.saleState()); // Should be 1

// Enable public phase (2 = Public)
await contract.setSaleState(2);
console.log("Sale state:", await contract.saleState()); // Should be 2

// Pause (0 = Paused)
await contract.setSaleState(0);
console.log("Sale state:", await contract.saleState()); // Should be 0
```

#### Test 4: Test Public Minting

```javascript
// Set to public phase
await contract.setSaleState(2);

// Get a test account
const [owner, addr1] = await ethers.getSigners();

// Mint 1 NFT
const price = await contract.price();
const tx = await contract.connect(addr1).publicMint(1, { value: price });
await tx.wait();

// Verify
const balance = await contract.balanceOf(addr1.address);
console.log("Balance:", balance); // Should be 1

const totalMinted = await contract.totalMinted();
console.log("Total Minted:", totalMinted); // Should be 1
```

#### Test 5: Test Reveal Mechanism

```javascript
// Get token URI before reveal
const uri1 = await contract.tokenURI(0);
console.log("Unrevealed URI:", uri1);

// Reveal
await contract.reveal();

// Get token URI after reveal
const uri2 = await contract.tokenURI(0);
console.log("Revealed URI:", uri2);

// Verify they're different
console.log("URIs different:", uri1 !== uri2); // Should be true
```

#### Test 6: Test Withdrawal

```javascript
// Check contract balance
const balance = await ethers.provider.getBalance(contract.target);
console.log("Contract balance:", ethers.formatEther(balance));

// Get owner balance before
const ownerBefore = await ethers.provider.getBalance(owner.address);

// Withdraw
const tx = await contract.withdraw();
const receipt = await tx.wait();

// Check balances after
const balanceAfter = await ethers.provider.getBalance(contract.target);
console.log("Contract balance after:", ethers.formatEther(balanceAfter)); // Should be 0

const ownerAfter = await ethers.provider.getBalance(owner.address);
console.log("Owner balance increased:", ownerAfter > ownerBefore); // Should be true
```

## Frontend (DApp) Testing

### Test 1: Wallet Connection

1. **Open Frontend**
   - Navigate to http://localhost:3000
   - Page should load with dark theme

2. **Connect Wallet**
   - Click "Connect Wallet" button
   - MetaMask popup appears
   - Ensure network is "localhost 31337"
   - Click "Connect"
   - Button changes to show connected address
   - Address shows in shortened format (e.g., "0x7099...79C8")

3. **Verify Elements**
   - [ ] Button has `data-test-id="connect-wallet-button"`
   - [ ] Address div has `data-test-id="connected-address"`
   - [ ] Address is not empty after connection

### Test 2: Contract Data Display

After connecting wallet:

1. **Check Displayed Data**
   - Mint count (data-test-id="mint-count"): Should show 0
   - Total supply (data-test-id="total-supply"): Should show 10000
   - Sale status (data-test-id="sale-status"): Should show "Public" or "Allowlist"

2. **Verify Data Updates**
   - Go to Hardhat console: `await contract.setSaleState(2)` (Public)
   - Refresh page or wait for refresh
   - Sale status should update to "Public"

### Test 3: Minting - Public Phase

1. **Prepare**
   - Set sale state to Public via Hardhat console:
     ```javascript
     await contract.setSaleState(2)
     ```

2. **Test Mint Button**
   - Quantity input (data-test-id="quantity-input") should show
   - Mint button (data-test-id="mint-button") should be clickable
   - Button text should show "Mint 1 NFT"

3. **Change Quantity**
   - Set quantity to 3
   - Button text updates to "Mint 3 NFTs"

4. **Execute Mint**
   - Click mint button
   - MetaMask transaction window appears
   - Review transaction details
   - Confirm transaction
   - Wait for confirmation
   - Status message shows "Mint successful!"
   - Mint count increments
   - Button status may show "Sold Out" if limit reached

### Test 4: Minting - Allowlist Phase

1. **Prepare Allowlist**
   - Check `allowlist.json` contains an address
   - Import that account into MetaMask (if not already connected)
   - Switch to that account in MetaMask

2. **Set Allowlist Phase**
   - Via Hardhat console:
     ```javascript
     const root = "0x..."; // From merkle-tree.json
     await contract.setMerkleRoot(root);
     await contract.setSaleState(1); // Allowlist
     ```

3. **Test Allowlist Mint**
   - Sale status should show "Allowlist"
   - Mint button should be clickable if address is on list
   - Click to mint
   - Should succeed if address in allowlist
   - Should fail with "Not on allowlist" if not

4. **Test Non-Whitelisted Address**
   - Switch to different MetaMask account
   - Try to mint
   - Should fail with appropriate error

### Test 5: Pause/Unpause

1. **Set to Paused**
   - Via Hardhat console:
     ```javascript
     await contract.setSaleState(0) // Paused
     ```

2. **Verify on Frontend**
   - Sale status shows "Paused"
   - Mint button should be disabled
   - Button text shows "Sale Paused"

3. **Unpause**
   - Via console: `await contract.setSaleState(2)` (Public)
   - Sale status updates to "Public"
   - Mint button becomes enabled

### Test 6: Per-Wallet Limits

1. **Attempt Over-Limit Mint**
   - Set quantity to 11
   - Click mint
   - Transaction should fail
   - Error message shows

2. **Verify Limit Tracking**
   - Mint 5 NFTs (in multiple transactions or batch)
   - Try to mint 6 more
   - Should fail (total would be 11 > 10)

### Test 7: Statistics Display

1. **Check Stats Component**
   - Progress bar visible
   - Shows percentage minted
   - Shows count of minted NFTs
   - Shows remaining supply

2. **Verify Updates**
   - Mint some NFTs
   - Stats update automatically
   - Progress bar increases
   - Counts change

### Test 8: Transaction Feedback

1. **Successful Transaction**
   - Status shows "Minting..."
   - After confirmation: "Mint successful!"
   - Message disappears after 3 seconds

2. **Failed Transaction**
   - Attempt invalid mint (e.g., non-allowlisted address)
   - Status shows error message
   - Message persists until cleared

## Integration Testing

### End-to-End Scenario 1: Complete Mint Cycle

1. Start fresh (clean allowlist)
2. Deploy contract
3. Set unrevealed URI
4. Set sale to Allowlist phase
5. Mint from allowlisted address
6. Verify NFT minted
7. Reveal (change revealed URI)
8. Verify tokenURI changed
9. Switch to public phase
10. Mint from non-whitelisted address
11. Verify mint succeeded
12. Withdraw funds
13. Verify contract balance = 0

### End-to-End Scenario 2: Error Handling

1. Pause minting
2. Try to mint from frontend
3. Verify error displays
4. Unpause
5. Try again
6. Verify success
7. Try to mint over limit
8. Verify error displays
9. Try non-whitelisted mint in Allowlist phase
10. Verify error displays

## Performance Testing

### Load Testing

1. **Multiple Mints**
   - Mint 10 NFTs from different accounts
   - Verify all transactions succeed
   - Check gas usage reasonable

2. **Rapid Clicks**
   - Click mint button multiple times rapidly
   - Verify only one transaction sent
   - No duplicate transactions

### Gas Monitoring

```javascript
// In Hardhat console
const tx = await contract.connect(addr1).publicMint(1, { value: price });
const receipt = await tx.wait();
console.log("Gas used:", receipt.gasUsed.toString());
console.log("Gas cost:", ethers.formatEther(receipt.gasUsed * receipt.gasPrice));
```

## Security Testing

### Test 1: Owner-Only Functions

```javascript
const [owner, attacker] = await ethers.getSigners();

// Try to set price as non-owner (should fail)
try {
  await contract.connect(attacker).setPrice(ethers.parseEther("1"));
  console.log("❌ SECURITY ISSUE: Non-owner can set price!");
} catch (error) {
  console.log("✓ Correctly prevented non-owner from setting price");
}

// Try to withdraw as non-owner (should fail)
try {
  await contract.connect(attacker).withdraw();
  console.log("❌ SECURITY ISSUE: Non-owner can withdraw!");
} catch (error) {
  console.log("✓ Correctly prevented non-owner from withdrawing");
}
```

### Test 2: Merkle Proof Validation

```javascript
// Generate correct proof
const correctProof = merkleTree.getHexProof(leaf);

// Try with invalid proof
const invalidProof = ["0x" + "0".repeat(64)];

try {
  await contract.connect(addr1).allowlistMint(invalidProof, 1, { value: price });
  console.log("❌ SECURITY ISSUE: Invalid proof accepted!");
} catch (error) {
  console.log("✓ Correctly rejected invalid proof");
}

// Try with correct proof
const tx = await contract.connect(addr1).allowlistMint(correctProof, 1, { value: price });
await tx.wait();
console.log("✓ Correct proof accepted");
```

### Test 3: Value Verification

```javascript
// Try to mint with insufficient payment
try {
  await contract.connect(addr1).publicMint(1, { value: "1" }); // Too low
  console.log("❌ SECURITY ISSUE: Insufficient payment accepted!");
} catch (error) {
  console.log("✓ Correctly rejected insufficient payment");
}
```

## Regression Testing

After making changes, verify:

1. [ ] All tests still pass: `npm run test`
2. [ ] Contract still deploys: `npm run deploy`
3. [ ] Frontend still loads: http://localhost:3000
4. [ ] Can connect wallet
5. [ ] Can mint NFTs
6. [ ] Reveal works
7. [ ] Withdrawal works

## Test Data

### Sample Merkle Test Case

Addresses:
```
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
0x1CBd3b2770909D4e10f157cABC84C7264073C9Ea
```

Generate tree:
```bash
npm run generate-merkle
```

Check `merkle-proofs.json` for proofs for each address.

## Performance Benchmarks

- Deployment gas: ~3,500,000
- Public mint gas: ~100,000-120,000
- Allowlist mint gas: ~110,000-130,000 (Merkle proof verification)
- Reveal gas: ~26,000

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Troubleshooting Test Issues

| Issue | Solution |
|-------|----------|
| "Contract not deployed" | Run `npm run deploy` again |
| "MetaMask not connecting" | Check network is localhost 31337 |
| "Transaction reverted" | Check contract state (paused, sold out) |
| "Address shows 0x0..." | Wait for connection confirmation |
| "Gas estimate error" | Ensure account has ETH (get from faucet) |

## Sign-Off

After all tests pass:

- [ ] Backend tests: ✓ Passing
- [ ] Frontend UI: ✓ Working
- [ ] Wallet integration: ✓ Connected
- [ ] Minting: ✓ Functional
- [ ] Reveal: ✓ Working
- [ ] Security: ✓ Verified
- [ ] Performance: ✓ Acceptable
- [ ] Documentation: ✓ Complete

**Project ready for deployment! 🚀**
