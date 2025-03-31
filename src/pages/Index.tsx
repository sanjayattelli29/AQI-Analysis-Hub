
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AirQualityDashboard from "@/components/AirQualityDashboard";
import AirQualitySidebar from "@/components/AirQualitySidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative">
        <div className={`${isMobile ? 'fixed inset-y-0 z-40 transform transition-transform duration-300 ease-in-out' : 'fixed top-0 h-screen overflow-y-auto'} 
                         ${isMobile && !showSidebar ? '-translate-x-full' : 'translate-x-0'}`}>
          <AirQualitySidebar />
        </div>
        
        <main className="flex-1 overflow-x-hidden ml-0 md:ml-64">
          <AirQualityDashboard onToggleSidebar={toggleSidebar} />
        </main>
        
        {isMobile && (
          <Button 
            className="sidebar-toggle-button" 
            onClick={toggleSidebar}
            variant="default"
          >
            {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
      </div>
    </SidebarProvider>
  );
};

export default Index;
