// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

error InvalidPrice();
error InvalidQuantity();
error InsufficientPayment();
error ExceedsMaxSupply();
error ExceedsPerWalletLimit();
error SaleNotActive();
error InvalidMerkleProof();
error WithdrawFailed();

contract MyNFT is ERC721, ERC2981, Ownable {
    enum SaleState {
        Paused,
        Allowlist,
        Public
    }

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MAX_PER_WALLET = 10;
    
    uint256 public price = 0.1 ether;
    uint256 public totalMinted;
    
    string public baseURI;
    string public revealedURI;
    bool public isRevealed;
    
    SaleState public saleState = SaleState.Paused;
    bytes32 public merkleRoot;
    
    mapping(address => uint256) public mintedPerWallet;

    event PriceUpdated(uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);
    event RevealedURIUpdated(string newRevealedURI);
    event MerkleRootUpdated(bytes32 newRoot);
    event SaleStateChanged(SaleState newState);
    event Revealed();
    event NFTMinted(address indexed to, uint256 quantity);

    constructor() ERC721("Generative NFT", "GNFT") {
        _setDefaultRoyalty(msg.sender, 500); // 5% royalties
    }

    // ============ Owner Configuration Functions ============

    function setPrice(uint256 newPrice) external onlyOwner {
        if (newPrice == 0) revert InvalidPrice();
        price = newPrice;
        emit PriceUpdated(newPrice);
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function setRevealedURI(string calldata newRevealedURI) external onlyOwner {
        revealedURI = newRevealedURI;
        emit RevealedURIUpdated(newRevealedURI);
    }

    function setMerkleRoot(bytes32 newMerkleRoot) external onlyOwner {
        merkleRoot = newMerkleRoot;
        emit MerkleRootUpdated(newMerkleRoot);
    }

    function setSaleState(SaleState newState) external onlyOwner {
        saleState = newState;
        emit SaleStateChanged(newState);
    }

    function pause() external onlyOwner {
        saleState = SaleState.Paused;
        emit SaleStateChanged(SaleState.Paused);
    }

    function unpause(SaleState targetState) external onlyOwner {
        if (targetState == SaleState.Paused) revert SaleNotActive();
        saleState = targetState;
        emit SaleStateChanged(targetState);
    }

    function reveal() external onlyOwner {
        isRevealed = true;
        emit Revealed();
    }

    // ============ Minting Functions ============

    function allowlistMint(
        bytes32[] calldata merkleProof,
        uint256 quantity
    ) external payable {
        if (saleState != SaleState.Allowlist) revert SaleNotActive();
        if (quantity == 0) revert InvalidQuantity();
        if (msg.value != price * quantity) revert InsufficientPayment();
        if (totalMinted + quantity > MAX_SUPPLY) revert ExceedsMaxSupply();
        if (mintedPerWallet[msg.sender] + quantity > MAX_PER_WALLET) 
            revert ExceedsPerWalletLimit();

        // Verify Merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        if (!MerkleProof.verify(merkleProof, merkleRoot, leaf)) 
            revert InvalidMerkleProof();

        _mintNFTs(msg.sender, quantity);
    }

    function publicMint(uint256 quantity) external payable {
        if (saleState != SaleState.Public) revert SaleNotActive();
        if (quantity == 0) revert InvalidQuantity();
        if (msg.value != price * quantity) revert InsufficientPayment();
        if (totalMinted + quantity > MAX_SUPPLY) revert ExceedsMaxSupply();
        if (mintedPerWallet[msg.sender] + quantity > MAX_PER_WALLET) 
            revert ExceedsPerWalletLimit();

        _mintNFTs(msg.sender, quantity);
    }

    function _mintNFTs(address to, uint256 quantity) internal {
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, totalMinted + i);
        }
        totalMinted += quantity;
        mintedPerWallet[to] += quantity;
        emit NFTMinted(to, quantity);
    }

    // ============ URI Functions ============

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        if (isRevealed) {
            return string(
                abi.encodePacked(revealedURI, "/", _toString(tokenId), ".json")
            );
        }
        return string(abi.encodePacked(baseURI, "/", _toString(tokenId), ".json"));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // ============ Withdrawal ============

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert WithdrawFailed();
    }

    // ============ ERC165 Support ============

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
