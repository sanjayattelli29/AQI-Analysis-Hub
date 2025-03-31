import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, MapPin, Gauge, AlertCircle } from "lucide-react";
import { AirQualityData } from "@/utils/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  airQualityData: AirQualityData | null;
  isLoading: boolean;
  onRefresh: () => void;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  airQualityData, 
  isLoading, 
  onRefresh,
  onToggleSidebar
}) => {
  const isMobile = useIsMobile();
  
  const getAqiColor = (category: string) => {
    switch(category) {
      case "good": return "bg-green-500";
      case "moderate": return "bg-yellow-500";
      case "unhealthy": return "bg-orange-500";
      case "very-unhealthy": return "bg-red-500";
      case "hazardous": return "bg-purple-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {isMobile && onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="text-white hover:bg-white/10"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
          
          {isLoading ? (
            <div className="flex items-center gap-2 text-blue-300">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Getting your location...</span>
            </div>
          ) : airQualityData ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white">{airQualityData.location.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-blue-400" />
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-white">
                    AQI {airQualityData.aqi.value}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${getAqiColor(airQualityData.aqi.category)}`}></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-orange-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Location access required</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
            className="text-white hover:bg-white/10"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
