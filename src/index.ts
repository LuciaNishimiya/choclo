import { serve } from "bun";
import { websocket } from "hono/bun";
import { router } from "./routes/index.js";
import index from "./views/index.html";

const server = serve({
  routes: {
    "/api/*": async (req) => {
      const resp = await router.fetch(req, server);
      return resp;
    },
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },

  websocket,
  port: process.env.PORT || 3000,
});

console.log(`🚀 Choclo running at ${server.url}`);