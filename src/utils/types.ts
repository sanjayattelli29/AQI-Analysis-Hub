
export interface AirQualityData {
  location: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  timestamp: string;
  metrics: AirQualityMetrics;
  aqi: {
    value: number;
    category: AqiCategory;
    description: string;
  };
  source?: string; // Added to track the data source
}

export interface AirQualityMetrics {
  pm25: MetricValue;               // Particulate Matter 2.5µm
  pm10: MetricValue;               // Particulate Matter 10µm
  no: MetricValue;                 // Nitric Oxide
  no2: MetricValue;                // Nitrogen Dioxide
  nox: MetricValue;                // Nitrogen Oxides
  nh3: MetricValue;                // Ammonia
  so2: MetricValue;                // Sulfur Dioxide
  co: MetricValue;                 // Carbon Monoxide
  o3: MetricValue;                 // Ozone
  benzene: MetricValue;            // Benzene
  humidity: MetricValue;           // Relative Humidity
  wind_speed: MetricValue;         // Wind Speed
  wind_direction: MetricValue;     // Wind Direction
  solar_radiation: MetricValue;    // Solar Radiation
  rainfall: MetricValue;           // Rainfall
  temperature: MetricValue;        // Air Temperature
}

export interface MetricValue {
  value: number;
  unit: string;
  category?: AqiCategory;
}

export type AqiCategory = 'good' | 'moderate' | 'unhealthy' | 'very-unhealthy' | 'hazardous';

export type DataSource = "local" | "google" | "region" | "openweather";

export interface MetricInfo {
  key: keyof AirQualityMetrics;
  label: string;
  icon: string;
  unit: string;
  description: string;
  colorKey: keyof typeof colorMap;
}

export const colorMap = {
  pm25: 'air-purple',
  pm10: 'air-pink',
  no: 'air-yellow',
  no2: 'air-orange',
  nox: 'air-red',
  nh3: 'air-teal',
  so2: 'air-green',
  co: 'air-green',
  o3: 'air-blue',
  benzene: 'air-red',
  humidity: 'air-blue',
  wind_speed: 'air-teal',
  wind_direction: 'air-teal',
  solar_radiation: 'air-yellow',
  rainfall: 'air-blue',
  temperature: 'air-orange'
};

export const METRICS_INFO: MetricInfo[] = [
  {
    key: 'pm25',
    label: 'PM2.5',
    icon: 'particulate',
    unit: 'µg/m³',
    description: 'Fine particulate matter (diameter less than 2.5µm)',
    colorKey: 'pm25'
  },
  {
    key: 'pm10',
    label: 'PM10',
    icon: 'particulate',
    unit: 'µg/m³',
    description: 'Coarse particulate matter (diameter less than 10µm)',
    colorKey: 'pm10'
  },
  {
    key: 'no',
    label: 'NO',
    icon: 'cloud',
    unit: 'ppb',
    description: 'Nitric Oxide',
    colorKey: 'no'
  },
  {
    key: 'no2',
    label: 'NO₂',
    icon: 'cloud',
    unit: 'ppb',
    description: 'Nitrogen Dioxide',
    colorKey: 'no2'
  },
  {
    key: 'nox',
    label: 'NOx',
    icon: 'cloud',
    unit: 'ppb',
    description: 'Nitrogen Oxides',
    colorKey: 'nox'
  },
  {
    key: 'nh3',
    label: 'NH₃',
    icon: 'flask',
    unit: 'ppb',
    description: 'Ammonia',
    colorKey: 'nh3'
  },
  {
    key: 'so2',
    label: 'SO₂',
    icon: 'cloud',
    unit: 'ppb',
    description: 'Sulfur Dioxide',
    colorKey: 'so2'
  },
  {
    key: 'co',
    label: 'CO',
    icon: 'factory',
    unit: 'ppm',
    description: 'Carbon Monoxide',
    colorKey: 'co'
  },
  {
    key: 'o3',
    label: 'O₃',
    icon: 'sun',
    unit: 'ppb',
    description: 'Ozone',
    colorKey: 'o3'
  },
  {
    key: 'benzene',
    label: 'Benzene',
    icon: 'flask',
    unit: 'ppb',
    description: 'Volatile organic compound',
    colorKey: 'benzene'
  },
  {
    key: 'humidity',
    label: 'Humidity',
    icon: 'droplet',
    unit: '%',
    description: 'Relative humidity in the air',
    colorKey: 'humidity'
  },
  {
    key: 'wind_speed',
    label: 'Wind Speed',
    icon: 'wind',
    unit: 'm/s',
    description: 'Speed of wind',
    colorKey: 'wind_speed'
  },
  {
    key: 'wind_direction',
    label: 'Wind Direction',
    icon: 'compass',
    unit: '°',
    description: 'Direction of wind in degrees',
    colorKey: 'wind_direction'
  },
  {
    key: 'solar_radiation',
    label: 'Solar Radiation',
    icon: 'sun',
    unit: 'W/m²',
    description: 'Solar radiation intensity',
    colorKey: 'solar_radiation'
  },
  {
    key: 'rainfall',
    label: 'Rainfall',
    icon: 'cloud-rain',
    unit: 'mm',
    description: 'Precipitation amount',
    colorKey: 'rainfall'
  },
  {
    key: 'temperature',
    label: 'Temperature',
    icon: 'thermometer',
    unit: '°C',
    description: 'Air temperature',
    colorKey: 'temperature'
  }
];
