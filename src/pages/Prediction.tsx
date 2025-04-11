
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Calculator,
  MapPin, 
  Home as HomeIcon,
  Building,
  ArrowRight,
  Ruler,
  Bed,
  Bath,
  Car,
  LineChart,
  Loader2
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ModelComparisonChart from "@/components/ModelComparisonChart";
import { predictPrice, generatePriceHistory, modelMetrics, fetchLocations } from "@/utils/mlModels";
import { cn } from "@/lib/utils";

const Prediction: React.FC = () => {
  const { toast } = useToast();
  const [area, setArea] = useState<number>(1200);
  const [location, setLocation] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("2");
  const [bathrooms, setBathrooms] = useState<string>("2");
  const [propertyType, setPropertyType] = useState<string>("Apartment");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<Array<{month: string, price: number}>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [locationsLoading, setLocationsLoading] = useState<boolean>(false);

  // Fetch available locations when component mounts
  useEffect(() => {
    const getLocations = async () => {
      setLocationsLoading(true);
      try {
        const locations = await fetchLocations();
        setAvailableLocations(locations);
      } catch (error) {
        console.error("Failed to load locations:", error);
        toast({
          title: "Error",
          description: "Failed to load locations. Please check if the API server is running.",
          variant: "destructive",
        });
      } finally {
        setLocationsLoading(false);
      }
    };
    
    getLocations();
  }, [toast]);
  
  const handlePredict = async () => {
    setLoading(true);
    setPredictionError(null);
    
    try {
      // Call the API to get prediction
      const predictedPrice = await predictPrice(
        area,
        location,
        bedrooms,
        bathrooms
      );
      
      setPrediction(predictedPrice);
      // Generate price history based on the prediction
      setPriceHistory(generatePriceHistory(predictedPrice));
      
      toast({
        title: "Prediction Complete",
        description: `Estimated price: ₹${predictedPrice.toLocaleString()}`,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      setPredictionError("Failed to get prediction. Please check if the API server is running.");
      toast({
        title: "Prediction Error",
        description: "Failed to get prediction. Please check if the API server is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Price Prediction</h1>
        <p className="text-muted-foreground">
          Get an estimated price for your property in Bangalore using our ML model
        </p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-realestate-accent" />
                Property Details
              </CardTitle>
              <CardDescription>
                Fill in the details to get an accurate price prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-realestate-primary" />
                        <Label htmlFor="location">Location</Label>
                      </div>
                      <Select value={location} onValueChange={setLocation} disabled={locationsLoading}>
                        <SelectTrigger id="location">
                          {locationsLoading ? (
                            <div className="flex items-center">
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Loading locations...
                            </div>
                          ) : (
                            <SelectValue placeholder="Select location" />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {availableLocations.map(loc => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-realestate-primary" />
                        <Label htmlFor="property-type">Property Type</Label>
                      </div>
                      <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger id="property-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="Independent House">Independent House</SelectItem>
                          <SelectItem value="Builder Floor">Builder Floor</SelectItem>
                          <SelectItem value="Plot">Plot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Ruler className="h-4 w-4 mr-2 text-realestate-primary" />
                      <Label>Area (sq.ft): {area}</Label>
                    </div>
                    <Slider 
                      defaultValue={[1200]} 
                      max={5000} 
                      step={50} 
                      onValueChange={(value) => setArea(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>500 sq.ft</span>
                      <span>5000 sq.ft</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-2 text-realestate-primary" />
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                      </div>
                      <Select value={bedrooms} onValueChange={setBedrooms}>
                        <SelectTrigger id="bedrooms">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 BHK</SelectItem>
                          <SelectItem value="2">2 BHK</SelectItem>
                          <SelectItem value="3">3 BHK</SelectItem>
                          <SelectItem value="4">4 BHK</SelectItem>
                          <SelectItem value="5">5+ BHK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-2 text-realestate-primary" />
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                      </div>
                      <Select value={bathrooms} onValueChange={setBathrooms}>
                        <SelectTrigger id="bathrooms">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="advanced" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facing">Facing Direction</Label>
                      <Select>
                        <SelectTrigger id="facing">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="east">East</SelectItem>
                          <SelectItem value="west">West</SelectItem>
                          <SelectItem value="north">North</SelectItem>
                          <SelectItem value="south">South</SelectItem>
                          <SelectItem value="northeast">North East</SelectItem>
                          <SelectItem value="northwest">North West</SelectItem>
                          <SelectItem value="southeast">South East</SelectItem>
                          <SelectItem value="southwest">South West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2 text-realestate-primary" />
                        <Label htmlFor="parking">Parking</Label>
                      </div>
                      <Select>
                        <SelectTrigger id="parking">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="1">1 Space</SelectItem>
                          <SelectItem value="2">2 Spaces</SelectItem>
                          <SelectItem value="3">3+ Spaces</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Property Age</Label>
                      <Select>
                        <SelectTrigger id="age">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New Construction</SelectItem>
                          <SelectItem value="0-2">0-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Select>
                        <SelectTrigger id="availability">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ready">Ready to Move</SelectItem>
                          <SelectItem value="3months">Within 3 Months</SelectItem>
                          <SelectItem value="6months">Within 6 Months</SelectItem>
                          <SelectItem value="1year">Within 1 Year</SelectItem>
                          <SelectItem value="1year+">More than 1 Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amenities">Amenities</Label>
                    <Select>
                      <SelectTrigger id="amenities">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-realestate-primary hover:bg-realestate-primary/90"
                  onClick={handlePredict}
                  disabled={!location || loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Calculating...
                    </div>
                  ) : (
                    <>
                      Get Price Prediction
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                {predictionError && (
                  <div className="mt-2 text-sm text-destructive">
                    {predictionError}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className={cn("h-full", prediction ? "border-realestate-accent" : "")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5 text-realestate-accent" />
                Predicted Price
              </CardTitle>
              <CardDescription>
                Based on your trained ML model
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prediction ? (
                <div className="text-center py-6">
                  <div className="text-3xl font-bold text-realestate-primary mb-2">
                    ₹{prediction.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mb-6">
                    ₹{Math.round(prediction/area).toLocaleString()} per sq.ft
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm font-medium">Price Range</div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm">₹{(prediction * 0.95).toLocaleString()}</span>
                      <span className="text-sm">₹{(prediction * 1.05).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                      <div className="bg-realestate-accent h-2 rounded-full w-1/2 translate-x-1/2"></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[(prediction * 0.95), (prediction * 1.05)]} />
                        <Tooltip 
                          formatter={(value) => [`₹${parseInt(String(value)).toLocaleString()}`, "Estimated Price"]}
                        />
                        <Line type="monotone" dataKey="price" stroke="#1e5c97" activeDot={{ r: 8 }} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Fill in the property details and click 'Get Price Prediction' to see the estimated price
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Model comparison charts section */}
      {prediction && (
        <div className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Model Performance Comparison</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ModelComparisonChart metric="r2" />
            <ModelComparisonChart metric="mae" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;
