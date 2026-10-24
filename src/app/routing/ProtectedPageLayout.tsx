import { Outlet } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import AppPageLayout from "@/app/layout/AppPageLayout";

function ProtectedPageLayout() {
  return (
    <ProtectedRoute>
      <AppPageLayout>
        <Outlet />
      </AppPageLayout>
    </ProtectedRoute>
  );
}

export default ProtectedPageLayout;
