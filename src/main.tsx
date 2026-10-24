import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "@/app/router";
import { queryClient } from "@/app/queryClient";
import UserAuthProvider from "@/app/providers/UserAuthProvider/UserAuthProvider";
import ThemeProvider from "@/app/providers/ThemeProvider/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserAuthProvider>
          <RouterProvider router={router} />
        </UserAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
