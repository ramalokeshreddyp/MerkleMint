import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { WalletProvider } from '../context/WalletContext';
import { ContractProvider } from '../context/ContractContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WalletProvider>
      <ContractProvider>
        <Component {...pageProps} />
      </ContractProvider>
    </WalletProvider>
  );
}
