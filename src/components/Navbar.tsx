
import React from "react";
import { Menu, Home, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 py-3 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onMenuToggle}>
            <Menu size={20} />
          </Button>
          <div className="ml-3 flex items-center">
            <Home className="h-5 w-5 text-realestate-primary mr-2" />
            <h1 className="text-lg font-semibold text-realestate-primary">
              Bangalore Real Estate Insights
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-realestate-accent"></span>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-realestate-secondary text-white">
              BH
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
