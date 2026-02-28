import React from "react";
import { CpuCard } from "./CpuCard.tsx";
import { MemoryCard } from "./MemoryCard.tsx";
import { NetworkCard } from "./NetworkCard.tsx";
import { DiskCard } from "./DiskCard.tsx";

interface DashSidebarProps {
  stats: any;
  isOpen?: boolean;
  onClose?: () => void;
}

export const DashSidebar: React.FC<DashSidebarProps> = ({ stats, isOpen, onClose }) => {
  const { cpu, memory, network, uptime, disks } = stats || {};

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-80 bg-zinc-900/90 backdrop-blur-xl border-r border-zinc-800 p-6 flex flex-col gap-8 transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar
      lg:relative lg:translate-x-0 lg:bg-zinc-900/50
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌽</span>
          <h1 className="text-xl font-bold text-emerald-400">
            Choclo
          </h1>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rendimiento</h2>
        
        <CpuCard cpu={cpu} />

        <MemoryCard 
          title="RAM Usage"
          percentage={memory?.percentage}
          used={memory?.used}
          total={memory?.total}
          colorClasses="text-blue-400"
          gradientClasses="bg-gradient-to-r from-blue-500 to-indigo-500"
          borderColorHover="hover:border-blue-500/30"
        />

        <MemoryCard 
          title="SWP Usage"
          percentage={memory?.swap?.percentage}
          used={memory?.swap?.used}
          total={memory?.swap?.total}
          colorClasses="text-purple-400"
          gradientClasses="bg-gradient-to-r from-purple-500 to-fuchsia-500"
          borderColorHover="hover:border-purple-500/30"
        />
      </section>

      <NetworkCard network={network} uptime={uptime} />

      <DiskCard disks={disks} />
    </aside>
  );
};
