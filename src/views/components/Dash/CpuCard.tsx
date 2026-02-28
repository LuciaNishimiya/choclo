/** @jsxImportSource react */
import React from "react";

interface CpuCardProps {
  cpu: any;
}

export const CpuCard: React.FC<CpuCardProps> = ({ cpu }) => {
  return (
    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-4 hover:border-emerald-500/30 transition-colors">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-zinc-300">CPU Load</span>
        <span className="text-lg font-bold text-emerald-400 font-mono">{cpu?.load?.[0] || "0.00"}</span>
      </div>
      <div className="text-[10px] text-zinc-500 truncate mb-4" title={cpu?.model}>
        {cpu?.model || "Detecting..."}
      </div>
      
      <div className="flex flex-col gap-3">
        {cpu?.coreLoads?.map((load: string, index: number) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-600">Core {index}</span>
              <span className="text-zinc-400 font-mono">{load}%</span>
            </div>
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" 
                style={{ width: `${load}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
