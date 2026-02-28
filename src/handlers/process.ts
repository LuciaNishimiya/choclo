import type { Context } from "hono";
import { ProcessService } from "../services/process.js";

export const getProcesses = async (c: Context) => {
  try {
    const processes = ProcessService.getProcessesList();
    return c.json({ processes });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const killProcess = async (c: Context) => {
  try {
    const pid = c.req.param('pid');
    if (!pid || isNaN(Number(pid))) {
      return c.json({ error: "Invalid PID" }, 400);
    }
    ProcessService.killProcess(Number(pid));
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
