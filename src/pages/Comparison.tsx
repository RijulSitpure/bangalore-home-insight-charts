
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, BarChart3, TrendingUp, MapPin } from "lucide-react";
import {
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { cn } from "@/lib/utils";

const Comparison: React.FC = () => {
  const [location1, setLocation1] = useState<string>("Whitefield");
  const [location2, setLocation2] = useState<string>("Electronic City");
  const [comparisonType, setComparisonType] = useState<string>("location");
  
  const locationData = {
    "Whitefield": {
      avgPrice: 6800,
      priceRange: "6,500 - 7,200",
      growth: 12.5,
      connectivity: 75,
      amenities: 80,
      schools: 70,
      hospitals: 65,
      retail: 80
    },
    "Electronic City": {
      avgPrice: 5500,
      priceRange: "5,200 - 5,900",
      growth: 8.2,
      connectivity: 70,
      amenities: 75,
      schools: 65,
      hospitals: 60,
      retail: 75
    },
    "Indiranagar": {
      avgPrice: 12500,
      priceRange: "11,800 - 13,500",
      growth: 9.8,
      connectivity: 95,
      amenities: 95,
      schools: 85,
      hospitals: 90,
      retail: 95
    },
    "Koramangala": {
      avgPrice: 13200,
      priceRange: "12,500 - 14,000",
      growth: 10.2,
      connectivity: 90,
      amenities: 95,
      schools: 90,
      hospitals: 85,
      retail: 95
    },
    "HSR Layout": {
      avgPrice: 10500,
      priceRange: "9,800 - 11,200",
      growth: 11.5,
      connectivity: 85,
      amenities: 90,
      schools: 85,
      hospitals: 80,
      retail: 90
    },
    "Jayanagar": {
      avgPrice: 9800,
      priceRange: "9,200 - 10,500",
      growth: 7.5,
      connectivity: 80,
      amenities: 85,
      schools: 90,
      hospitals: 85,
      retail: 85
    },
    "Marathahalli": {
      avgPrice: 7200,
      priceRange: "6,800 - 7,600",
      growth: 9.0,
      connectivity: 75,
      amenities: 70,
      schools: 65,
      hospitals: 60,
      retail: 75
    }
  };
  
  const propertyTypeData = {
    "Apartment": {
      avgPrice: 6800,
      priceRange: "5,500 - 8,200",
      growth: 8.5,
      demand: 85,
      supply: 80,
      roi: 5.2,
      maintenance: "Medium"
    },
    "Villa": {
      avgPrice: 9500,
      priceRange: "8,200 - 12,500",
      growth: 7.2,
      demand: 65,
      supply: 40,
      roi: 4.5,
      maintenance: "High"
    },
    "Independent House": {
      avgPrice: 8200,
      priceRange: "7,000 - 9,500",
      growth: 6.8,
      demand: 70,
      supply: 50,
      roi: 4.8,
      maintenance: "High"
    },
    "Builder Floor": {
      avgPrice: 7500,
      priceRange: "6,800 - 8,200",
      growth: 7.5,
      demand: 75,
      supply: 60,
      roi: 5.0,
      maintenance: "Medium"
    },
    "Plot": {
      avgPrice: 5500,
      priceRange: "4,500 - 7,000",
      growth: 12.5,
      demand: 60,
      supply: 45,
      roi: 8.5,
      maintenance: "Low"
    }
  };
  
  const getComparisonItems = () => {
    if (comparisonType === "location") {
      return Object.keys(locationData);
    } else {
      return Object.keys(propertyTypeData);
    }
  };
  
  const getComparisonData = (item1: string, item2: string) => {
    if (comparisonType === "location") {
      const loc1 = locationData[item1 as keyof typeof locationData];
      const loc2 = locationData[item2 as keyof typeof locationData];
      
      return {
        price: [
          { name: item1, value: loc1.avgPrice },
          { name: item2, value: loc2.avgPrice }
        ],
        growth: [
          { name: item1, value: loc1.growth },
          { name: item2, value: loc2.growth }
        ],
        radar: [
          {
            subject: "Connectivity",
            [item1]: loc1.connectivity,
            [item2]: loc2.connectivity
          },
          {
            subject: "Amenities",
            [item1]: loc1.amenities,
            [item2]: loc2.amenities
          },
          {
            subject: "Schools",
            [item1]: loc1.schools,
            [item2]: loc2.schools
          },
          {
            subject: "Hospitals",
            [item1]: loc1.hospitals,
            [item2]: loc2.hospitals
          },
          {
            subject: "Retail",
            [item1]: loc1.retail,
            [item2]: loc2.retail
          }
        ]
      };
    } else {
      // Property type comparison
      return {};
    }
  };
  
  const data = getComparisonData(location1, location2);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Area Comparison</h1>
        <p className="text-muted-foreground">
          Compare different areas in Bangalore to make informed decisions
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-realestate-accent" />
            Select Areas to Compare
          </CardTitle>
          <CardDescription>
            Choose two areas to see a detailed comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="location" className="w-full" onValueChange={(value) => setComparisonType(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="location">Compare Locations</TabsTrigger>
              <TabsTrigger value="property">Compare Property Types</TabsTrigger>
            </TabsList>
            
            <TabsContent value="location" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-realestate-primary" />
                    <label htmlFor="location-1" className="text-sm font-medium">Location 1</label>
                  </div>
                  <Select value={location1} onValueChange={setLocation1}>
                    <SelectTrigger id="location-1">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {getComparisonItems().map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-realestate-primary" />
                    <label htmlFor="location-2" className="text-sm font-medium">Location 2</label>
                  </div>
                  <Select value={location2} onValueChange={setLocation2}>
                    <SelectTrigger id="location-2">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {getComparisonItems().map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {location1 && location2 && location1 !== location2 && (
                <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className={cn("lg:col-span-3")}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-realestate-accent" />
                        Average Price Comparison (₹/sq.ft)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="chart-container h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.price}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`₹${value}/sq.ft`, "Price"]} />
                            <Bar dataKey="value" fill="#1e5c97" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-realestate-accent" />
                        Price Growth (%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="chart-container h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.growth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, "Annual Growth"]} />
                            <Bar dataKey="value" fill="#f97316" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={cn("lg:col-span-2")}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">Area Features Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="chart-container h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={90} data={data.radar}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar
                              name={location1}
                              dataKey={location1}
                              stroke="#1e5c97"
                              fill="#1e5c97"
                              fillOpacity={0.6}
                            />
                            <Radar
                              name={location2}
                              dataKey={location2}
                              stroke="#f97316"
                              fill="#f97316"
                              fillOpacity={0.6}
                            />
                            <Legend />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={cn("lg:col-span-3")}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">Detailed Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left font-medium p-2">Feature</th>
                              <th className="text-left font-medium p-2">{location1}</th>
                              <th className="text-left font-medium p-2">{location2}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-2">Average Price (₹/sq.ft)</td>
                              <td className="p-2">₹{locationData[location1 as keyof typeof locationData].avgPrice}</td>
                              <td className="p-2">₹{locationData[location2 as keyof typeof locationData].avgPrice}</td>
                            </tr>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-2">Price Range (₹/sq.ft)</td>
                              <td className="p-2">₹{locationData[location1 as keyof typeof locationData].priceRange}</td>
                              <td className="p-2">₹{locationData[location2 as keyof typeof locationData].priceRange}</td>
                            </tr>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-2">Annual Growth (%)</td>
                              <td className="p-2">{locationData[location1 as keyof typeof locationData].growth}%</td>
                              <td className="p-2">{locationData[location2 as keyof typeof locationData].growth}%</td>
                            </tr>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-2">Connectivity Rating</td>
                              <td className="p-2">{locationData[location1 as keyof typeof locationData].connectivity}/100</td>
                              <td className="p-2">{locationData[location2 as keyof typeof locationData].connectivity}/100</td>
                            </tr>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-2">Amenities Rating</td>
                              <td className="p-2">{locationData[location1 as keyof typeof locationData].amenities}/100</td>
                              <td className="p-2">{locationData[location2 as keyof typeof locationData].amenities}/100</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {location1 && location2 && location1 === location2 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Please select two different locations to compare</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="property" className="pt-4">
              <p className="text-center py-8 text-muted-foreground">
                Property type comparison coming soon! Check back for updates.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Comparison;
