import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { queryClient } from "./app/query-client";
import { router } from "./app/router";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#0f172a",
            color: "#ffffff",
            borderRadius: "6px",
            fontSize: "14px",
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
