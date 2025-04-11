
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { modelMetrics } from '@/utils/mlModels';

interface ModelComparisonChartProps {
  metric: 'r2' | 'mae' | 'rmse' | 'cvR2Mean';
}

const ModelComparisonChart: React.FC<ModelComparisonChartProps> = ({ metric }) => {
  const metricLabels = {
    r2: 'R² Score',
    mae: 'Mean Absolute Error',
    rmse: 'Root Mean Squared Error',
    cvR2Mean: 'Cross-Validation R² Mean'
  };

  const metricKeys = {
    r2: 'r2',
    mae: 'mae',
    rmse: 'rmse',
    cvR2Mean: 'cvR2Mean'
  };

  // Format the data for the chart
  const chartData = modelMetrics.models.map(model => ({
    name: model.name,
    value: model[metricKeys[metric]],
    color: model.color
  }));

  // Sort the models
  const sortedData = [...chartData].sort((a, b) => {
    // For R2 and CV R2, higher is better
    if (metric === 'r2' || metric === 'cvR2Mean') {
      return b.value - a.value;
    }
    // For MAE and RMSE, lower is better
    return a.value - b.value;
  });

  // Get the best model for this metric
  const bestModel = sortedData[0]?.name || "None";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Model Performance: {metricLabels[metric]}</span>
          <span className="text-sm font-normal text-muted-foreground">
            Best: <span className="font-semibold text-primary">{bestModel}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sortedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 70,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => value.toFixed(4)}
              labelFormatter={(name) => `Model: ${name}`}
            />
            <Bar 
              dataKey="value" 
              name={metricLabels[metric]}
              radius={[4, 4, 0, 0]}
              fill={(entry) => entry.color}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ModelComparisonChart;
