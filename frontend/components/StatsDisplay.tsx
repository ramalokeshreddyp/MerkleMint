import React from 'react';
import { useContract } from '../context/ContractContext';

export function StatsDisplay() {
  const { data, loading } = useContract();

  if (loading || !data) {
    return <div className="text-slate-400">Loading...</div>;
  }

  const progressPercentage = (data.totalMinted / data.maxSupply) * 100;

  return (
    <div className="card w-full">
      <h3 className="text-xl font-bold text-primary mb-4">Collection Stats</h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary">Progress</span>
            <span className="text-primary font-semibold">
              <span data-testid="mint-count">{data.totalMinted.toLocaleString()}</span> / <span data-testid="total-supply">{data.maxSupply.toLocaleString()}</span>
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-sm text-secondary mt-1">
            {progressPercentage.toFixed(1)}% minted
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {data.totalMinted.toLocaleString()}
            </div>
            <div className="text-xs text-secondary">Minted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {(data.maxSupply - data.totalMinted).toLocaleString()}
            </div>
            <div className="text-xs text-secondary">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {data.price} ETH
            </div>
            <div className="text-xs text-secondary">Price</div>
          </div>
        </div>
      </div>
    </div>
  );
}
