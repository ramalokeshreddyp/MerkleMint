import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { useContract } from '../context/ContractContext';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

interface MintingComponentProps {
  allowlist?: string[];
}

export function MintingComponent({ allowlist = [] }: MintingComponentProps) {
  const { account } = useWallet();
  const { contract, data, refreshData } = useContract();
  const [quantity, setQuantity] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const getSaleStatusText = () => {
    if (!data) return 'Loading...';
    const states = ['Paused', 'Allowlist', 'Public'];
    return states[data.saleState] || 'Unknown';
  };

  const canMint = (): boolean => {
    if (!account || !data) return false;
    if (data.saleState === 0) return false; // Paused
    if (data.totalMinted >= data.maxSupply) return false;
    return true;
  };

  const getMerkleProof = (): string[] | null => {
    if (!account || data?.saleState !== 1) return null; // Not in allowlist phase
    if (!allowlist.includes(account)) return null;

    const leaves = allowlist.map((address) =>
      keccak256(Buffer.from(address.slice(2).toLowerCase(), 'hex'))
    );
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const leaf = keccak256(Buffer.from(account.slice(2).toLowerCase(), 'hex'));
    return tree.getHexProof(leaf);
  };

  const handleMint = async () => {
    if (!account || !contract || !data) return;

    try {
      setIsMinting(true);
      setTxStatus('Initiating mint...');

      const signer = new ethers.BrowserProvider(window.ethereum).getSigner();
      const contractWithSigner = contract.connect(await signer);

      const value = ethers.parseEther((parseFloat(data.price) * quantity).toString());

      let tx;
      if (data.saleState === 1) { // Allowlist
        const proof = getMerkleProof();
        if (!proof) {
          setTxStatus('Not on allowlist');
          return;
        }
        tx = await contractWithSigner.allowlistMint(proof, quantity, { value });
      } else if (data.saleState === 2) { // Public
        tx = await contractWithSigner.publicMint(quantity, { value });
      }

      setTxStatus('Confirming transaction...');
      await tx.wait();

      setTxStatus('Mint successful!');
      await refreshData();
      setTimeout(() => setTxStatus(null), 3000);
    } catch (error: any) {
      setTxStatus(`Error: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  const remainingSupply = data ? data.maxSupply - data.totalMinted : 0;
  const isSoldOut = data && data.totalMinted >= data.maxSupply;

  return (
    <div className="card w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-4">Mint Your NFT</h2>

      <div className="space-y-4">
        {/* Sale Status */}
        <div>
          <label className="text-secondary text-sm">Sale Status</label>
          <div
            data-testid="sale-status"
            className="text-lg font-semibold text-primary mt-1"
          >
            {getSaleStatusText()}
          </div>
        </div>

        {/* Supply Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-secondary text-sm">Minted</label>
            <div
              data-testid="mint-count"
              className="text-2xl font-bold text-primary mt-1"
            >
              {data?.totalMinted || 0}
            </div>
          </div>
          <div>
            <label className="text-secondary text-sm">Max Supply</label>
            <div
              data-testid="total-supply"
              className="text-2xl font-bold text-primary mt-1"
            >
              {data?.maxSupply || 10000}
            </div>
          </div>
        </div>

        {/* Price Info */}
        {data && (
          <div>
            <label className="text-secondary text-sm">Price per NFT</label>
            <div className="text-lg font-semibold text-primary mt-1">
              {data.price} ETH
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div>
          <label className="text-secondary text-sm">Quantity</label>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
            data-testid="quantity-input"
            className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-primary focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Mint Button */}
        <button
          data-testid="mint-button"
          onClick={handleMint}
          disabled={!canMint() || isMinting || !account}
          className="button-primary w-full"
        >
          {!account
            ? 'Connect Wallet First'
            : isMinting
            ? 'Minting...'
            : isSoldOut
            ? 'Sold Out'
            : data?.saleState === 0
            ? 'Sale Paused'
            : `Mint ${quantity} NFT${quantity > 1 ? 's' : ''}`}
        </button>

        {/* Status Message */}
        {txStatus && (
          <div className={`p-3 rounded text-sm ${
            txStatus.includes('Error') ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'
          }`}>
            {txStatus}
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-secondary pt-2 border-t border-slate-700">
          <p>Remaining Supply: {remainingSupply}</p>
        </div>
      </div>
    </div>
  );
}
