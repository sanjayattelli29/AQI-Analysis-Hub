
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, CloudRain, CloudFog, AlertTriangle, AlertOctagon, MapPin, ExternalLink } from "lucide-react";
import { AirQualityData } from "@/utils/types";
import { Button } from "@/components/ui/button";

interface FinalAirQualityProps {
  airQualityData: AirQualityData;
}

const FinalAirQuality: React.FC<FinalAirQualityProps> = ({ airQualityData }) => {
  const [animateIcon, setAnimateIcon] = useState(false);
  
  useEffect(() => {
    // Start animation when component mounts
    setAnimateIcon(true);
    
    // Set up a timer to refresh animation periodically
    const intervalId = setInterval(() => {
      setAnimateIcon(false);
      // Re-enable animation after a brief delay
      setTimeout(() => setAnimateIcon(true), 100);
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const getRecommendation = (category?: string) => {
    switch(category) {
      case "good": 
        return "Air quality is satisfactory, and air pollution poses little or no risk.";
      case "moderate": 
        return "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.";
      case "unhealthy": 
        return "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
      case "very-unhealthy": 
        return "Health alert: The risk of health effects is increased for everyone. Reduce outdoor activities, especially if you experience symptoms.";
      case "hazardous": 
        return "Health warning of emergency conditions: everyone is more likely to be affected. Avoid all outdoor activities.";
      default:
        return "No specific recommendation available based on current data.";
    }
  };
  
  const getAirQualityIcon = () => {
    const category = airQualityData.aqi.category;
    
    switch(category) {
      case "good":
        return <Sun className={`h-20 w-20 text-air-green ${animateIcon ? 'animate-pulse-slow' : ''}`} />;
      case "moderate":
        return <Sun className={`h-20 w-20 text-air-yellow ${animateIcon ? 'animate-pulse-slow' : ''}`} />;
      case "unhealthy":
        return <CloudRain className={`h-20 w-20 text-air-orange ${animateIcon ? 'animate-pulse-slow' : ''}`} />;
      case "very-unhealthy":
        return <CloudFog className={`h-20 w-20 text-air-red ${animateIcon ? 'animate-pulse-slow' : ''}`} />;
      case "hazardous":
        return <AlertOctagon className={`h-20 w-20 text-air-purple ${animateIcon ? 'animate-pulse-slow' : ''}`} />;
      default:
        return <AlertTriangle className={`h-20 w-20 text-muted-foreground ${animateIcon ? 'animate-pulse-slow' : ''}`} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "good": return "bg-green-500";
      case "moderate": return "bg-yellow-500";
      case "unhealthy": return "bg-orange-500";
      case "very-unhealthy": return "bg-red-500";
      case "hazardous": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getAqiLabel = (category: string) => {
    switch(category) {
      case "good": return "Good";
      case "moderate": return "Moderate";
      case "unhealthy": return "Unhealthy";
      case "very-unhealthy": return "Very Unhealthy";
      case "hazardous": return "Hazardous";
      default: return "Unknown";
    }
  };
  
  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in max-w-full mx-auto">
      <CardContent className="p-0">
        {/* Google-style header */}
        <div className="p-4 bg-background border-b">
          <h2 className="text-2xl font-bold flex items-center">
            Air quality
            <span className="ml-2 text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
              {airQualityData.source || "Standard"} AQI
            </span>
          </h2>
          <p className="text-sm text-muted-foreground flex items-center">
            {airQualityData.location.name} - {new Date(airQualityData.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Map and indicator section */}
        <div className="relative">
          {/* Map placeholder with dark theme similar to Google's map */}
          <div className="w-full h-64 bg-[#1e293b] relative overflow-hidden">
            {/* Stylized map grid lines */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`grid-line-v-${i}`} className="border-r border-white/5 h-full"></div>
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`grid-line-h-${i}`} className="border-b border-white/5 w-full"></div>
              ))}
            </div>
            
            {/* Map Pin */}
            <div className="absolute" style={{ 
              top: "50%", 
              left: "50%", 
              transform: "translate(-50%, -50%)" 
            }}>
              <div className="relative">
                {/* AQI indicator pin with category-based color */}
                <div className={`h-16 w-16 rounded-full ${getCategoryColor(airQualityData.aqi.category)} flex items-center justify-center text-white font-bold drop-shadow-lg`}>
                  {airQualityData.aqi.value}
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-white/20 rounded-full animate-pulse-slow"></div>
              </div>
            </div>

            {/* Location label */}
            <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-sm py-1 px-2 rounded flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {airQualityData.location.name}
            </div>

            {/* AQI badge */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-sm py-1 px-3 rounded-full flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${getCategoryColor(airQualityData.aqi.category)}`}></span>
              <span>{getAqiLabel(airQualityData.aqi.category)}</span>
            </div>

            {/* Map controls (decorative) */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              <div className="h-8 w-8 rounded bg-black/60 flex items-center justify-center text-white">+</div>
              <div className="h-8 w-8 rounded bg-black/60 flex items-center justify-center text-white">−</div>
            </div>
          </div>

          {/* View map button */}
          <div className="w-full border-t border-b p-3">
            <Button variant="ghost" className="w-full flex justify-center items-center gap-2">
              View on Google Maps
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* AQI scale */}
        <div className="px-4 pt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">
              {airQualityData.location.name} Air Quality Index (AQI)
            </p>
            <div className="flex items-center gap-1 text-xs">
              <span className={`h-2 w-2 rounded-full ${getCategoryColor(airQualityData.aqi.category)}`}></span>
              <span className="font-medium">{airQualityData.aqi.value} - {getAqiLabel(airQualityData.aqi.category)}</span>
            </div>
          </div>
          
          {/* Color gradient scale */}
          <div className="w-full h-2 rounded-full mb-2 flex overflow-hidden">
            <div className="bg-green-500 h-full flex-1"></div>
            <div className="bg-yellow-500 h-full flex-1"></div>
            <div className="bg-orange-500 h-full flex-1"></div>
            <div className="bg-red-500 h-full flex-1"></div>
            <div className="bg-purple-500 h-full flex-1"></div>
          </div>
          
          {/* Scale numbers */}
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>500</span>
          </div>
          
          {/* AQI label */}
          <div className="flex justify-between w-full text-xs text-muted-foreground mt-1">
            <span>Good</span>
            <span className="ml-6">Moderate</span>
            <span className="mx-2">Unhealthy</span>
            <span className="mr-5">Very Unhealthy</span>
            <span>Hazardous</span>
          </div>
        </div>

        {/* Station info - similar to Google's display */}
        <div className="px-4 pb-6 mt-4">
          <div className="flex items-start gap-4">
            <div className="bg-background border rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              <span className="font-bold">{airQualityData.source?.[0] || "A"}</span>
            </div>
            <div>
              <p className="font-semibold">{airQualityData.location.name} - {airQualityData.source || "Standard"}</p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {airQualityData.location.coordinates.latitude.toFixed(4)}, {airQualityData.location.coordinates.longitude.toFixed(4)}
                </p>
              </div>
              <div className="flex items-center mt-2">
                <div className={`h-3 w-3 rounded-full ${getCategoryColor(airQualityData.aqi.category)} mr-2`}></div>
                <span className="font-bold">{airQualityData.aqi.value} AQI</span>
                <span className="mx-2">•</span>
                <span>{airQualityData.aqi.description}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>{getRecommendation(airQualityData.aqi.category)}</p>
            <p className="mt-2 text-xs">
              Last updated: {new Date(airQualityData.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalAirQuality;
