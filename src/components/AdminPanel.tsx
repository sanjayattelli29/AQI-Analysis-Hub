import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, BarChart2, LineChart, PieChart, Activity, Wind, Thermometer, Database } from "lucide-react";

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  return (
    <div className="min-h-screen w-full pb-6 animate-gradient-shift">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AQI Analysis Dashboard
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Logout
          </Button>
        </div>

        <div className="glass-card p-8 rounded-xl">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-2xl font-semibold text-white">
              Air Quality Analysis Dashboard
            </h2>
            <p className="text-blue-300 max-w-2xl mx-auto">
              Access our advanced air quality analysis tools and machine learning models for comprehensive air quality assessment and predictions
            </p>
            
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => window.open('https://air-stream-20-developwithsanjay.streamlit.app/', '_blank')}
                className="bg-blue-500 hover:bg-blue-600 px-8"
                size="lg"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Open Analysis Dashboard
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {/* Model Performance Section */}
            <div className="glass-card p-6 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Model Performance</h3>
              </div>
              <p className="text-blue-300 text-sm mb-4">
                Compare performance metrics across multiple models including:
              </p>
              <ul className="text-blue-300 text-sm list-disc list-inside space-y-1">
                <li>Naive Bayes</li>
                <li>KNN Classifier</li>
                <li>SVM</li>
                <li>Random Forest</li>
              </ul>
            </div>

            {/* Feature Analysis Section */}
            <div className="glass-card p-6 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <LineChart className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Feature Analysis</h3>
              </div>
              <p className="text-blue-300 text-sm mb-4">
                Comprehensive analysis of key air quality parameters:
              </p>
              <ul className="text-blue-300 text-sm list-disc list-inside space-y-1">
                <li>PM2.5 and PM10 levels</li>
                <li>Gas concentrations (NO, NO2, SO2)</li>
                <li>Weather impact analysis</li>
                <li>Feature importance ranking</li>
              </ul>
            </div>

            {/* ROC Analysis Section */}
            <div className="glass-card p-6 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">ROC Analysis</h3>
              </div>
              <p className="text-blue-300 text-sm mb-4">
                Detailed ROC curve analysis showing:
              </p>
              <ul className="text-blue-300 text-sm list-disc list-inside space-y-1">
                <li>Model accuracy comparison</li>
                <li>True/False positive rates</li>
                <li>AUC scores</li>
                <li>Performance thresholds</li>
              </ul>
            </div>

            {/* Weather Parameters */}
            <div className="glass-card p-6 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Wind className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Weather Impact</h3>
              </div>
              <p className="text-blue-300 text-sm mb-4">
                Analysis of weather parameters:
              </p>
              <ul className="text-blue-300 text-sm list-disc list-inside space-y-1">
                <li>Wind speed and direction</li>
                <li>Humidity levels</li>
                <li>Solar radiation</li>
                <li>Rainfall patterns</li>
              </ul>
            </div>

            {/* Real-time Monitoring */}
            <div className="glass-card p-6 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Real-time Analysis</h3>
              </div>
              <p className="text-blue-300 text-sm mb-4">
                Live monitoring capabilities:
              </p>
              <ul className="text-blue-300 text-sm list-disc list-inside space-y-1">
                <li>Current AQI levels</li>
                <li>Trend analysis</li>
                <li>Predictive alerts</li>
                <li>Historical comparisons</li>
              </ul>
            </div>

            {/* Technical Details */}
            <div className="glass-card p-6 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Technical Stack</h3>
              </div>
              <p className="text-blue-300 text-sm mb-4">
                Built with advanced technologies:
              </p>
              <ul className="text-blue-300 text-sm list-disc list-inside space-y-1">
                <li>Streamlit frontend</li>
                <li>Flask API backend</li>
                <li>Scikit-learn models</li>
                <li>Real-time data processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
