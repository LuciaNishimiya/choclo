/** @jsxImportSource react */
import React from "react";

interface TerminalViewProps {
  isVisible: boolean;
  terminalRef: React.RefObject<HTMLDivElement | null>;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ isVisible, terminalRef }) => {
  return (
    <div
      id="terminal-view"
      className={`h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-opacity duration-300 ${
        isVisible ? "opacity-100 flex" : "opacity-0 hidden"
      }`}
    >
      <div className="bg-zinc-800/80 px-4 py-2 flex items-center gap-2 border-b border-zinc-700/50">
        <span className="ml-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">
          Terminal
        </span>
      </div>
      <div id="terminal" ref={terminalRef} className="flex-1 p-2 bg-black min-h-[300px]"></div>
    </div>
  );
};
