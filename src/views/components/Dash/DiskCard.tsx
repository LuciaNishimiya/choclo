/** @jsxImportSource react */
import React from "react";

interface DiskCardProps {
  disks: any[];
}

export const DiskCard: React.FC<DiskCardProps> = ({ disks }) => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Almacenamiento</h2>
      <div className="flex flex-col gap-4">
        {disks?.map((disk: any, dIdx: number) => (
          <div key={dIdx} className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-700/30 pb-2">
              <span className="text-xs font-bold text-zinc-100 flex items-center gap-1">💿 {disk.name}</span>
              <span className="text-[10px] text-zinc-500 font-mono">{disk.total}</span>
            </div>
            <div className="space-y-4">
              {disk.partitions?.map((part: any, pIdx: number) => (
                <div key={pIdx} className="pl-3 border-l-2 border-zinc-700/50 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-zinc-300 font-medium truncate max-w-[120px]">{part.mount}</span>
                    <span className="text-xs font-bold text-zinc-100 font-mono">{part.percentage}%</span>
                  </div>
                  <div className="text-[9px] text-zinc-600 font-mono">{part.used} / {part.total}</div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-zinc-500 transition-all duration-500" 
                      style={{ width: `${part.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
