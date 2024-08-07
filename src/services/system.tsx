// services/system.js
import { spawn } from "bun-pty";

export class Terminal {
  spawn: ReturnType<typeof spawn>;

  constructor() {
    this.spawn = spawn("bash", [], {
      name: "xterm-color",
      cols: 80,
      rows: 24,
      cwd: process.env.HOME,
      env: process.env,
    });
  } 
}
