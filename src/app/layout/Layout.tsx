import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";

function Layout() {
  return (
    <>
      <Navbar />
      <div className="bg-background min-h-screen pt-20">
        <Outlet />
        <Toaster
          toastOptions={{
            style: {
              background: "var(--surface)",
              color: "var(--surface-foreground)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </div>
    </>
  );
}

export default Layout;
