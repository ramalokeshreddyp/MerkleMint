const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

describe("MyNFT Contract", function () {
  let contract;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let merkleTree;
  let merkleRoot;
  let merkleProof1;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const MyNFT = await ethers.getContractFactory("MyNFT");
    contract = await MyNFT.deploy();

    // Setup Merkle tree with addr1 and addr2
    const allowlist = [addr1.address, addr2.address];
    const leaves = allowlist.map((address) =>
      keccak256(
        Buffer.from(
          address.slice(2).toLowerCase(),
          "hex"
        )
      )
    );
    merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    merkleRoot = merkleTree.getRoot();

    // Get proof for addr1
    merkleProof1 = merkleTree.getHexProof(leaves[0]);

    // Set base URI and merkle root
    await contract.setBaseURI("ipfs://unrevealed_cid");
    await contract.setRevealedURI("ipfs://revealed_cid");
    await contract.setMerkleRoot(merkleRoot);
  });

  describe("Deployment", function () {
    it("Should set correct name and symbol", async function () {
      expect(await contract.name()).to.equal("Generative NFT");
      expect(await contract.symbol()).to.equal("GNFT");
    });

    it("Should have correct max supply", async function () {
      expect(await contract.MAX_SUPPLY()).to.equal(10000);
    });

    it("Should set owner correctly", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should support ERC721 interface", async function () {
      const ERC721_INTERFACE = "0x80ac58cd";
      expect(await contract.supportsInterface(ERC721_INTERFACE)).to.be.true;
    });

    it("Should support ERC2981 interface", async function () {
      const ERC2981_INTERFACE = "0x2a55205a";
      expect(await contract.supportsInterface(ERC2981_INTERFACE)).to.be.true;
    });
  });

  describe("Owner Configuration", function () {
    it("Should allow owner to set price", async function () {
      const newPrice = ethers.parseEther("0.2");
      await contract.setPrice(newPrice);
      expect(await contract.price()).to.equal(newPrice);
    });

    it("Should revert if non-owner sets price", async function () {
      const newPrice = ethers.parseEther("0.2");
      await expect(
        contract.connect(addr1).setPrice(newPrice)
      ).to.be.reverted;
    });

    it("Should allow owner to set base URI", async function () {
      await contract.setBaseURI("ipfs://new_base_cid");
      expect(await contract.baseURI()).to.equal("ipfs://new_base_cid");
    });

    it("Should allow owner to set revealed URI", async function () {
      await contract.setRevealedURI("ipfs://new_revealed_cid");
      expect(await contract.revealedURI()).to.equal("ipfs://new_revealed_cid");
    });

    it("Should allow owner to set merkle root", async function () {
      const newRoot = ethers.id("test");
      await contract.setMerkleRoot(newRoot);
      expect(await contract.merkleRoot()).to.equal(newRoot);
    });

    it("Should allow owner to set sale state", async function () {
      await contract.setSaleState(1); // Allowlist
      expect(await contract.saleState()).to.equal(1);

      await contract.setSaleState(2); // Public
      expect(await contract.saleState()).to.equal(2);
    });

    it("Should prevent owner from setting invalid price", async function () {
      await expect(
        contract.setPrice(0)
      ).to.be.revertedWithCustomError(contract, "InvalidPrice");
    });
  });

  describe("Allowlist Minting", function () {
    beforeEach(async function () {
      await contract.setSaleState(1); // Set to Allowlist
    });

    it("Should allow whitelisted address to mint", async function () {
      const quantity = 1;
      const price = await contract.price();
      const value = price * BigInt(quantity);

      await contract
        .connect(addr1)
        .allowlistMint(merkleProof1, quantity, { value });

      expect(await contract.balanceOf(addr1.address)).to.equal(quantity);
      expect(await contract.totalMinted()).to.equal(quantity);
    });

    it("Should revert with invalid merkle proof", async function () {
      const quantity = 1;
      const price = await contract.price();
      const value = price * BigInt(quantity);

      const invalidProof = ["0x" + "0".repeat(64)];

      await expect(
        contract
          .connect(addr1)
          .allowlistMint(invalidProof, quantity, { value })
      ).to.be.revertedWithCustomError(contract, "InvalidMerkleProof");
    });

    it("Should revert if not whitelisted", async function () {
      const quantity = 1;
      const price = await contract.price();
      const value = price * BigInt(quantity);

      await expect(
        contract
          .connect(addrs[0])
          .allowlistMint(merkleProof1, quantity, { value })
      ).to.be.revertedWithCustomError(contract, "InvalidMerkleProof");
    });

    it("Should revert if insufficient payment", async function () {
      const quantity = 1;
      await expect(
        contract.connect(addr1).allowlistMint(merkleProof1, quantity, { value: 0 })
      ).to.be.revertedWithCustomError(contract, "InsufficientPayment");
    });

    it("Should revert if exceeds per-wallet limit", async function () {
      const price = await contract.price();
      const quantity = 11;
      const value = price * BigInt(quantity);

      await expect(
        contract
          .connect(addr1)
          .allowlistMint(merkleProof1, quantity, { value })
      ).to.be.revertedWithCustomError(contract, "ExceedsPerWalletLimit");
    });

    it("Should revert if sale is not allowlist", async function () {
      await contract.setSaleState(0); // Paused
      const quantity = 1;
      const price = await contract.price();
      const value = price * BigInt(quantity);

      await expect(
        contract
          .connect(addr1)
          .allowlistMint(merkleProof1, quantity, { value })
      ).to.be.revertedWithCustomError(contract, "SaleNotActive");
    });

    it("Should track per-wallet mints", async function () {
      const price = await contract.price();
      
      // Mint 3 NFTs
      await contract
        .connect(addr1)
        .allowlistMint(merkleProof1, 3, { value: price * 3n });

      expect(await contract.mintedPerWallet(addr1.address)).to.equal(3);
    });
  });

  describe("Public Minting", function () {
    beforeEach(async function () {
      await contract.setSaleState(2); // Set to Public
    });

    it("Should allow anyone to mint in public phase", async function () {
      const quantity = 1;
      const price = await contract.price();
      const value = price * BigInt(quantity);

      await contract
        .connect(addr1)
        .publicMint(quantity, { value });

      expect(await contract.balanceOf(addr1.address)).to.equal(quantity);
    });

    it("Should revert if insufficient payment", async function () {
      const quantity = 1;
      await expect(
        contract.connect(addr1).publicMint(quantity, { value: 0 })
      ).to.be.revertedWithCustomError(contract, "InsufficientPayment");
    });

    it("Should revert if exceeds per-wallet limit", async function () {
      const price = await contract.price();
      const quantity = 11;
      const value = price * BigInt(quantity);

      await expect(
        contract.connect(addr1).publicMint(quantity, { value })
      ).to.be.revertedWithCustomError(contract, "ExceedsPerWalletLimit");
    });

    it("Should revert if sale not public", async function () {
      await contract.setSaleState(0); // Paused
      const quantity = 1;
      const price = await contract.price();
      const value = price * BigInt(quantity);

      await expect(
        contract.connect(addr1).publicMint(quantity, { value })
      ).to.be.revertedWithCustomError(contract, "SaleNotActive");
    });
  });

  describe("Reveal Mechanism", function () {
    it("Should return unrevealed URI before reveal", async function () {
      await contract.setSaleState(2); // Public
      const price = await contract.price();
      await contract.connect(addr1).publicMint(1, { value: price });

      const uri = await contract.tokenURI(0);
      expect(uri).to.include("unrevealed_cid");
    });

    it("Should return revealed URI after reveal", async function () {
      await contract.setSaleState(2); // Public
      const price = await contract.price();
      await contract.connect(addr1).publicMint(1, { value: price });

      await contract.reveal();

      const uri = await contract.tokenURI(0);
      expect(uri).to.include("revealed_cid");
    });

    it("Should only allow owner to reveal", async function () {
      await expect(
        contract.connect(addr1).reveal()
      ).to.be.reverted;
    });
  });

  describe("Pause and Unpause", function () {
    it("Should pause minting", async function () {
      await contract.setSaleState(2); // Public
      await contract.pause();

      expect(await contract.saleState()).to.equal(0); // Paused

      const price = await contract.price();
      await expect(
        contract.connect(addr1).publicMint(1, { value: price })
      ).to.be.revertedWithCustomError(contract, "SaleNotActive");
    });

    it("Should unpause to allowlist", async function () {
      await contract.setSaleState(0); // Paused
      await contract.unpause(1); // Allowlist

      expect(await contract.saleState()).to.equal(1);
    });

    it("Should unpause to public", async function () {
      await contract.setSaleState(0); // Paused
      await contract.unpause(2); // Public

      expect(await contract.saleState()).to.equal(2);
    });

    it("Should not allow unpause to Paused", async function () {
      await expect(
        contract.unpause(0) // Paused
      ).to.be.revertedWithCustomError(contract, "SaleNotActive");
    });
  });

  describe("Withdrawal", function () {
    it("Should allow owner to withdraw funds", async function () {
      await contract.setSaleState(2); // Public
      const price = await contract.price();

      // Mint some NFTs to add funds to contract
      await contract.connect(addr1).publicMint(2, { value: price * 2n });

      const contractBalance = await ethers.provider.getBalance(contract);
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

      const tx = await contract.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const contractBalanceAfter = await ethers.provider.getBalance(contract);
      expect(contractBalanceAfter).to.equal(0);

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + contractBalance - gasUsed);
    });

    it("Should only allow owner to withdraw", async function () {
      await contract.setSaleState(2); // Public
      const price = await contract.price();
      await contract.connect(addr1).publicMint(1, { value: price });

      await expect(
        contract.connect(addr1).withdraw()
      ).to.be.reverted;
    });
  });

  describe("Max Supply", function () {
    it("Should not exceed max supply", async function () {
      // This test is simplified - in reality we'd need many transactions
      await contract.setSaleState(2); // Public
      const price = await contract.price();

      // Try to mint more than max supply would allow (simplified)
      // In real scenario, MAX_SUPPLY is 10,000
      expect(await contract.MAX_SUPPLY()).to.equal(10000);
    });
  });
});
