
// Model performance metrics from training
export const modelMetrics = {
  models: [
    {
      name: "Random Forest",
      mae: 19.477181,
      rmse: 72.655137,
      r2: 0.674369,
      cvR2Mean: 0.768053,
      cvR2Std: 0.042637,
      color: "#33a650"
    },
    {
      name: "Ridge",
      mae: 21.039481,
      rmse: 73.086154,
      r2: 0.670494,
      cvR2Mean: 0.825670,
      cvR2Std: 0.023453,
      color: "#3366cc"
    },
    {
      name: "Gradient Boosting",
      mae: 23.691746,
      rmse: 73.702624,
      r2: 0.664912,
      cvR2Mean: 0.764448,
      cvR2Std: 0.023583,
      color: "#dc3912"
    },
    {
      name: "Linear Regression",
      mae: 21.202656,
      rmse: 74.047080,
      r2: 0.661773,
      cvR2Mean: 0.824182,
      cvR2Std: 0.041694,
      color: "#ff9900"
    },
    {
      name: "Lasso",
      mae: 25.139311,
      rmse: 77.477694,
      r2: 0.629707,
      cvR2Mean: 0.767977,
      cvR2Std: 0.025960,
      color: "#990099"
    },
    {
      name: "XGBoost",
      mae: 21.204345,
      rmse: 86.113989,
      r2: 0.542554,
      cvR2Mean: 0.782293,
      cvR2Std: 0.027972,
      color: "#0099c6"
    }
  ]
};

// Feature importance coefficients - Replace with actual coefficients from your model
// These are placeholder values - replace with your actual model coefficients
const featureImportance = {
  area: 0.35,
  location: {
    "Whitefield": 0.12,
    "Electronic City": 0.09,
    "Indiranagar": 0.25,
    "Koramangala": 0.27,
    "Jayanagar": 0.18,
    "Marathahalli": 0.14,
    "HSR Layout": 0.22,
    "default": 0.1
  },
  bedrooms: {
    "1": 0.05,
    "2": 0.1,
    "3": 0.15,
    "4": 0.2,
    "5": 0.25,
    "default": 0.1
  },
  bathrooms: {
    "1": 0.05,
    "2": 0.1,
    "3": 0.15,
    "4": 0.2,
    "default": 0.1
  },
  propertyType: {
    "Apartment": 1.0,
    "Villa": 1.4,
    "Independent House": 1.2,
    "Builder Floor": 1.1,
    "Plot": 0.8,
    "default": 1.0
  }
};

// Base price per sqft based on your model (adjust according to your actual data)
const basePrice = 6500;

// Random Forest prediction implementation
export const predictRandomForest = (
  area: number,
  location: string,
  bedrooms: string,
  bathrooms: string,
  propertyType: string
): number => {
  // Get location factor or default if location doesn't exist
  const locationFactor = location in featureImportance.location 
    ? featureImportance.location[location as keyof typeof featureImportance.location] 
    : featureImportance.location.default;
  
  // Get bedroom factor or default
  const bedroomFactor = bedrooms in featureImportance.bedrooms 
    ? featureImportance.bedrooms[bedrooms as keyof typeof featureImportance.bedrooms]
    : featureImportance.bedrooms.default;
  
  // Get bathroom factor or default  
  const bathroomFactor = bathrooms in featureImportance.bathrooms
    ? featureImportance.bathrooms[bathrooms as keyof typeof featureImportance.bathrooms]
    : featureImportance.bathrooms.default;
  
  // Get property type factor or default
  const propertyTypeFactor = propertyType in featureImportance.propertyType
    ? featureImportance.propertyType[propertyType as keyof typeof featureImportance.propertyType]
    : featureImportance.propertyType.default;
  
  // Simplified prediction calculation
  // In a real implementation, this would use the actual coefficients and formula from your model
  const areaComponent = area * featureImportance.area;
  const locationComponent = basePrice * locationFactor;
  const bedroomComponent = basePrice * bedroomFactor;
  const bathroomComponent = basePrice * bathroomFactor;
  
  // Calculate predicted price
  let predictedPrice = (basePrice + locationComponent + bedroomComponent + bathroomComponent) * 
                      propertyTypeFactor * area;
  
  // Round to nearest thousand
  return Math.round(predictedPrice / 1000) * 1000;
};

// Price prediction function that takes all available parameters
export const predictPrice = (
  area: number,
  location: string,
  bedrooms: string,
  bathrooms: string,
  propertyType: string,
  modelName: string = "Random Forest" // Default to best model
): number => {
  switch(modelName) {
    case "Random Forest":
      return predictRandomForest(area, location, bedrooms, bathrooms, propertyType);
    // You could add other model implementations here
    default:
      return predictRandomForest(area, location, bedrooms, bathrooms, propertyType);
  }
};

// Generate price history based on model prediction
export const generatePriceHistory = (
  currentPrice: number, 
  months: number = 6
): Array<{month: string, price: number}> => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  
  // Create a price trend with slight variations
  return Array.from({ length: months }, (_, i) => {
    const monthIndex = (currentMonth - (months - 1) + i) % 12;
    const monthName = monthNames[monthIndex >= 0 ? monthIndex : monthIndex + 12];
    
    // Add a slight trend upward with small variations
    const factor = 0.97 + (i * 0.01) + (Math.random() * 0.01 - 0.005);
    
    return {
      month: monthName,
      price: currentPrice * factor
    };
  });
};
