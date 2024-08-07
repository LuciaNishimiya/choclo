import { html } from "hono/html";

export const Dashboard = () => {
  return html`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/xterm/css/xterm.css">

    <style>
      body {
        margin: 0;
        font-family: sans-serif;
        background-color: #0f172a;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }
      .terminal-container {
        width: 90%;
        max-width: 900px;
        height: 500px;
        background-color: #1e1e1e;
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
      }
      .terminal-header {
        background-color: #111827;
        height: 32px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        gap: 8px;
      }
      #terminal {
        flex: 1;
      }
    </style>

    <div class="terminal-container">
      <div class="terminal-header">
      </div>
      <div id="terminal"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/xterm/lib/xterm.js"></script>
    <script>
      const term = new Terminal({
        cursorBlink: true,
        fontSize: 15,
        fontFamily: 'Fira Code, monospace',
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
          cursor: '#00ff99',
          selection: 'rgba(0, 255, 153, 0.3)'
        }
      });

      term.open(document.getElementById("terminal"));

      (async () => {
        try {
          const cookie = await cookieStore.get('authToken');
          if (!cookie) {
            term.writeln("\\x1b[31m[ERROR]\\x1b[0m No se encontró la cookie de autenticación. Por favor, inicia sesión.");
            return;
          }

          const jwtToken = cookie.value;
          const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
          const host = window.location.host;
          const socket = new WebSocket(protocol + '//' + host + '/api/system/ws?token=' + encodeURIComponent(jwtToken)
          );

          term.onData(data => socket.send(data));
          socket.onmessage = (event) => term.write(event.data);

          socket.onerror = () => term.writeln("\\x1b[31m[ERROR]\\x1b[0m Error de conexión con el servidor.");
          socket.onclose = () => term.writeln("\\x1b[33m[INFO]\\x1b[0m Conexión cerrada.");
        } catch (err) {
          term.writeln("\\x1b[31m[ERROR]\\x1b[0m Error al leer cookie: " + err);
        }
      })();
    </script>
  `;
};
