/** @jsxImportSource react */
import React from "react";

interface NetworkCardProps {
  network: any;
  uptime: string;
}

export const NetworkCard: React.FC<NetworkCardProps> = ({ network, uptime }) => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Red & Sistema</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-3">
          <span className="text-[10px] text-zinc-600 block mb-1 uppercase font-bold">Download</span>
          <span className="text-xs font-bold text-emerald-400 font-mono">{network?.speed?.rx || "0 KB/s"}</span>
        </div>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-3">
          <span className="text-[10px] text-zinc-600 block mb-1 uppercase font-bold">Upload</span>
          <span className="text-xs font-bold text-blue-400 font-mono">{network?.speed?.tx || "0 KB/s"}</span>
        </div>
      </div>
      <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-4 flex justify-between items-center">
        <span className="text-sm font-medium text-zinc-300">Uptime</span>
        <span className="text-sm font-bold text-zinc-100 font-mono">{uptime || "..."}</span>
      </div>
    </section>
  );
};
