/** @jsxImportSource react */
import React, { useState, useEffect, useRef } from "react";
import { DashSidebar } from "../components/Dash/DashSidebar.tsx";
import { DashMainContent } from "../components/Dash/DashMainContent.tsx";

declare const Terminal: any; // xterm is loaded via CDN in index.html

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"terminal" | "tasks">("terminal");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [processes, setProcesses] = useState<any[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<any>(null);
  const statsSocket = useRef<WebSocket | null>(null);
  const termSocket = useRef<WebSocket | null>(null);

  const getAuthToken = () => {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; authToken=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
    } catch (e) {
      console.error("Cookie error:", e);
    }
    return "";
  };

  const fetchProcesses = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch('/api/system/processes', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.processes) setProcesses(data.processes);
      }
    } catch (e) { console.error('Fetch tasks error:', e); }
  };

  const killProcess = async (pid: string) => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch('/api/system/processes/' + pid, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) fetchProcesses();
      else alert('Failed to kill process');
    } catch (e) { console.error('Kill error:', e); }
  };

  useEffect(() => {
    fetchProcesses();
    const processInterval = setInterval(fetchProcesses, 4000);
    return () => clearInterval(processInterval);
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;

    statsSocket.current = new WebSocket(`${protocol}//${host}/api/system/stats/ws?token=${encodeURIComponent(token)}`);
    statsSocket.current.onmessage = (event) => {
      try {
        setStats(JSON.parse(event.data));
      } catch (e) {}
    };

    if (terminalRef.current && !termInstance.current && typeof (window as any).Terminal !== 'undefined') {
      const TerminalClass = (window as any).Terminal;
      const FitAddonClass = (window as any).FitAddon?.FitAddon;

      termInstance.current = new TerminalClass({
        cursorBlink: true,
        fontSize: 13,
        fontFamily: 'Fira Code, monospace',
        theme: {
          background: '#000000',
          foreground: '#d4d4d4',
          cursor: '#00ff99',
          selection: 'rgba(0, 255, 153, 0.3)'
        }
      });

      if (FitAddonClass) {
        const fitAddon = new FitAddonClass();
        termInstance.current.loadAddon(fitAddon);
        termInstance.current.open(terminalRef.current);
        fitAddon.fit();
        window.addEventListener('resize', () => fitAddon.fit());
      } else {
        termInstance.current.open(terminalRef.current);
      }

      termSocket.current = new WebSocket(`${protocol}//${host}/api/system/ws?token=${encodeURIComponent(token)}`);
      termInstance.current.onData((data: string) => termSocket.current?.send(data));
      termSocket.current.onmessage = (event: any) => termInstance.current.write(event.data);
    }

    return () => {
      statsSocket.current?.close();
      termSocket.current?.close();
    };
  }, []);

  return (
    <div className="flex bg-zinc-950 text-zinc-100 h-screen overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative">
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 text-zinc-900 rounded-full shadow-lg shadow-emerald-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <DashSidebar stats={stats} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <DashMainContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        processes={processes}
        onKillProcess={killProcess}
        terminalRef={terminalRef}
      />
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
