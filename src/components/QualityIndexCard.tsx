
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Thermometer, 
  Droplet, 
  Wind, 
  Cloud, 
  Sun, 
  CloudRain, 
  Compass, 
  Factory, 
  Beaker,
  MapPin
} from "lucide-react";
import { MetricInfo, MetricValue, colorMap } from "@/utils/types";
import { cn } from "@/lib/utils";

interface QualityIndexCardProps {
  metricInfo: MetricInfo;
  value: MetricValue;
}

const QualityIndexCard: React.FC<QualityIndexCardProps> = ({ metricInfo, value }) => {
  const { key, label, icon, colorKey } = metricInfo;
  const colorClass = colorMap[colorKey] || "air-blue";
  
  // Calculate quality percentage based on category
  const getQualityPercentage = (category?: string) => {
    switch(category) {
      case "good": return 90;
      case "moderate": return 70;
      case "unhealthy": return 40;
      case "very-unhealthy": return 20;
      case "hazardous": return 10;
      default: return 50;
    }
  };

  const qualityPercentage = getQualityPercentage(value.category);
  
  // Get color based on quality
  const getQualityColor = (percentage: number) => {
    if (percentage >= 80) return "green-500";
    if (percentage >= 60) return "yellow-500";
    if (percentage >= 40) return "orange-500";
    if (percentage >= 20) return "red-500";
    return "purple-500";
  };
  
  const qualityColor = getQualityColor(qualityPercentage);

  const getIcon = () => {
    switch (icon) {
      case "thermometer": return <Thermometer className={`h-5 w-5 text-${colorClass}`} />;
      case "droplet": return <Droplet className={`h-5 w-5 text-${colorClass}`} />;
      case "wind": return <Wind className={`h-5 w-5 text-${colorClass}`} />;
      case "cloud": return <Cloud className={`h-5 w-5 text-${colorClass}`} />;
      case "sun": return <Sun className={`h-5 w-5 text-${colorClass}`} />;
      case "cloud-rain": return <CloudRain className={`h-5 w-5 text-${colorClass}`} />;
      case "compass": return <Compass className={`h-5 w-5 text-${colorClass}`} />;
      case "factory": return <Factory className={`h-5 w-5 text-${colorClass}`} />;
      case "flask": return <Beaker className={`h-5 w-5 text-${colorClass}`} />;
      case "particulate": return (
        <div className={`flex items-center justify-center h-5 w-5 text-${colorClass}`}>
          <div className="relative">
            <div className="absolute top-0 left-0 w-3 h-3 rounded-full opacity-50 bg-current"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full opacity-70 bg-current"></div>
          </div>
        </div>
      );
      default: return <div className={`h-5 w-5 rounded-full bg-${colorClass}`}></div>;
    }
  };

  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in">
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          {getIcon()}
          {label}
        </CardTitle>
        <div className={`text-xs font-medium px-2 py-1 rounded-full bg-${qualityColor}/20 text-${qualityColor}`}>
          {value.category && value.category.charAt(0).toUpperCase() + value.category.slice(1)}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-baseline mb-2">
          <span className={cn("metric-value", `metric-category-${value.category}`)}>
            {typeof value.value === 'number' ? value.value.toFixed(1) : value.value}
          </span>
          <span className="metric-unit">{value.unit}</span>
        </div>
        
        {/* Google-style AQI scale visualization */}
        <div className="w-full bg-secondary/30 rounded-full h-2.5 mt-4 overflow-hidden">
          <div 
            className={`bg-${qualityColor} h-full rounded-full transition-all duration-1000 ease-in-out`}
            style={{ width: `${qualityPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
        
        {/* Enhanced color scale indicator with larger height for better visibility */}
        <div className="w-full h-3 rounded-full mt-2 flex overflow-hidden">
          <div className="bg-purple-500 h-full flex-1"></div>
          <div className="bg-red-500 h-full flex-1"></div>
          <div className="bg-orange-500 h-full flex-1"></div>
          <div className="bg-yellow-500 h-full flex-1"></div>
          <div className="bg-green-500 h-full flex-1"></div>
        </div>
        
        {/* Location indicator for Google-like appearance */}
        {key === "pm25" && (
          <div className="mt-3 flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span>From nearest monitoring station</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QualityIndexCard;
