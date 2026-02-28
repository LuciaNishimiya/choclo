import { execSync } from "node:child_process";

export interface ProcessInfo {
  pid: string;
  user: string;
  cpu: string;
  mem: string;
  command: string;
}

export class ProcessService {
  /**
   * Fetches the top 50 processes sorted by CPU usage.
   * Parses the output of 'ps' to provide PID, User, CPU%, RSS (as formatted string), and Command.
   */
  static getProcessesList(): ProcessInfo[] {
    try {
      // rss is resident set size (non-swapped physical memory) in kilobytes
      const output = execSync("ps -axo pid,user,%cpu,rss,command --sort=-%cpu | head -n 51")
        .toString()
        .trim()
        .split('\n');
      
      // First line is header
      return output.slice(1).map(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[0];
        const user = parts[1];
        const cpu = parts[2] + "%";
        const rssKb = parseInt(parts[3], 10);
        const command = parts.slice(4).join(' ');

        return {
          pid,
          user,
          cpu,
          mem: this.formatBytes(rssKb * 1024), // rss is in KB, convert to bytes for formatter
          command
        };
      }).filter(p => p.pid && p.command);
    } catch (error) {
      console.error("Error fetching processes:", error);
      throw error;
    }
  }

  /**
   * Terminates a process by its PID using SIGKILL (forceful).
   */
  static killProcess(pid: number): void {
    try {
      execSync(`kill -9 ${pid}`);
    } catch (error) {
      console.error(`Error killing process ${pid}:`, error);
      throw error;
    }
  }

  /**
   * Utility to format bytes into a human-readable string.
   */
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
