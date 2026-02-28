/** @jsxImportSource react */
import React from "react";
import { DashHeader } from "./DashHeader.tsx";
import { TerminalView } from "./TerminalView.tsx";
import { TasksView } from "./TasksView.tsx";

interface DashMainContentProps {
  activeTab: "terminal" | "tasks";
  setActiveTab: (tab: "terminal" | "tasks") => void;
  processes: any[];
  onKillProcess: (pid: string) => void;
  terminalRef: React.RefObject<HTMLDivElement | null>;
}

export const DashMainContent: React.FC<DashMainContentProps> = ({
  activeTab,
  setActiveTab,
  processes,
  onKillProcess,
  terminalRef
}) => {
  return (
    <main className="flex-1 flex flex-col h-screen bg-zinc-950/50 w-full overflow-hidden">
      <DashHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <section className="flex-1 overflow-hidden p-4 lg:p-6">
        <TerminalView isVisible={activeTab === "terminal"} terminalRef={terminalRef} />
        <TasksView isVisible={activeTab === "tasks"} processes={processes} onKillProcess={onKillProcess} />
      </section>
    </main>
  );
};
