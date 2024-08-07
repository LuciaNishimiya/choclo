import type { Context } from "hono";
import { Terminal } from "../services/system.js";
import { upgradeWebSocket } from "hono/bun";

export const terminalHandler = upgradeWebSocket((c) => {
  let terminal = new Terminal().spawn
  return {
    onOpen(event, ws) {
      terminal.onData((data: any) => {
        ws.send(data)
      })
      terminal.write('clear\n')
    },
    onMessage(event, ws) {
      terminal.write(event.data.toString())
    },
    onClose(ws) {
      terminal.kill()
    },
  }
});