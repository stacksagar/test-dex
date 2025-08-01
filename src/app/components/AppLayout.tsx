import { ReactNode } from "react";
import Header from "@/components/Header";

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="grid grow h-[calc(100vh-65px)] md:h-[calc(100vh-81px)]">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
