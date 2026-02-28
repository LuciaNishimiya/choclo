/** @jsxImportSource react */
import React from "react";

interface DashHeaderProps {
  activeTab: "terminal" | "tasks";
  setActiveTab: (tab: "terminal" | "tasks") => void;
}

export const DashHeader: React.FC<DashHeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="p-4 lg:p-6 border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-md sticky top-0 z-10 w-full shrink-0">
      <div className="flex bg-zinc-800/50 p-1 rounded-xl w-fit">
        <button
          className={`px-4 lg:px-6 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-200 ${
            activeTab === "terminal" 
              ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20" 
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
          }`}
          onClick={() => setActiveTab("terminal")}
        >
          Terminal
        </button>
        <button
          className={`px-4 lg:px-6 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-200 ${
            activeTab === "tasks" 
              ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20" 
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
          }`}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks
        </button>
      </div>
    </header>
  );
};
