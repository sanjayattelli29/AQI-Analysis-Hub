
import React from "react";
import { AlertCircle, ThumbsUp, ThumbsDown, BadgeInfo, Activity, BarChart, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { METRICS_INFO } from "@/utils/types";
import ModelPredictionsTable from "./ModelPredictionsTable";

interface ModelPrediction {
  Model: string;
  "Predicted Efficiency Category": string;
}

interface ModelMetrics {
  [key: string]: {
    Accuracy: number;
    Precision: number;
    Recall: number;
    "F1-Score": number;
  };
}

interface AQIAnalysisResultProps {
  result: {
    aqiScore: number;
    classification: { label: string; color: string };
    similarities?: Array<{ id: number; similarity: number; data: any }>;
    bestMatch?: { id: number; similarity: number; data: any };
    worstMatch?: { id: number; similarity: number; data: any };
    metrics: Record<string, number>;
    apiResponse?: {
      predictions: ModelPrediction[];
      metrics: ModelMetrics;
      final_recommendation: string;
    };
  };
}

// Define a more appropriate type for thresholds
type ThresholdLevel = {
  range: [number, number];
  label: string;
};

type MetricThresholds = {
  [key: string]: ThresholdLevel[];
};

const AQIAnalysisResult: React.FC<AQIAnalysisResultProps> = ({ result }) => {
  const getAQIColor = (score: number): string => {
    if (score <= 50) return "bg-green-500";
    if (score <= 100) return "bg-yellow-500";
    if (score <= 150) return "bg-orange-500";
    if (score <= 200) return "bg-red-500";
    if (score <= 300) return "bg-purple-500";
    return "bg-rose-600";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 p-6 glass-card border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">AQI Score Analysis</h3>
          </div>
          
          <div className="flex flex-col items-center justify-center pt-4">
            <div className="relative w-40 h-40 mb-6">
              <div className="absolute inset-0 rounded-full bg-white/5 border-4 border-white/10 flex items-center justify-center">
                <div className={`absolute inset-2 rounded-full ${getAQIColor(result.aqiScore)} opacity-20`}></div>
                <span className="text-4xl font-bold text-white">{result.aqiScore}</span>
              </div>
            </div>
            
            <h4 className={`text-2xl font-bold ${result.classification.color} mb-2`}>
              {result.classification.label}
            </h4>
            
            <p className="text-center text-blue-300 text-sm max-w-md">
              The calculated Air Quality Index based on provided metrics and advanced analysis
              with machine learning algorithms.
            </p>
          </div>
        </Card>
        
        <Card className="flex-1 p-6 glass-card border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <BadgeInfo className="h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Key Findings</h3>
          </div>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-0.5">
                <ThumbsUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Primary Concerns</h4>
                <p className="text-sm text-blue-300">
                  {getPrimaryConcerns(result.metrics)}
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="mt-0.5">
                <BarChart className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Input Values</h4>
                <p className="text-sm text-blue-300">
                  PM2.5: {result.metrics.pm25?.toFixed(2)}, 
                  PM10: {result.metrics.pm10?.toFixed(2)}, 
                  NO2: {result.metrics.no2?.toFixed(2)}, 
                  SO2: {result.metrics.so2?.toFixed(2)}, 
                  O3: {result.metrics.o3?.toFixed(2)}
                </p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
      
      {result.apiResponse && (
        <Card className="p-6 glass-card border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-5 w-5 text-yellow-500" />
            <h3 className="text-xl font-semibold text-white">AI Model Analysis</h3>
          </div>
          <ModelPredictionsTable 
            predictions={result.apiResponse.predictions}
            metrics={result.apiResponse.metrics}
            recommendation={result.apiResponse.final_recommendation}
          />
        </Card>
      )}
      
      <Card className="p-6 glass-card border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <BarChart className="h-5 w-5 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Input Metrics Details</h3>
        </div>
        
        <div className="rounded-md border border-white/10 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5">
                <TableHead className="text-white">Metric</TableHead>
                <TableHead className="text-white">Value</TableHead>
                <TableHead className="text-white">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(result.metrics).map(([key, value]) => {
                const metricInfo = METRICS_INFO.find(m => m.key === key);
                return (
                  <TableRow key={key} className="hover:bg-white/5">
                    <TableCell className="font-medium text-blue-300">
                      {metricInfo?.label || key}
                    </TableCell>
                    <TableCell>{typeof value === 'number' ? value.toFixed(2) : value}</TableCell>
                    <TableCell>{getMetricImpact(key, value)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

// Utility functions for analysis
const getPrimaryConcerns = (metrics: Record<string, number>): string => {
  const concerns = [];
  
  // Check PM2.5
  if (metrics.pm25 > 35) {
    concerns.push("High PM2.5 levels");
  }
  
  // Check PM10
  if (metrics.pm10 > 150) {
    concerns.push("Elevated PM10 concentration");
  }
  
  // Check Ozone
  if (metrics.o3 > 70) {
    concerns.push("Unhealthy Ozone levels");
  }
  
  // Check NO2
  if (metrics.no2 > 100) {
    concerns.push("High NO2 concentration");
  }
  
  if (concerns.length === 0) {
    return "No significant pollutant concerns detected";
  }
  
  return concerns.join(", ");
};

const getMetricImpact = (metric: string, value: number): JSX.Element => {
  let impact = "Neutral";
  let color = "text-blue-300";
  
  // Define thresholds for different metrics using the new type
  const thresholds: MetricThresholds = {
    pm25: [
      { range: [0, 12], label: "Low" }, 
      { range: [12.1, 35.4], label: "Moderate" }, 
      { range: [35.5, 500], label: "High" }
    ],
    pm10: [
      { range: [0, 54], label: "Low" }, 
      { range: [55, 154], label: "Moderate" }, 
      { range: [155, 500], label: "High" }
    ],
    o3: [
      { range: [0, 0.054], label: "Low" }, 
      { range: [0.055, 0.07], label: "Moderate" }, 
      { range: [0.071, 0.5], label: "High" }
    ],
    no2: [
      { range: [0, 0.053], label: "Low" }, 
      { range: [0.054, 0.1], label: "Moderate" }, 
      { range: [0.101, 2], label: "High" }
    ],
    so2: [
      { range: [0, 0.035], label: "Low" }, 
      { range: [0.036, 0.075], label: "Moderate" }, 
      { range: [0.076, 1], label: "High" }
    ],
    co: [
      { range: [0, 4.4], label: "Low" }, 
      { range: [4.5, 9.4], label: "Moderate" }, 
      { range: [9.5, 50], label: "High" }
    ]
  };
  
  // Set impact based on thresholds if available for the metric
  if (thresholds[metric]) {
    for (const threshold of thresholds[metric]) {
      const [min, max] = threshold.range;
      const level = threshold.label;
      
      if (value >= min && value <= max) {
        impact = level;
        
        if (impact === "Low") {
          color = "text-green-500";
        } else if (impact === "Moderate") {
          color = "text-yellow-500";
        } else if (impact === "High") {
          color = "text-red-500";
        }
        
        break;
      }
    }
  }
  
  return <span className={color}>{impact}</span>;
};

export default AQIAnalysisResult;
