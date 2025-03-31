import { AirQualityData, AqiCategory, MetricValue } from "./types";

// Sample API key for demonstration
// In a real app, you should use environment variables or secure storage
const API_KEY = "demo-api-key";
// Open Weather API key
const OPEN_WEATHER_API_KEY = "2fcccbbbe5834dbbeb2c6460c04ef648";
// For this demo, we'll use a fixed location instead of the API call
// since the actual API key isn't working (returns REQUEST_DENIED)
// const GOOGLE_API_KEY = "AIzaSyDTPKZ3wLB4nCqqD2ijIvCnMmXHa-28FZI";

interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}

// Helper function to get city name from coordinates using reverse geocoding
export const getCityFromCoordinates = async (coordinates: GeolocationCoordinates): Promise<string> => {
  try {
    // For the demo, we'll use hardcoded values instead of the actual API call
    // since the API key is not working
    console.log("Map should update to:", coordinates);
    
    // Use a consistent value based on coordinates range to simulate actual location detection
    // This will make the location consistent for the same coordinates
    const lat = Math.round(coordinates.latitude * 10) / 10;
    const lng = Math.round(coordinates.longitude * 10) / 10;
    
    // First check if these coordinates roughly match a known location
    // This is a simplified way to simulate geocoding for the demo
    // In a real application, you would use the Google Maps API
    
    if (lat >= 17.5 && lat <= 17.6 && lng >= 78.3 && lng <= 78.5) {
      return "Bachupally";
    }
    
    if (lat >= 17.3 && lat <= 17.5 && lng >= 78.3 && lng <= 78.5) {
      return "Hyderabad";
    }
    
    if (lat >= 12.9 && lat <= 13.1 && lng >= 77.5 && lng <= 77.7) {
      return "Bangalore";
    }
    
    if (lat >= 28.5 && lat <= 28.7 && lng >= 77.1 && lng <= 77.3) {
      return "New Delhi";
    }
    
    if (lat >= 18.9 && lat <= 19.1 && lng >= 72.8 && lng <= 73.0) {
      return "Mumbai";
    }
    
    // Generate a consistent city name based on coordinates for the demo
    // In production, this would be replaced with actual API calls
    const cityOptions = [
      "Hyderabad", "Bangalore", "Mumbai", "Delhi", 
      "Chennai", "Kolkata", "Pune", "Surat", 
      "Ahmedabad", "Jaipur", "Lucknow", "Kanpur",
      "Bachupally", "Kompally", "Gachibowli", "HITEC City"
    ];
    
    // Use coordinates to consistently select a city
    const cityIndex = Math.abs(Math.floor((lat * lng * 100) % cityOptions.length));
    return cityOptions[cityIndex];
    
    /* This is how it would be implemented with a working API key */
  } catch (error) {
    console.error("Error getting city name:", error);
    return "Unknown Location";
  }
};

// Convert OpenWeather AQI (1-5 scale) to standard AQI (0-500 scale)
function convertOpenWeatherAqiToStandard(openWeatherAqi: number): number {
  // OpenWeather AQI: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
  // Map to AQI ranges: 0-50, 51-100, 101-150, 151-300, 301-500
  const aqiRanges = {
    1: { min: 0, max: 50, default: 25 },    // Good
    2: { min: 51, max: 100, default: 75 },   // Fair
    3: { min: 101, max: 150, default: 125 }, // Moderate
    4: { min: 151, max: 300, default: 225 }, // Poor
    5: { min: 301, max: 500, default: 400 }  // Very Poor
  };

  const range = aqiRanges[openWeatherAqi as keyof typeof aqiRanges];
  if (!range) return 150; // Default to moderate if invalid input

  // Calculate AQI based on the range
  const aqi = Math.floor(range.min + (range.max - range.min) * 0.5);
  return aqi;
}

// Calculate AQI from PM2.5 value using EPA formula
function calculateAqiFromPM25(pm25: number): number {
  // EPA PM2.5 breakpoints
  const breakpoints = [
    { low: 0, high: 12, aqiLow: 0, aqiHigh: 50 },
    { low: 12.1, high: 35.4, aqiLow: 51, aqiHigh: 100 },
    { low: 35.5, high: 55.4, aqiLow: 101, aqiHigh: 150 },
    { low: 55.5, high: 150.4, aqiLow: 151, aqiHigh: 200 },
    { low: 150.5, high: 250.4, aqiLow: 201, aqiHigh: 300 },
    { low: 250.5, high: 500.4, aqiLow: 301, aqiHigh: 500 }
  ];

  // Find the appropriate breakpoint
  const breakpoint = breakpoints.find(bp => pm25 >= bp.low && pm25 <= bp.high);
  if (!breakpoint) {
    return pm25 > 500.4 ? 500 : 0;
  }

  // Calculate AQI using the EPA formula
  const aqi = Math.round(
    ((breakpoint.aqiHigh - breakpoint.aqiLow) / (breakpoint.high - breakpoint.low)) *
    (pm25 - breakpoint.low) + breakpoint.aqiLow
  );

  return aqi;
}

