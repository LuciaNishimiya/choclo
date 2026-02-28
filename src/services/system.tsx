import { spawn } from "bun-pty";
import os from "node:os";
import { execSync } from "node:child_process";

export class Terminal {
  spawn: ReturnType<typeof spawn>;

  constructor() {
    this.spawn = spawn(process.env.SHELL || "bash", [], {
      name: "xterm-color",
      cols: 80,
      rows: 24,
      cwd: process.env.HOME,
      env: process.env,
    });
  } 
}

let lastNetStats = { rx: 0, tx: 0, time: Date.now() };
let lastCpuTimes: any[] = [];

export async function getRAMStats() {
  let totalMem = os.totalmem();
  let availableMem = os.freemem(); 
  try {
    const meminfo = await Bun.file('/proc/meminfo').text();
    const lines = meminfo.split('\n');
    let free = 0, buffers = 0, cached = 0, sreclaimable = 0, shmem = 0, swapTotal = 0, swapFree = 0;
    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (line.startsWith('MemTotal:')) totalMem = parseInt(parts[1], 10) * 1024;
      if (line.startsWith('MemFree:')) free = parseInt(parts[1], 10) * 1024;
      if (line.startsWith('Buffers:')) buffers = parseInt(parts[1], 10) * 1024;
      if (line.startsWith('Cached:')) cached = parseInt(parts[1], 10) * 1024;
      if (line.startsWith('SReclaimable:')) sreclaimable = parseInt(parts[1], 10) * 1024;
      if (line.startsWith('Shmem:')) shmem = parseInt(parts[1], 10) * 1024;
      if (line.startsWith('SwapTotal:')) swapTotal = parseInt(parts[1], 10) * 1024;
      if (line.startsWith('SwapFree:')) swapFree = parseInt(parts[1], 10) * 1024;
    }
    const htopUsed = totalMem - free - buffers - cached - sreclaimable + shmem;
    availableMem = totalMem - htopUsed;

    const swapUsed = swapTotal - swapFree;
    const swapPercentage = swapTotal > 0 ? ((swapUsed / swapTotal) * 100).toFixed(2) : "0.00";
    (global as any).lastSwapStats = { total: swapTotal, used: swapUsed, percentage: swapPercentage };
    
  } catch (e) {
    console.error("Error reading meminfo:", e);
  }
  
  const usedMem = Math.max(0, totalMem - availableMem);
  const memPercentage = totalMem > 0 ? ((usedMem / totalMem) * 100).toFixed(2) : "0.00";

  return {
    total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + " GB",
    used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + " GB",
    percentage: memPercentage,
    swap: {
      total: (((global as any).lastSwapStats?.total || 0) / 1024 / 1024 / 1024).toFixed(2) + " GB",
      used: (((global as any).lastSwapStats?.used || 0) / 1024 / 1024 / 1024).toFixed(2) + " GB",
      percentage: (global as any).lastSwapStats?.percentage || "0.00"
    }
  };
}

export async function getCPUStats() {
  const cpus = os.cpus();
  const cpuModel = cpus[0].model;
  const cpuLoad = os.loadavg();

  if (lastCpuTimes.length === 0) lastCpuTimes = cpus.map(c => c.times);
  const coreLoads = cpus.map((core, i) => {
    const last = lastCpuTimes[i] || core.times;
    const currentTotal = core.times.user + core.times.nice + core.times.sys + core.times.idle + core.times.irq;
    const lastTotal = last.user + last.nice + last.sys + last.idle + last.irq;
    const totalDiff = currentTotal - lastTotal;
    const idleDiff = core.times.idle - last.idle;
    
    let percentage = 0;
    if (totalDiff > 0) percentage = Math.max(0, 100 - (100 * idleDiff / totalDiff));
    return percentage.toFixed(1);
  });
  lastCpuTimes = cpus.map(c => c.times);

  return {
    model: cpuModel,
    load: cpuLoad.map(l => l.toFixed(2)),
    cores: cpus.length,
    coreLoads: coreLoads
  };
}

export async function getDiskStats() {
  let disks: any[] = [];
  try {
    const output = execSync("lsblk -J -b -o NAME,TYPE,SIZE,MOUNTPOINT,FSTYPE,FSAVAIL,FSUSE%,PARTTYPENAME || true").toString().trim();
    if (output) {
      const parsed = JSON.parse(output);
      disks = (parsed.blockdevices || [])
        .filter((d: any) => d.type === 'disk' && !d.name.startsWith('zram') && !d.name.startsWith('loop'))
        .map((device: any) => {
          const partitions = (device.children || [])
            .filter((c: any) => c.type === 'part' || c.type === 'crypt')
            .map((child: any) => {
              const size = child.size || 0;
              const total = formatBytes(size);
              const availStr = child.fsavail;
              let used = "0 B";
              let percentage = child['fsuse%'] ? child['fsuse%'].replace("%", "").trim() : "0";
              
              if (availStr !== null && availStr !== undefined) {
                const avail = parseInt(availStr, 10);
                used = formatBytes(size - avail);
              }

              let mount = child.mountpoint || child.parttypename || child.fstype || child.name;

              return {
                name: child.name,
                mount: mount,
                total,
                used,
                percentage
              };
            });

          return {
            name: device.name,
            total: formatBytes(device.size || 0),
            partitions
          };
        });
    }
  } catch (e) {
    console.error("Error fetching disk stats:", e);
  }
  return disks;
}

export async function getNetworkStats() {
  let currentNetStats = { rx: 0, tx: 0 };
  let netSpeed = { rx: 0, tx: 0 };
  try {
    const netContent = await Bun.file('/proc/net/dev').text();
    const lines = netContent.trim().split('\n');
    let totalRx = 0, totalTx = 0;
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('lo:')) continue;
      const parts = line.split(/:|\s+/).filter(Boolean);
      if (parts.length >= 10) {
        totalRx += parseInt(parts[1], 10) || 0;
        totalTx += parseInt(parts[9], 10) || 0;
      }
    }
    currentNetStats = { rx: totalRx, tx: totalTx };
    
    const now = Date.now();
    const timeDiff = (now - lastNetStats.time) / 1000;
    if (timeDiff > 0) {
      netSpeed = {
        rx: Math.max(0, (currentNetStats.rx - lastNetStats.rx) / timeDiff),
        tx: Math.max(0, (currentNetStats.tx - lastNetStats.tx) / timeDiff)
      };
    }
    lastNetStats = { ...currentNetStats, time: now };
  } catch (e) {}

  return {
    ...currentNetStats,
    speed: {
      rx: formatBytes(netSpeed.rx) + "/s",
      tx: formatBytes(netSpeed.tx) + "/s"
    }
  };
}

export function getUptime() {
  return formatUptime(os.uptime());
}

export async function getSystemStats() {
  const [ram, cpu, disks, network, uptime] = await Promise.all([
    getRAMStats(),
    getCPUStats(),
    getDiskStats(),
    getNetworkStats(),
    Promise.resolve(getUptime())
  ]);

  return {
    uptime,
    memory: ram,
    cpu,
    disks,
    network
  };
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}
