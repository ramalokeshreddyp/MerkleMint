const fs = require("fs");
const path = require("path");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

// Read allowlist from file
const allowlistPath = path.join(__dirname, "../allowlist.json");

if (!fs.existsSync(allowlistPath)) {
  console.error("allowlist.json not found. Creating sample file...");
  const sampleAllowlist = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ea",
  ];
  fs.writeFileSync(allowlistPath, JSON.stringify(sampleAllowlist, null, 2));
  console.log("Sample allowlist.json created with example addresses.");
}

const allowlist = JSON.parse(fs.readFileSync(allowlistPath, "utf8"));

if (!Array.isArray(allowlist) || allowlist.length === 0) {
  console.error("Invalid allowlist. Please provide an array of addresses.");
  process.exit(1);
}

// Create Merkle tree
const leaves = allowlist.map((address) =>
  keccak256(
    Buffer.from(
      address.slice(2).toLowerCase(),
      "hex"
    )
  )
);

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getRoot().toString("hex");

console.log("\n=== Merkle Tree Generated ===");
console.log("Merkle Root: 0x" + root);
console.log("Total addresses:", allowlist.length);

// Save tree data for frontend use
const treeData = {
  root: "0x" + root,
  allowlist: allowlist,
  tree: tree.toString(),
};

const treeDataPath = path.join(__dirname, "../merkle-tree.json");
fs.writeFileSync(treeDataPath, JSON.stringify(treeData, null, 2));
console.log("\nMerkle tree data saved to merkle-tree.json");

// Generate proofs for each address
const proofs = {};
allowlist.forEach((address, index) => {
  const proof = tree.getHexProof(leaves[index]);
  proofs[address.toLowerCase()] = proof;
});

const proofsPath = path.join(__dirname, "../merkle-proofs.json");
fs.writeFileSync(proofsPath, JSON.stringify(proofs, null, 2));
console.log("Merkle proofs saved to merkle-proofs.json");
