import React from 'react';
import { useWallet } from '../context/WalletContext';

export function WalletButton() {
  const { account, isConnecting, connectWallet } = useWallet();

  if (account) {
    return (
      <div className="flex items-center gap-4">
        <div data-testid="connected-address" className="text-sm text-slate-400">
          {account.substring(0, 6)}...{account.substring(account.length - 4)}
        </div>
      </div>
    );
  }

  return (
    <button
      data-testid="connect-wallet-button"
      onClick={connectWallet}
      disabled={isConnecting}
      className="button-primary"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
