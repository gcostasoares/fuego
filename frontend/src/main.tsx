// src/main.tsx
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "./index.scss";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

// seed your VITE_ADMIN_KEY into localStorage as soon as possible
if (import.meta.env.VITE_ADMIN_KEY) {
  localStorage.setItem("adminKey", import.meta.env.VITE_ADMIN_KEY);
}

// Import the generated route tree
import CookieConsentComponent from "./components/CookieConsentComponent";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
    <CookieConsentComponent />
  </>
);
