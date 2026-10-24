import type { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import SuggestedFriendsSidebar from "@/features/users/components/SuggestedFriendsSidebar";


function AppPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full justify-center gap-6 px-4 py-8 md:flex-row">
      <AppSidebar />

      <div className="flex min-w-0 max-w-2xl flex-1 justify-center">
        <div className="flex w-full flex-col gap-4">{children}</div>
      </div>

      <SuggestedFriendsSidebar />
    </div>
  );
}

export default AppPageLayout;
