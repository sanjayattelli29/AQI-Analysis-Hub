
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { colorMap } from "@/utils/types";
import { format, subDays } from "date-fns";

interface AirQualityChartProps {
  title: string;
  data: Array<{ date: string; value: number }>;
  color: string;
  unit: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-2 text-xs">
        <p className="font-medium">{label}</p>
        <p className="text-air-blue-light">
          Value: {payload[0].value} {payload[0].payload.unit}
        </p>
      </div>
    );
  }

  return null;
};

const AirQualityChart: React.FC<AirQualityChartProps> = ({ title, data, color, unit }) => {
  // Generate demo data if not provided
  const chartData = data.length > 0 
    ? data.map(item => ({ ...item, unit }))
    : Array.from({ length: 24 }, (_, i) => {
        const date = subDays(new Date(), 1);
        date.setHours(i);
        return {
          date: format(date, 'HH:mm'),
          value: Math.random() * 50 + 10,
          unit
        };
      });

  const colorKey = color in colorMap ? color : "air-blue";
  
  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="p-2 pb-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Badge variant="outline" className="bg-transparent text-xs px-1">
          Last 24h
        </Badge>
      </CardHeader>
      <CardContent className="p-2">
        <div className="mini-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id={`gradient-${colorKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--${colorKey}-light, #4facfe)`} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={`var(--${colorKey}-dark, #0c65d8)`} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-chart-grid" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#999', fontSize: 8 }}
                tickFormatter={(value) => value.toString().split(' ')[0]} // Show just hours
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#999', fontSize: 8 }}
                width={20}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={`var(--${colorKey}-light, #4facfe)`}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, fill: `var(--${colorKey}, #2b8af9)` }}
                fillOpacity={1}
                fill={`url(#gradient-${colorKey})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityChart;
