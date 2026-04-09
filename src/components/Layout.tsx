import React from "react";
import { Activity, AlertTriangle, LayoutDashboard, Stethoscope, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "diagnostics", label: "Diagnostics", icon: Stethoscope },
    { id: "malnutrition", label: "Malnutrition", icon: Camera },
    { id: "alerts", label: "Outbreak Alerts", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#141414]/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#141414] p-1.5 rounded-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-serif italic text-xl font-medium tracking-tight">
              Kaduna Health AI
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono opacity-50 uppercase tracking-widest">
              District: Kaduna South
            </span>
            <div className="w-8 h-8 rounded-full bg-[#141414]/5 border border-[#141414]/10 flex items-center justify-center">
              <span className="text-[10px] font-bold">CHV</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200",
                  "font-mono text-xs uppercase tracking-wider",
                  activeTab === item.id
                    ? "bg-[#141414] text-white shadow-lg"
                    : "hover:bg-[#141414]/5 text-[#141414]/60"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-12 p-4 border border-[#141414]/10 rounded-sm bg-white/50">
            <h3 className="font-serif italic text-xs opacity-50 mb-2">System Status</h3>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              AI MODELS ONLINE
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#141414]/10 px-4 py-2 flex justify-around z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "p-2 rounded-sm flex flex-col items-center gap-1",
              activeTab === item.id ? "text-[#141414]" : "text-[#141414]/40"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[8px] font-mono uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
