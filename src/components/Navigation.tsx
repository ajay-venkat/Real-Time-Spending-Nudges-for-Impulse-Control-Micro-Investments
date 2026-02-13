
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Settings2, 
  TrendingUp, 
  History, 
  ShieldAlert,
  UserCircle
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Rules Engine", href: "/rules", icon: Settings2 },
  { name: "Investments", href: "/investments", icon: TrendingUp },
  { name: "History", href: "/history", icon: History },
  { name: "Admin Panel", href: "/admin", icon: ShieldAlert },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-card flex flex-col h-full sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <TrendingUp className="h-6 w-6" />
          <span>NudgeWealth</span>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto border-t">
        <div className="flex items-center gap-3 px-3 py-2">
          <UserCircle className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm">
            <p className="font-medium">Aditya Kumar</p>
            <p className="text-muted-foreground text-xs">Student Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
