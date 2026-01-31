import React from 'react';
import Head from 'next/head';
import { WalletButton } from '../components/WalletButton';
import { MintingComponent } from '../components/MintingComponent';
import { StatsDisplay } from '../components/StatsDisplay';

export default function Home() {
  return (
    <>
      <Head>
        <title>NFT Launchpad</title>
        <meta name="description" content="Generative NFT Collection Launchpad" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container-wrapper">
        <header className="bg-slate-900 border-b border-slate-700">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">✦</span>
              </div>
              <h1 className="text-2xl font-bold text-white">NFT Launchpad</h1>
            </div>
            <WalletButton />
          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Section - Hero */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-4xl font-bold text-primary mb-4">
                  Generative NFT Collection
                </h2>
                <p className="text-secondary mb-6 leading-relaxed">
                  Welcome to our exclusive NFT launchpad. Mint unique digital collectibles
                  with a sophisticated allowlist and public minting phases. Each NFT is
                  uniquely generated and permanently stored on the blockchain.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-700 rounded p-4">
                    <div className="text-3xl font-bold text-blue-400">10k</div>
                    <div className="text-sm text-secondary">Total Supply</div>
                  </div>
                  <div className="bg-slate-700 rounded p-4">
                    <div className="text-3xl font-bold text-purple-400">5%</div>
                    <div className="text-sm text-secondary">Royalties</div>
                  </div>
                  <div className="bg-slate-700 rounded p-4">
                    <div className="text-3xl font-bold text-green-400">Phased</div>
                    <div className="text-sm text-secondary">Release</div>
                  </div>
                </div>

                <div className="text-sm text-slate-400 leading-relaxed">
                  <h3 className="font-semibold text-slate-300 mb-2">How it works:</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Connect your wallet to get started</li>
                    <li>During allowlist phase, only whitelisted addresses can mint</li>
                    <li>After public phase, anyone can mint available NFTs</li>
                    <li>Each NFT comes with unique metadata and artwork</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Right Section - Minting Interface */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <MintingComponent allowlist={[
                '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
                '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ea',
              ]} />
              <StatsDisplay />
            </div>
          </div>
        </main>

        <footer className="bg-slate-900 border-t border-slate-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 NFT Launchpad. Built with Next.js and Solidity.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
