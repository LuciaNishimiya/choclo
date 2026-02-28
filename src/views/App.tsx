import React, { useState, useEffect } from "react";
import { Login, Register } from "./pages/Auth.tsx";
import { Dashboard } from "./pages/Dash.tsx";
import "./index.css";
export const App = () => { 
  const [page, setPage] = useState<"login" | "register" | "dash">("login");

  const checkAuth = () => {
    const hasToken = document.cookie.includes("authToken");
    if (hasToken) setPage("dash");
    else if (window.location.pathname === "/register") setPage("register");
    else setPage("login");
  };

  useEffect(() => {
    checkAuth();
    const handlePopState = () => checkAuth();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (p: "login" | "register" | "dash") => {
    const path = p === "dash" ? "/dash" : p === "register" ? "/register" : "/";
    window.history.pushState({}, "", path);
    setPage(p);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {page === "login" && <Login onAuth={() => navigateTo("dash")} onSwitch={() => navigateTo("register")} />}
      {page === "register" && <Register onAuth={() => navigateTo("dash")} onSwitch={() => navigateTo("login")} />}
      {page === "dash" && <Dashboard />}
    </div>
  );
};
