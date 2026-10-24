import { useContext } from "react";
import type { ReactNode } from "react";
import { Spinner } from "@heroui/react";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { Navigate } from "react-router";

function AuthProtected({ children }: { children: ReactNode }) {
  const { userData, isLoading } = useContext(UserAuthContext);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (userData) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AuthProtected;
