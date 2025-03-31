
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Award, BarChart } from "lucide-react";

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

interface ModelPredictionsTableProps {
  predictions: ModelPrediction[];
  metrics: ModelMetrics;
  recommendation: string;
}

const ModelPredictionsTable: React.FC<ModelPredictionsTableProps> = ({ 
  predictions, 
  metrics, 
  recommendation 
}) => {
  if (!predictions || predictions.length === 0) {
    return <div className="text-center py-10 text-blue-300">No predictions available</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="h-4 w-4 text-blue-400" />
          <h3 className="text-lg font-medium text-white">Model Predictions</h3>
        </div>
        
        <div className="rounded-md border border-white/10 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5">
                <TableHead className="text-white">Model</TableHead>
                <TableHead className="text-white">Predicted Efficiency Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((prediction, index) => (
                <TableRow key={index} className="hover:bg-white/5">
                  <TableCell className="font-medium text-blue-300">
                    {prediction.Model}
                  </TableCell>
                  <TableCell>
                    <span className={getPredictionColor(prediction["Predicted Efficiency Category"])}>
                      {prediction["Predicted Efficiency Category"]}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="h-4 w-4 text-blue-400" />
          <h3 className="text-lg font-medium text-white">Model Performance Metrics</h3>
        </div>
        
        <div className="rounded-md border border-white/10 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5">
                <TableHead className="text-white">Model</TableHead>
                <TableHead className="text-white">Accuracy</TableHead>
                <TableHead className="text-white">Precision</TableHead>
                <TableHead className="text-white">Recall</TableHead>
                <TableHead className="text-white">F1-Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(metrics).map(([model, modelMetrics], index) => (
                <TableRow key={index} className="hover:bg-white/5">
                  <TableCell className="font-medium text-blue-300">
                    {model}
                  </TableCell>
                  <TableCell>
                    {(modelMetrics.Accuracy * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    {modelMetrics.Precision.toFixed(3)}
                  </TableCell>
                  <TableCell>
                    {modelMetrics.Recall.toFixed(3)}
                  </TableCell>
                  <TableCell>
                    {modelMetrics["F1-Score"].toFixed(3)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-medium text-white">Final Recommendation</h3>
        </div>
        
        <p className="text-blue-300">{recommendation}</p>
      </div>
    </div>
  );
};

// Helper function to color code prediction categories
const getPredictionColor = (category: string): string => {
  if (category.toLowerCase().includes('high')) {
    return 'text-green-500';
  } else if (category.toLowerCase().includes('medium')) {
    return 'text-yellow-500';
  } else if (category.toLowerCase().includes('low')) {
    return 'text-red-500';
  }
  return 'text-blue-300';
};

export default ModelPredictionsTable;
