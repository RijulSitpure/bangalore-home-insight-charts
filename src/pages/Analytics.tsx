
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Map,
  TrendingUp,
  Hotel,
  Home,
  Building
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";

const COLORS = ["#1e5c97", "#0ea5e9", "#f97316", "#14b8a6", "#8b5cf6", "#ec4899"];

const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>("1y");
  
  const priceHistoryData = {
    "3m": [
      { month: "Jan", price: 6150 },
      { month: "Feb", price: 6200 },
      { month: "Mar", price: 6245 }
    ],
    "6m": [
      { month: "Oct", price: 5950 },
      { month: "Nov", price: 6000 },
      { month: "Dec", price: 6050 },
      { month: "Jan", price: 6150 },
      { month: "Feb", price: 6200 },
      { month: "Mar", price: 6245 }
    ],
    "1y": [
      { month: "Apr", price: 5700 },
      { month: "May", price: 5750 },
      { month: "Jun", price: 5800 },
      { month: "Jul", price: 5850 },
      { month: "Aug", price: 5900 },
      { month: "Sep", price: 5950 },
      { month: "Oct", price: 5950 },
      { month: "Nov", price: 6000 },
      { month: "Dec", price: 6050 },
      { month: "Jan", price: 6150 },
      { month: "Feb", price: 6200 },
      { month: "Mar", price: 6245 }
    ]
  };
  
  const areaDistributionData = [
    { name: "Whitefield", value: 18 },
    { name: "Electronic City", value: 15 },
    { name: "HSR Layout", value: 12 },
    { name: "Koramangala", value: 11 },
    { name: "Indiranagar", value: 10 },
    { name: "Others", value: 34 }
  ];
  
  const propertyTypeData = [
    { name: "Apartment", value: 65 },
    { name: "Villa", value: 8 },
    { name: "Independent House", value: 15 },
    { name: "Builder Floor", value: 7 },
    { name: "Plot", value: 5 }
  ];
  
  const bhkDistributionData = [
    { name: "1 BHK", value: 15 },
    { name: "2 BHK", value: 45 },
    { name: "3 BHK", value: 30 },
    { name: "4+ BHK", value: 10 }
  ];
  
  const bedroomPriceData = [
    { name: "1 BHK", price: 4200 },
    { name: "2 BHK", price: 5500 },
    { name: "3 BHK", price: 6800 },
    { name: "4 BHK", price: 8500 },
    { name: "5+ BHK", price: 10200 }
  ];
  
  const demandSupplyData = [
    { name: "Whitefield", demand: 85, supply: 80 },
    { name: "Electronic City", demand: 75, supply: 85 },
    { name: "HSR Layout", demand: 90, supply: 70 },
    { name: "Koramangala", demand: 95, supply: 65 },
    { name: "Indiranagar", demand: 90, supply: 60 }
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Market Analytics</h1>
        <p className="text-muted-foreground">
          Detailed analytics of the Bangalore real estate market
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-realestate-accent" />
              Price Trend Analysis
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Timeframe:</span>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={priceHistoryData[timeframe as keyof typeof priceHistoryData]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[(dataMin: number) => dataMin * 0.95, (dataMax: number) => dataMax * 1.05]} />
                <Tooltip formatter={(value) => [`₹${value}/sq.ft`, "Average Price"]} />
                <Legend />
                <Area type="monotone" dataKey="price" stroke="#1e5c97" fill="#1e5c97" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center gap-2">
              <Map className="h-4 w-4 text-realestate-accent" />
              Area Distribution
            </CardTitle>
            <CardDescription>
              Property distribution across localities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="chart-container h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={areaDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {areaDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center gap-2">
              <Building className="h-4 w-4 text-realestate-accent" />
              Property Type Distribution
            </CardTitle>
            <CardDescription>
              Types of properties in the market
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="chart-container h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center gap-2">
              <Home className="h-4 w-4 text-realestate-accent" />
              BHK Distribution
            </CardTitle>
            <CardDescription>
              Distribution by number of bedrooms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="chart-container h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bhkDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bhkDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="bySize" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="bySize">By Size</TabsTrigger>
          <TabsTrigger value="byLocation">By Location</TabsTrigger>
          <TabsTrigger value="demandSupply">Demand vs Supply</TabsTrigger>
        </TabsList>
        <TabsContent value="bySize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5 text-realestate-accent" />
                Price by Bedroom Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bedroomPriceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}/sq.ft`, "Average Price"]} />
                    <Bar dataKey="price" fill="#1e5c97" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="byLocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-realestate-accent" />
                Price Comparison by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Whitefield", price: 6800 },
                      { name: "Electronic City", price: 5500 },
                      { name: "HSR Layout", price: 10500 },
                      { name: "Koramangala", price: 13200 },
                      { name: "Indiranagar", price: 12500 },
                      { name: "Jayanagar", price: 9800 },
                      { name: "Marathahalli", price: 7200 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}/sq.ft`, "Average Price"]} />
                    <Bar dataKey="price" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="demandSupply" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-realestate-accent" />
                Demand vs Supply by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={demandSupplyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="demand" fill="#1e5c97" name="Demand Score" />
                    <Bar dataKey="supply" fill="#f97316" name="Supply Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
