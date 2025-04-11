
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModelComparisonChart from "@/components/ModelComparisonChart";
import { modelMetrics } from "@/utils/mlModels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Scatter,
  ScatterChart,
  ZAxis
} from "recharts";

const Comparison: React.FC = () => {
  const [metric, setMetric] = useState<'mae' | 'rmse' | 'r2' | 'cvR2Mean'>('r2');
  
  const formatValue = (value: number) => {
    return value < 1 ? value.toFixed(3) : value.toFixed(2);
  };

  const mapMetricsForRadarChart = () => {
    const metrics = ["mae", "rmse", "r2", "cvR2Mean"];
    
    // Normalize values between 0-1 for radar chart
    // For MAE/RMSE, lower is better so we invert the scale
    const maxMae = Math.max(...modelMetrics.models.map(m => m.mae));
    const maxRmse = Math.max(...modelMetrics.models.map(m => m.rmse));
    
    return modelMetrics.models.map(model => ({
      name: model.name,
      MAE: 1 - (model.mae / maxMae), // Invert so higher is better
      RMSE: 1 - (model.rmse / maxRmse), // Invert so higher is better
      "R²": model.r2,
      "CV R²": model.cvR2Mean,
      color: model.color
    }));
  };
  
  const radarData = mapMetricsForRadarChart();
  
  const getScatterData = () => {
    // Create data for RMSE vs R² scatter plot
    return modelMetrics.models.map(model => ({
      name: model.name,
      rmse: model.rmse,
      r2: model.r2,
      mae: model.mae,
      color: model.color,
      size: 20
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Model Comparison</h1>
        <p className="text-muted-foreground">
          Compare performance metrics of different machine learning models
        </p>
      </div>
      
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="charts">Visual Comparison</TabsTrigger>
          <TabsTrigger value="radar">Radar Analysis</TabsTrigger>
          <TabsTrigger value="table">Metrics Table</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ModelComparisonChart metric="r2" />
            <ModelComparisonChart metric="mae" />
            <ModelComparisonChart metric="rmse" />
            <ModelComparisonChart metric="cvR2Mean" />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>RMSE vs R² Score</CardTitle>
              <CardDescription>
                Lower RMSE and higher R² indicate better models
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 10, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="rmse" 
                    name="RMSE"
                    label={{ value: 'RMSE', position: 'bottom', offset: 0 }} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="r2" 
                    name="R²"
                    domain={[0, 1]} 
                    label={{ value: 'R² Score', angle: -90, position: 'left' }} 
                  />
                  <ZAxis range={[60, 60]} />
                  <Tooltip 
                    formatter={(value: number) => [value.toFixed(3)]} 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p>RMSE: {data.rmse.toFixed(2)}</p>
                            <p>R²: {data.r2.toFixed(3)}</p>
                            <p>MAE: {data.mae.toFixed(2)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  {getScatterData().map((entry, index) => (
                    <Scatter 
                      key={index} 
                      name={entry.name} 
                      data={[entry]} 
                      fill={entry.color} 
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Radar</CardTitle>
              <CardDescription>
                Higher values indicate better performance on all metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={90} domain={[0, 1]} />
                  
                  {["MAE", "RMSE", "R²", "CV R²"].map((dataKey, index) => (
                    <Radar
                      key={dataKey}
                      name={dataKey}
                      dataKey={dataKey}
                      stroke={index === 0 ? "#8884d8" : 
                              index === 1 ? "#82ca9d" : 
                              index === 2 ? "#ffc658" : "#ff8042"}
                      fill={index === 0 ? "#8884d8" : 
                             index === 1 ? "#82ca9d" : 
                             index === 2 ? "#ffc658" : "#ff8042"}
                      fillOpacity={0.6}
                    />
                  ))}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Metrics</CardTitle>
              <CardDescription>
                Detailed comparison of all model metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>MAE</TableHead>
                    <TableHead>RMSE</TableHead>
                    <TableHead>R²</TableHead>
                    <TableHead>CV R² Mean</TableHead>
                    <TableHead>CV R² Std</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelMetrics.models.map(model => (
                    <TableRow key={model.name}>
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell>{formatValue(model.mae)}</TableCell>
                      <TableCell>{formatValue(model.rmse)}</TableCell>
                      <TableCell>{formatValue(model.r2)}</TableCell>
                      <TableCell>{formatValue(model.cvR2Mean)}</TableCell>
                      <TableCell>{formatValue(model.cvR2Std)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Comparison;