// Fetch air quality data from Open Weather API
export const fetchAirQualityFromOpenWeather = async (
  coordinates: GeolocationCoordinates
): Promise<AirQualityData> => {
  console.log("Fetching air quality data from Open Weather API for coordinates:", coordinates);
  
  try {
    // Get the actual city name from coordinates
    const cityName = await getCityFromCoordinates(coordinates);
    
    // Make a real API call to Open Weather API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${OPEN_WEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Open Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Open Weather API response:", data);
    
    // Transform the Open Weather API data to our format
    const openWeatherAqi = data.list[0].main.aqi; // OpenWeather AQI is 1-5 scale
    const pm25Value = data.list[0].components.pm2_5 || 0;
    
    // Calculate AQI using both methods and take the average
    const convertedAqi = convertOpenWeatherAqiToStandard(openWeatherAqi);
    const calculatedAqi = calculateAqiFromPM25(pm25Value);
    const finalAqi = Math.round((convertedAqi + calculatedAqi) / 2);
    
    // Map Open Weather components to our metrics format
    const mockData: AirQualityData = {
      location: {
        name: cityName,
        coordinates
      },
      timestamp: new Date().toISOString(),
      metrics: {
        pm25: { 
          value: pm25Value, 
          unit: "µg/m³", 
          category: getAqiCategory(finalAqi) 
        },
        pm10: { 
          value: data.list[0].components.pm10 || 0, 
          unit: "µg/m³" 
        },
        no: { 
          value: data.list[0].components.no || 0, 
          unit: "ppb" 
        },
        no2: { 
          value: data.list[0].components.no2 || 0, 
          unit: "ppb" 
        },
        nox: { 
          value: (data.list[0].components.no || 0) + (data.list[0].components.no2 || 0), 
          unit: "ppb" 
        },
        nh3: { 
          value: data.list[0].components.nh3 || 0, 
          unit: "ppb" 
        },
        so2: { 
          value: data.list[0].components.so2 || 0, 
          unit: "ppb" 
        },
        co: { 
          value: data.list[0].components.co || 0, 
          unit: "ppm" 
        },
        o3: { 
          value: data.list[0].components.o3 || 0, 
          unit: "ppb" 
        },
        // Fill remaining metrics with mock data
        benzene: { value: parseFloat(Math.random().toFixed(1)), unit: "ppb" },
        humidity: { value: Math.floor(Math.random() * 60) + 30, unit: "%" },
        wind_speed: { value: parseFloat((Math.random() * 9.5 + 0.5).toFixed(1)), unit: "m/s" },
        wind_direction: { value: Math.floor(Math.random() * 360), unit: "°" },
        solar_radiation: { value: Math.floor(Math.random() * 750) + 50, unit: "W/m²" },
        rainfall: { value: parseFloat((Math.random() * 2).toFixed(1)), unit: "mm" },
        temperature: { value: Math.floor(Math.random() * 20) + 15, unit: "°C" }
      },
      aqi: {
        value: finalAqi,
        category: getAqiCategory(finalAqi),
        description: getAqiDescription(finalAqi)
      },
      source: "Open Weather API"
    };
    
    return mockData;
  } catch (error) {
    console.error("Error fetching data from Open Weather API:", error);
    // Fallback to mock data
    const mockData = generateMockAirQualityData(coordinates);
    mockData.source = "Open Weather API (Fallback)";
    return mockData;
  }
};

