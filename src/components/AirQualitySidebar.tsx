
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter
} from "@/components/ui/sidebar";
import { 
  Home, 
  Wind, 
  BarChart2, 
  Gauge, 
  Thermometer, 
  Info,
  Database,
  Activity,
  LogOut
} from "lucide-react";

// Menu items
const dashboardItems = [
  {
    title: "Home",
    icon: Home,
    id: "home"
  },
  {
    title: "Air Quality Inputs",
    icon: Wind,
    id: "inputs"
  },
  {
    title: "Analysis",
    icon: BarChart2,
    id: "analysis"
  },
  {
    title: "Quality Index",
    icon: Gauge,
    id: "quality-index"
  },
  {
    title: "Final Air Quality",
    icon: Thermometer,
    id: "final-air-quality"
  }
];

interface AirQualitySidebarProps {
  onLogout?: () => void;
  isAdmin?: boolean;
}

const AirQualitySidebar: React.FC<AirQualitySidebarProps> = ({ onLogout, isAdmin = false }) => {
  const navigate = useNavigate();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4">
        <h2 className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Air Quality Monitor
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isAdmin ? (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation("/")}
                    tooltip="Main Dashboard"
                  >
                    <Home />
                    <span>Main Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                dashboardItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => scrollToSection(item.id)}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Advanced</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => handleNavigation("/admin")}
                  tooltip="AQI Analysis"
                  isActive={isAdmin}
                >
                  <Activity />
                  <span>AQI Analysis</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {onLogout && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={onLogout}
                    tooltip="Logout"
                  >
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-center space-x-2">
          <Info className="h-3 w-3" />
          <span>Air Quality Dashboard v1.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AirQualitySidebar;
