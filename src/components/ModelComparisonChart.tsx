
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer
} from "recharts";
import { modelMetrics } from "@/utils/mlModels";

type MetricType = "mae" | "rmse" | "r2" | "cvR2Mean";

interface ModelComparisonChartProps {
  className?: string;
  metric?: MetricType;
}

const ModelComparisonChart: React.FC<ModelComparisonChartProps> = ({ 
  className,
  metric = "r2" 
}) => {
  const metricLabels = {
    mae: "Mean Absolute Error (MAE)",
    rmse: "Root Mean Square Error (RMSE)",
    r2: "R² Score",
    cvR2Mean: "Cross-Validation R²"
  };

  const sortedModels = [...modelMetrics.models].sort((a, b) => {
    if (metric === 'mae' || metric === 'rmse') {
      return a[metric] - b[metric]; // Lower is better for error metrics
    }
    return b[metric] - a[metric]; // Higher is better for R² metrics
  });

  const formatValue = (value: number) => {
    if (value < 1) {
      return value.toFixed(2);
    }
    return value.toFixed(1);
  };

  const getBestModel = () => {
    if (metric === 'mae' || metric === 'rmse') {
      return sortedModels[0].name;
    }
    return sortedModels[0].name;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Model Comparison: {metricLabels[metric]}</CardTitle>
        <CardDescription>
          Best performing model: <strong>{getBestModel()}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedModels}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                domain={metric === 'r2' || metric === 'cvR2Mean' ? [0, 1] : ['auto', 'auto']}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                interval={0}
              />
              <Tooltip 
                formatter={(value: number) => [formatValue(value), metricLabels[metric]]} 
                labelFormatter={(name) => `Model: ${name}`}
              />
              <Bar 
                dataKey={metric} 
                fill={(entry) => entry.color as string} // Fix the type issue here
                maxBarSize={40}
              >
                <LabelList 
                  dataKey={metric} 
                  position="right" 
                  formatter={(value: number) => formatValue(value)} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelComparisonChart;
