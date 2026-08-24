import React from "react";
import { Navbar } from "@/src/components/Layout/Navbar";
import { SidebarNav } from "@/src/components/Layout/SidebarNav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <SidebarNav />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
