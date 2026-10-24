import { useContext } from "react";
import type { ReactNode } from "react";
import { Spinner } from "@heroui/react";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { Navigate } from "react-router";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { userData, isLoading } = useContext(UserAuthContext);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (userData) {
    return children;
  }

  return <Navigate to="/login" />;
}

export default ProtectedRoute;
