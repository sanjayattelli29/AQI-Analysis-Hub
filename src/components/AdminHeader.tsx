
import React from "react";
import { Activity, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-400" />
            <h2 className="text-sm md:text-base font-semibold text-white">
              AQI Analysis Admin
            </h2>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
