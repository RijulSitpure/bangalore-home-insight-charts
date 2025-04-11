
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api';

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

// Function to fetch locations from API
export const fetchLocations = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_URL}/locations`);
    return response.data.locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};

// Function to predict price using the Python model via API
export const predictPrice = async (
  area: number,
  location: string,
  bedrooms: string,
  bathrooms: string
): Promise<number> => {
  try {
    const response = await axios.post(`${API_URL}/predict`, {
      area,
      location,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms)
    });
    
    return response.data.predicted_price;
  } catch (error) {
    console.error('Error predicting price:', error);
    throw new Error('Failed to predict price');
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
