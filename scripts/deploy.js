const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying MyNFT contract...");

  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const contract = await MyNFT.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("MyNFT deployed to:", address);

  // Get the contract artifact with full ABI
  const artifact = await hre.artifacts.readArtifact("MyNFT");

  // Save contract address and ABI to frontend
  const contractInfo = {
    address: address,
    abi: artifact.abi,
  };

  const frontendContractsDir = path.join(__dirname, "../frontend/public/contracts");
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendContractsDir, "MyNFT.json"),
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Contract ABI saved to frontend/public/contracts/MyNFT.json");

  // Also save to .env.local for frontend
  const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;
  fs.writeFileSync(path.join(__dirname, "../.env.local"), envContent);
  console.log("Contract address saved to .env.local");

  // Verify interfaces
  const ERC721_INTERFACE = "0x80ac58cd";
  const ERC2981_INTERFACE = "0x2a55205a";

  try {
    const supportsERC721 = await contract.supportsInterface(ERC721_INTERFACE);
    console.log("Supports ERC721:", supportsERC721);

    const supportsERC2981 = await contract.supportsInterface(ERC2981_INTERFACE);
    console.log("Supports ERC2981:", supportsERC2981);
  } catch (error) {
    console.error("Interface check failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
