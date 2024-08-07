import { Hono } from "hono"
import { html, raw } from "hono/html"
import { Layout } from "./components/Layout.js"
import { Login, Register } from "./pages/Auth.js"
import { Dashboard } from "./pages/Dash.js"
import { authMiddleware } from "../middlewares/auth.js"

export const pages = new Hono()

pages.get('/register', (c) => {
  return c.html(
    Layout(
      html`
      ${Register()}
      `,
    {title: "", description: ""})
  )
})
pages.get('/', (c) => {
  return c.html(
    Layout(
      html`
      ${Login()}
    `, {title: "Choclo", description: ""})
  )
})
pages.get('/dash', authMiddleware, (c) => {
  return c.html(
    Layout(
      html`
      ${Dashboard()}
    `, {title: "Choclo", description: ""})
  )
})