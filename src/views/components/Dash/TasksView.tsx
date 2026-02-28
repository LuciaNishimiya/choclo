/** @jsxImportSource react */
import React from "react";

interface TasksViewProps {
  isVisible: boolean;
  processes: any[];
  onKillProcess: (pid: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ isVisible, processes, onKillProcess }) => {
  return (
    <div
      id="tasks-view"
      className={`h-full flex flex-col bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100 flex" : "opacity-0 hidden"
      }`}
    >
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-zinc-800/50 text-zinc-500 text-[10px] uppercase tracking-wider font-bold sticky top-0 z-10">
              <th className="px-4 lg:px-6 py-4">PID</th>
              <th className="px-4 lg:px-6 py-4">User</th>
              <th className="px-4 lg:px-6 py-4">CPU %</th>
              <th className="px-4 lg:px-6 py-4 text-left">Cmd</th>
              <th className="px-4 lg:px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {processes.map((p) => (
              <tr key={p.pid} className="hover:bg-zinc-800/30 transition-colors group">
                <td className="px-4 lg:px-6 py-3 text-xs font-mono text-zinc-400 group-hover:text-emerald-400 transition-colors">{p.pid}</td>
                <td className="px-4 lg:px-6 py-3 text-xs text-zinc-500 truncate max-w-[80px]">{p.user}</td>
                <td className="px-4 lg:px-6 py-3 text-xs font-bold text-emerald-400 font-mono">{p.cpu}</td>
                <td className="px-4 lg:px-6 py-3 text-xs text-zinc-300 font-mono truncate max-w-[150px] lg:max-w-xs" title={p.command}>
                  {p.command}
                </td>
                <td className="px-4 lg:px-6 py-3 text-right">
                  <button 
                    className="px-2 lg:px-3 py-1 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg text-[9px] lg:text-[10px] font-bold border border-rose-500/20 transition-all"
                    onClick={() => onKillProcess(p.pid)}
                  >
                    KILL
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
