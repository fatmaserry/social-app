import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type {
  UserAuthContextType,
  UserData,
} from "./userAuthProvider.interface";
import { getUserData } from "./userAuthProvider.services";

export const UserAuthContext = createContext<UserAuthContextType>({
  userData: null,
  setUserData: () => {},
  isLoading: false,
});

export default function UserAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(
    () => !!localStorage.getItem("user_tkn"),
  );

  useEffect(function () {
    if (!localStorage.getItem("user_tkn")) return;

    getUserData().then((data) => {
      setUserData(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <UserAuthContext.Provider value={{ userData, setUserData, isLoading }}>
      {children}
    </UserAuthContext.Provider>
  );
}
