import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../shared/components/layout/header/Header";
import Sidebar from "../shared/components/layout/sidebar/Sidebar";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="w-full pb-10">
        <Outlet />
      </main>
    </div>
  );
}
