
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info, Thermometer, Droplet, Wind, Cloud, Sun, CloudRain, Compass, Factory, Beaker } from "lucide-react";
import { MetricInfo, MetricValue, colorMap } from "@/utils/types";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  metricInfo: MetricInfo;
  value: MetricValue;
  historical?: Array<{ date: string; value: number }>;
}

const MetricCard: React.FC<MetricCardProps> = ({ metricInfo, value, historical }) => {
  const { key, label, description, icon, unit, colorKey } = metricInfo;
  const colorClass = colorMap[colorKey] || "air-blue";
  
  // Function to determine category class based on value and metric
  const getCategoryClass = (value: MetricValue) => {
    if (!value.category) return "";
    return `metric-category-${value.category}`;
  };

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="cursor-help">
                <Info className="h-3 w-3 mr-1" />
                Info
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-baseline">
          <span className={cn("metric-value", getCategoryClass(value))}>
            {typeof value.value === 'number' ? value.value.toFixed(1) : value.value}
          </span>
          <span className="metric-unit">{value.unit}</span>
        </div>
        
        {historical && historical.length > 0 && (
          <div className="h-16 mt-4">
            <div className="flex h-full items-end space-x-1">
              {historical.map((data, index) => {
                const maxValue = Math.max(...historical.map(d => d.value));
                const heightPercentage = (data.value / maxValue) * 100;
                
                return (
                  <div 
                    key={index} 
                    className="group relative flex-1 transition-all duration-500"
                  >
                    <div 
                      className={`absolute bottom-0 w-full bg-${colorClass}/60 rounded-t transition-all duration-300 group-hover:bg-${colorClass}`}
                      style={{ height: `${heightPercentage}%` }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="absolute inset-0" />
                          <TooltipContent>
                            <p>
                              <span className="font-medium">{new Date(data.date).toLocaleDateString()}</span>: {data.value.toFixed(1)} {value.unit}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
