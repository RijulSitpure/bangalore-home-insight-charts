
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Map, 
  Building, 
  Clock, 
  Activity 
} from "lucide-react";
import {
  AreaChart,
  Area,
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
} from "recharts";
import StatsCard from "@/components/StatsCard";
import { generateMockAreaData, generateMockPriceData, generateMockLocationData } from "@/utils/mockData";

const Dashboard: React.FC = () => {
  const areaData = React.useMemo(() => generateMockAreaData(), []);
  const priceData = React.useMemo(() => generateMockPriceData(), []);
  const locationData = React.useMemo(() => generateMockLocationData(), []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of Bangalore real estate market insights
        </p>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Average Price"
          value="₹6,245/sq.ft"
          description="+12.3% from last month"
          trend="up"
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Available Properties"
          value="8,724"
          description="-2.5% from last month"
          trend="down"
          icon={Home}
          color="blue"
        />
        <StatsCard
          title="Avg. Days on Market"
          value="45 days"
          description="-5 days from last month"
          trend="up"
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Market Activity"
          value="High"
          description="Increased buyer interest"
          trend="up"
          icon={Activity}
          color="indigo"
        />
      </div>
      
      <Tabs defaultValue="price" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="price">Price Trends</TabsTrigger>
          <TabsTrigger value="location">Location Analysis</TabsTrigger>
          <TabsTrigger value="type">Property Types</TabsTrigger>
        </TabsList>
        <TabsContent value="price" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-realestate-accent" />
                  Price Trends (Past 12 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#1e5c97"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <Map className="h-4 w-4 text-realestate-accent" />
                  Price by Area (₹/sq.ft)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={areaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="area" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="price" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="location" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <Map className="h-4 w-4 text-realestate-accent" />
                  Popular Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={locationData}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="location" type="category" />
                      <Tooltip />
                      <Bar dataKey="popularity" fill="#1e5c97" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <Building className="h-4 w-4 text-realestate-accent" />
                  Price Growth by Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={locationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="location" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="growth"
                        stroke="#f97316"
                        fill="#fdba74"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="type" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <Building className="h-4 w-4 text-realestate-accent" />
                  Property Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { type: "Apartment", count: 5842 },
                      { type: "Villa", count: 1254 },
                      { type: "Independent House", count: 3516 },
                      { type: "Plot", count: 2134 },
                      { type: "Builder Floor", count: 1875 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1e5c97" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-realestate-accent" />
                  Price Trend by Property Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", apartment: 6500, villa: 10200, house: 8500 },
                        { month: "Feb", apartment: 6520, villa: 10150, house: 8600 },
                        { month: "Mar", apartment: 6580, villa: 10300, house: 8650 },
                        { month: "Apr", apartment: 6600, villa: 10400, house: 8630 },
                        { month: "May", apartment: 6700, villa: 10450, house: 8700 },
                        { month: "Jun", apartment: 6750, villa: 10500, house: 8750 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="apartment" stroke="#1e5c97" />
                      <Line type="monotone" dataKey="villa" stroke="#f97316" />
                      <Line type="monotone" dataKey="house" stroke="#10b981" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
