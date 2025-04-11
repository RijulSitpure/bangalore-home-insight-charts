
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  PieChart,
  Settings,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { icon: LayoutDashboard, name: "Dashboard", path: "/" },
    { icon: TrendingUp, name: "Prediction", path: "/prediction" },
    { icon: BarChart3, name: "Comparison", path: "/comparison" },
    { icon: PieChart, name: "Analytics", path: "/analytics" },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  if (!open) return null;

  return (
    <div 
      className={cn(
        "bg-white border-r border-gray-200 w-64 flex-shrink-0 transition-all duration-300",
        isMobile ? "fixed inset-y-0 left-0 z-40" : "relative",
        !open && isMobile && "translate-x-[-100%]"
      )}
    >
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 right-3"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </Button>
      )}
      <div className="py-6 px-3 h-full overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive(item.path) 
                  ? "bg-realestate-primary text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
              onClick={() => isMobile && setOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