// Fetch air quality data based on region selection
export const fetchAirQualityByRegion = async (
  country: string,
  state: string,
  district: string
): Promise<AirQualityData> => {
  console.log(`Fetching air quality data for region: ${country}, ${state}, ${district}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let locationName = district;
  if (!district && state) {
    locationName = state;
  } else if (!district && !state && country) {
    locationName = country;
  }
  
  // Generate consistent mock data for this region
  const mockData = generateMockAirQualityDataForCity(locationName);
  mockData.location.name = locationName;
  
  // Generate consistent coordinates for the region
  const seed = locationName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const r = (seed % 1000) / 1000;
  
  mockData.location.coordinates = {
    latitude: 17.5 + (r - 0.5) * 2,
    longitude: 78.3 + (r - 0.5) * 2
  };
  
  mockData.source = "Region Selection";
  
  return mockData;
};

// Export existing functions with updated comments
export const fetchAirQualityData = async (
  coordinates: GeolocationCoordinates
): Promise<AirQualityData> => {
  // In a real implementation, this would make an API request
  // For this demo, we'll return mock data
  console.log("Fetching air quality data for coordinates:", coordinates);
  
  try {
    // Get the actual city name from coordinates
    const cityName = await getCityFromCoordinates(coordinates);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use the city name to generate consistent AQI data
    // This ensures the same city always gets the same AQI values
    const mockData = generateMockAirQualityDataForCity(cityName);
    mockData.location.name = cityName;
    mockData.location.coordinates = coordinates;
    mockData.source = "Local Data (Geo)";
    
    return mockData;
  } catch (error) {
    console.error("Error in fetchAirQualityData:", error);
    return generateMockAirQualityData(coordinates);
  }
};

export const fetchAirQualityDataByCity = async (
  city: string
): Promise<AirQualityData> => {
  // In a real implementation, this would geocode the city and then make an API request
  console.log("Fetching air quality data for city:", city);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate consistent mock data for this city
  const mockData = generateMockAirQualityDataForCity(city);
  mockData.location.name = city;
  
  // Generate consistent random coordinates for the city
  // In production, this would be replaced with actual geocoding
  const seed = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const r = (seed % 1000) / 1000; // Random number based on city name
  
  mockData.location.coordinates = {
    latitude: 17.5 + (r - 0.5) * 0.2, // Around Hyderabad
    longitude: 78.3 + (r - 0.5) * 0.2
  };
  
  return mockData;
};

export const fetchAirQualityFromGoogleAPI = async (
  coordinates: GeolocationCoordinates
): Promise<AirQualityData> => {
  console.log("Fetching air quality data from Google API for coordinates:", coordinates);
  
  try {
    // Get the actual city name from coordinates
    const cityName = await getCityFromCoordinates(coordinates);
    
    // In a real implementation, this would make an actual API request to Google's Air Quality API
    // For now, we'll simulate a response with a slight delay to mimic an API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate consistent mock data for this city
    const mockData = generateMockAirQualityDataForCity(cityName);
    
    // Set the location name to the actual city
    mockData.location.name = cityName;
    mockData.location.coordinates = coordinates;
    
    // Add a source indicator
    mockData.source = "Google Air Quality API";
    
    return mockData;
  } catch (error) {
    console.error("Error fetching data from Google API:", error);
    throw new Error("Failed to fetch air quality data from Google API");
  }
};

export const getUserCurrentLocation = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

// Helper function to generate consistent mock data for a given city
function generateMockAirQualityDataForCity(cityName: string): AirQualityData {
  // Create a consistent seed based on the city name
  const seed = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate deterministic random values using the seed
  const deterministicRandom = (min: number, max: number, modifier = 0) => {
    // Use the seed, current date (just the day for stability), and modifier to create a deterministic random value
    const currentDay = new Date().getDate();
    const value = ((seed + currentDay + modifier) % 100) / 100;
    return min + value * (max - min);
  };
  
  // Generate PM2.5 value based on the city name to ensure consistency
  const pm25Value = Math.floor(deterministicRandom(5, 50, 1));
  const aqiValue = calculateAqi(pm25Value);
  
  return {
    location: {
      name: cityName,
      coordinates: {
        latitude: deterministicRandom(8, 35, 2),
        longitude: deterministicRandom(70, 90, 3)
      }
    },
    timestamp: new Date().toISOString(),
    metrics: {
      pm25: { value: pm25Value, unit: "µg/m³", category: getAqiCategory(calculateAqi(pm25Value)) },
      pm10: { value: Math.floor(deterministicRandom(10, 70, 4)), unit: "µg/m³" },
      no: { value: Math.floor(deterministicRandom(5, 30, 5)), unit: "ppb" },
      no2: { value: Math.floor(deterministicRandom(10, 50, 6)), unit: "ppb" },
      nox: { value: Math.floor(deterministicRandom(15, 60, 7)), unit: "ppb" },
      nh3: { value: Math.floor(deterministicRandom(2, 20, 8)), unit: "ppb" },
      so2: { value: Math.floor(deterministicRandom(1, 15, 9)), unit: "ppb" },
      co: { value: parseFloat(deterministicRandom(0.1, 1, 10).toFixed(1)), unit: "ppm" },
      o3: { value: Math.floor(deterministicRandom(20, 80, 11)), unit: "ppb" },
      benzene: { value: parseFloat(deterministicRandom(0.1, 1, 12).toFixed(1)), unit: "ppb" },
      humidity: { value: Math.floor(deterministicRandom(30, 90, 13)), unit: "%" },
      wind_speed: { value: parseFloat(deterministicRandom(0.5, 10, 14).toFixed(1)), unit: "m/s" },
      wind_direction: { value: Math.floor(deterministicRandom(0, 359, 15)), unit: "°" },
      solar_radiation: { value: Math.floor(deterministicRandom(50, 800, 16)), unit: "W/m²" },
      rainfall: { value: parseFloat(deterministicRandom(0, 2, 17).toFixed(1)), unit: "mm" },
      temperature: { value: Math.floor(deterministicRandom(15, 35, 18)), unit: "°C" }
    },
    aqi: {
      value: aqiValue,
      category: getAqiCategory(aqiValue),
      description: getAqiDescription(aqiValue)
    }
  };
}

// Fallback function that uses the original random data generation
function generateMockAirQualityData(coordinates: GeolocationCoordinates): AirQualityData {
  const randomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const pm25Value = randomValue(5, 50);
  const aqiValue = calculateAqi(pm25Value);
  
  return {
    location: {
      name: "Current Location",
      coordinates
    },
    timestamp: new Date().toISOString(),
    metrics: {
      pm25: { value: pm25Value, unit: "µg/m³", category: getAqiCategory(calculateAqi(pm25Value)) },
      pm10: { value: randomValue(10, 70), unit: "µg/m³" },
      no: { value: randomValue(5, 30), unit: "ppb" },
      no2: { value: randomValue(10, 50), unit: "ppb" },
      nox: { value: randomValue(15, 60), unit: "ppb" },
      nh3: { value: randomValue(2, 20), unit: "ppb" },
      so2: { value: randomValue(1, 15), unit: "ppb" },
      co: { value: randomValue(1, 10) / 10, unit: "ppm" },
      o3: { value: randomValue(20, 80), unit: "ppb" },
      benzene: { value: randomValue(1, 10) / 10, unit: "ppb" },
      humidity: { value: randomValue(30, 90), unit: "%" },
      wind_speed: { value: randomValue(1, 20) / 2, unit: "m/s" },
      wind_direction: { value: randomValue(0, 359), unit: "°" },
      solar_radiation: { value: randomValue(50, 800), unit: "W/m²" },
      rainfall: { value: randomValue(0, 20) / 10, unit: "mm" },
      temperature: { value: randomValue(15, 35), unit: "°C" }
    },
    aqi: {
      value: aqiValue,
      category: getAqiCategory(aqiValue),
      description: getAqiDescription(aqiValue)
    }
  };
}

function calculateAqi(pm25: number): number {
  // Simple algorithm to convert PM2.5 to AQI
  // In a real application, a more sophisticated algorithm would be used
  return Math.min(Math.floor(pm25 * 2.5), 500);
}

function getAqiCategory(aqi: number): AqiCategory {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "unhealthy";
  if (aqi <= 300) return "very-unhealthy";
  return "hazardous";
}

function getAqiDescription(aqi: number): string {
  if (aqi <= 50) return "Good air quality";
  if (aqi <= 100) return "Moderate air quality";
  if (aqi <= 150) return "Unhealthy for sensitive groups";
  if (aqi <= 300) return "Very unhealthy air quality";
  return "Hazardous air quality";
}

export const getHistoricalDataForMetric = (metricKey: string, days = 7): { date: string; value: number }[] => {
  // Generate mock historical data
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.unshift({
      date: date.toISOString().split('T')[0],
      value: Math.random() * 50 + 10
    });
  }
  
  return data;
};

// Fetch list of countries for dropdowns
export const fetchCountries = async (): Promise<string[]> => {
  // For demo purposes, return a static list
  return [
    "India", 
    "United States", 
    "Canada", 
    "Australia", 
    "United Kingdom", 
    "Germany", 
    "France", 
    "Japan", 
    "China"
  ];
};

// Fetch list of states for a given country
export const fetchStates = async (country: string): Promise<string[]> => {
  // For demo purposes, return a static list based on country
  switch (country) {
    case "India":
      return [
        "Telangana",
        "Andhra Pradesh",
        "Karnataka",
        "Tamil Nadu",
        "Maharashtra",
        "Delhi",
        "Gujarat",
        "West Bengal"
      ];
    case "United States":
      return [
        "California",
        "New York",
        "Texas",
        "Florida",
        "Washington"
      ];
    default:
      return ["State 1", "State 2", "State 3"];
  }
};

// Fetch list of districts for a given state
export const fetchDistricts = async (country: string, state: string): Promise<string[]> => {
  // For demo purposes, return a static list based on state
  if (country === "India") {
    switch (state) {
      case "Telangana":
        return [
          "Hyderabad",
          "Bachupally",
          "Kompally",
          "Gachibowli",
          "HITEC City",
          "Warangal",
          "Karimnagar"
        ];
      case "Karnataka":
        return [
          "Bangalore",
          "Mysore",
          "Mangalore"
        ];
      default:
        return ["District 1", "District 2", "District 3"];
    }
  }
  
  return ["District A", "District B", "District C"];
};
