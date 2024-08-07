import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";

type Meta = {
    title?: string;
    description?: string;
}
export const Layout = (content: HtmlEscapedString | Promise<HtmlEscapedString>, meta: Meta) => {
    return html`<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta?.title}</title>
    <meta name="description" content="${meta?.description}">
    <link rel="icon" type="image/webp" href="/favicon.webp">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body>
   ${content}
</body>
</html>`;
}