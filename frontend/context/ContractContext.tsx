import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFTABI from '../public/contracts/MyNFT.json';

interface ContractData {
  totalMinted: number;
  maxSupply: number;
  saleState: number;
  price: string;
  baseURI: string;
  isRevealed: boolean;
}

interface ContractContextType {
  contract: any;
  data: ContractData | null;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

const SALE_STATES = ['Paused', 'Allowlist', 'Public'];

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const [contract, setContract] = useState<any>(null);
  const [data, setData] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeContract();
  }, []);

  const initializeContract = async () => {
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn('Contract address not configured');
        return;
      }

      const contractInstance = new ethers.Contract(
        contractAddress,
        MyNFTABI.abi,
        provider
      );

      setContract(contractInstance);
      await fetchContractData(contractInstance);
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  };

  const fetchContractData = async (contractInstance: any) => {
    try {
      setLoading(true);
      const [totalMinted, maxSupply, saleState, price, baseURI, isRevealed] = await Promise.all([
        contractInstance.totalMinted(),
        contractInstance.MAX_SUPPLY(),
        contractInstance.saleState(),
        contractInstance.price(),
        contractInstance.baseURI(),
        contractInstance.isRevealed(),
      ]);

      setData({
        totalMinted: Number(totalMinted),
        maxSupply: Number(maxSupply),
        saleState: Number(saleState),
        price: ethers.formatEther(price),
        baseURI: baseURI,
        isRevealed: isRevealed,
      });
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (contract) {
      await fetchContractData(contract);
    }
  };

  return (
    <ContractContext.Provider value={{ contract, data, loading, refreshData }}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within ContractProvider');
  }
  return context;
}
