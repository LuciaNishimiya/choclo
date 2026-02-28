import { upgradeWebSocket } from "hono/bun";
import { getSystemStats } from "../services/system.js";

export const statsHandler = upgradeWebSocket((c) => {
  let intervalId: any;
  
  return {
    async onOpen(event, ws) {
      // Send initial stats
      const stats = await getSystemStats();
      ws.send(JSON.stringify(stats));

      // Set up interval for updates (every 2 seconds)
      intervalId = setInterval(async () => {
        try {
          const stats = await getSystemStats();
          ws.send(JSON.stringify(stats));
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      }, 2000);
    },
    onClose() {
      if (intervalId) clearInterval(intervalId);
    },
  };
});
