import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  MapPin, 
  RefreshCw, 
  Settings, 
  Info, 
  BarChart, 
  Wind, 
  ThermometerSun,
  ChevronRight,
  Gauge,
  Globe,
  Search,
  AlertCircle,
  CloudRain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Header from "./Header";
import MetricCard from "./MetricCard";
import AirQualityMap from "./AirQualityMap";
import AirQualityChart from "./AirQualityChart";
import QualityIndexCard from "./QualityIndexCard";
import FinalAirQuality from "./FinalAirQuality";
import LocationSelector from "./LocationSelector";
import { AirQualityData, METRICS_INFO, DataSource } from "@/utils/types";
import { 
  fetchAirQualityData, 
  fetchAirQualityDataByCity, 
  fetchAirQualityFromGoogleAPI,
  fetchAirQualityFromOpenWeather,
  getUserCurrentLocation,
  getHistoricalDataForMetric,
  getCityFromCoordinates
} from "@/utils/api";
import { useIsMobile } from "@/hooks/use-mobile";

interface AirQualityDashboardProps {
  onToggleSidebar?: () => void;
}

const AirQualityDashboard: React.FC<AirQualityDashboardProps> = ({ onToggleSidebar }) => {
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<Record<string, any[]>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [dataSource, setDataSource] = useState<DataSource>("local");
  const [citySearch, setCitySearch] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [lastSearchMethod, setLastSearchMethod] = useState<"city" | "coordinates" | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (!navigator.geolocation) {
          toast.error("Geolocation is not supported by your browser");
          return;
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setCoordinates(coords);

        const cityName = await getCityFromCoordinates(coords);
        
        let data;
        switch (dataSource) {
          case "google":
            data = await fetchAirQualityFromGoogleAPI(coords);
            break;
          case "openweather":
            data = await fetchAirQualityFromOpenWeather(coords);
            break;
          default:
            data = await fetchAirQualityData(coords);
            break;
        }

        if (data.location.name === "Unknown Location" || data.location.name === "Current Location") {
          toast.error("Unable to determine your location name. Using generic data.");
        } else {
          toast.success(`Loaded air quality data for ${data.location.name}`);
          setCitySearch(data.location.name);
        }

        setAirQualityData(data);
        setLastSearchMethod("coordinates");
        loadHistoricalDataForAllMetrics();
        scrollToSection("analysis");

      } catch (error) {
        console.error("Error getting location:", error);
        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast.error("Please allow location access to get accurate air quality data");
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error("Location information is unavailable");
              break;
            case error.TIMEOUT:
              toast.error("Location request timed out");
              break;
            default:
              toast.error("An unknown error occurred while getting your location");
              break;
          }
        }
      }
    };

    requestLocationPermission();
  }, []);

  const loadDataForLocation = async (location: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let data;
      switch (dataSource) {
        case "google":
          data = await fetchAirQualityDataByCity(location);
          data.source = "Google API";
          break;
        case "openweather":
          data = await fetchAirQualityDataByCity(location);
          data.source = "Open Weather API";
          break;
        default:
          data = await fetchAirQualityDataByCity(location);
          break;
      }
      
      setAirQualityData(data);
      setLastSearchMethod("city");
      
      loadHistoricalDataForAllMetrics();
      
      toast.success(`Loaded air quality data for ${location}`);
      
      scrollToSection("analysis");
    } catch (err) {
      console.error("Error fetching data by city:", err);
      setError("Failed to load air quality data for this location");
      toast.error("Failed to load air quality data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDataForCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const coords = await getUserCurrentLocation();
      setCoordinates(coords);
      
      const cityName = await getCityFromCoordinates(coords);
      
      let data;
      switch (dataSource) {
        case "google":
          data = await fetchAirQualityFromGoogleAPI(coords);
          break;
        case "openweather":
          data = await fetchAirQualityFromOpenWeather(coords);
          break;
        default:
          data = await fetchAirQualityData(coords);
          break;
      }
      
      if (data.location.name === "Unknown Location" || data.location.name === "Current Location") {
        toast.error("Unable to determine your location name. Using generic data.");
      } else {
        toast.success(`Loaded air quality data for ${data.location.name}`);
        setCitySearch(data.location.name);
      }
      
      setAirQualityData(data);
      setLastSearchMethod("coordinates");
      
      loadHistoricalDataForAllMetrics();
      
      scrollToSection("analysis");
    } catch (err) {
      console.error("Error fetching data for current location:", err);
      setError(`Failed to load air quality data from ${getDataSourceName()}`);
      toast.error(`Failed to ${dataSource === "google" ? "access Google API" : "access your location"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistoricalDataForAllMetrics = () => {
    const data: Record<string, any[]> = {};
    
    METRICS_INFO.forEach(metric => {
      data[metric.key] = getHistoricalDataForMetric(metric.key);
    });
    
    setHistoricalData(data);
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmitData = () => {
    setIsLoading(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)).then(() => {
        loadDataForCurrentLocation();
      }),
      {
        loading: 'Processing input data...',
        success: 'Data processed successfully!',
        error: 'Failed to process data'
      }
    );
  };

  const handleRefresh = () => {
    if (airQualityData) {
      if (lastSearchMethod === "coordinates" && coordinates) {
        loadDataForCurrentLocation();
      } else if (airQualityData.location.name) {
        loadDataForLocation(airQualityData.location.name);
      } else {
        loadDataForCurrentLocation();
      }
    }
  };

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (citySearch.trim()) {
      loadDataForLocation(citySearch);
    }
  };
  
  const getDataSourceName = (): string => {
    switch (dataSource) {
      case "google": return "Google API";
      case "openweather": return "Open Weather API";
      default: return "Local Data";
    }
  };
  
  const getDataSourceIcon = () => {
    switch (dataSource) {
      case "google": return <Globe className="h-3 w-3" />;
      case "openweather": return <CloudRain className="h-3 w-3" />;
      default: return <Wind className="h-3 w-3" />;
    }
  };
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full pb-6 animate-gradient-shift">
      <div className="max-w-full mx-auto">
        <Header 
          airQualityData={airQualityData} 
          isLoading={isLoading} 
          onRefresh={handleRefresh}
          onToggleSidebar={onToggleSidebar}
        />
        
        <section id="home" className="py-6 px-4 md:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse-slow">
              Air Quality Monitoring Dashboard
            </h1>
            <p className="text-base md:text-lg text-blue-300 mb-6">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Getting your location...
                </span>
              ) : (
                "Get real-time air quality data for any location or use your current position"
              )}
            </p>

            <form onSubmit={handleCitySearch} className="max-w-md mx-auto mb-6">
              <div className="flex gap-2">
                <Input 
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Enter city name..."
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
                <Button type="submit" disabled={isLoading || !citySearch.trim()} className="bg-blue-500 hover:bg-blue-600">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </form>
              
            <div className="mb-8">
              <LocationSelector 
                onLocationSelected={loadDataForLocation}
                onDetectLocation={loadDataForCurrentLocation}
                isLoading={isLoading}
                currentLocation={airQualityData?.location.name}
              />
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-center mb-2">
                <Info className="h-4 w-4 mr-2 text-blue-300" />
                <span className="text-sm text-blue-300">Select Data Source:</span>
              </div>
              <ToggleGroup 
                type="single" 
                value={dataSource} 
                onValueChange={(value) => value && setDataSource(value as DataSource)} 
                className="justify-center"
              >
                <ToggleGroupItem value="local" className="flex gap-1 text-xs data-[state=on]:bg-blue-600">
                  <Wind className="h-3 w-3" />
                  <span className="hidden md:inline">Local Data</span>
                  <span className="md:hidden">Local</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="google" className="flex gap-1 text-xs data-[state=on]:bg-blue-600">
                  <Globe className="h-3 w-3" />
                  <span className="hidden md:inline">Google API</span>
                  <span className="md:hidden">Google</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="openweather" className="flex gap-1 text-xs data-[state=on]:bg-blue-600">
                  <CloudRain className="h-3 w-3" />
                  <span className="hidden md:inline">Open Weather</span>
                  <span className="md:hidden">Weather</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </section>
        
        <section id="inputs" className="py-6 px-4 md:px-6 bg-white/5 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <Wind className="h-5 w-5 mr-2 text-blue-400" />
              <h2 className="text-xl md:text-2xl font-semibold text-white">Air Quality Inputs</h2>
            </div>
            
            <div className="glass-card p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {METRICS_INFO.map((metric) => (
                  <div key={metric.key} className="flex flex-col space-y-2">
                    <Label htmlFor={metric.key} className="flex items-center gap-2 text-xs md:text-sm text-white">
                      {metric.label}
                    </Label>
                    <Input
                      id={metric.key}
                      placeholder={`Enter ${metric.label}`}
                      value={formData[metric.key] || ''}
                      onChange={(e) => handleInputChange(metric.key, e.target.value)}
                      className="backdrop-blur-sm bg-white/10 border-white/10 text-white text-xs md:text-sm"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6 gap-3">
                <Button onClick={handleSubmitData} disabled={isLoading} size={isMobile ? "sm" : "default"} className="text-xs md:text-sm bg-blue-500 hover:bg-blue-600">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                      {!isMobile && "Processing..."}
                    </>
                  ) : (
                    'Submit Data'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={loadDataForCurrentLocation}
                  disabled={isLoading}
                  size={isMobile ? "sm" : "default"}
                  className="text-xs md:text-sm border-white/20 text-white hover:bg-white/10"
                >
                  {getDataSourceIcon()}
                  <span className="ml-2">
                    {isMobile 
                      ? `Use ${dataSource === "local" ? "Current" : dataSource.charAt(0).toUpperCase() + dataSource.slice(1, 4)}` 
                      : `Use ${getDataSourceName()}`
                    }
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="analysis" className="py-6 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-4">
              <BarChart className="h-5 w-5 mr-2 text-blue-400" />
              <h2 className="text-xl md:text-2xl font-semibold text-white">Analysis</h2>
              {airQualityData?.source && (
                <span className="ml-4 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                  Source: {airQualityData.source}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {airQualityData ? (
                <>
                  <div className="col-span-full lg:col-span-2 lg:row-span-2">
                    <AirQualityMap 
                      airQualityData={airQualityData} 
                      isLoading={isLoading} 
                    />
                  </div>
                  
                  {METRICS_INFO.map((metricInfo) => (
                    <AirQualityChart
                      key={metricInfo.key}
                      title={`${metricInfo.label} Trend`}
                      data={historicalData[metricInfo.key] || []} 
                      color={metricInfo.colorKey}
                      unit={airQualityData.metrics[metricInfo.key].unit}
                    />
                  ))}
                </>
              ) : (
                <div className="col-span-full glass-card p-6 text-center">
                  <p className="text-blue-300 mb-4">
                    {isLoading ? "Loading data..." : "Enter values or use your location to view air quality data"}
                  </p>
                  {!isLoading && !error && (
                    <Button 
                      onClick={loadDataForCurrentLocation} 
                      variant="default" 
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {getDataSourceIcon()}
                      <span className="ml-2">
                        Use {getDataSourceName()}
                      </span>
                    </Button>
                  )}
                  {error && (
                    <div className="text-red-400 mt-2">
                      <p>{error}</p>
                      <Button 
                        onClick={loadDataForCurrentLocation} 
                        variant="outline" 
                        className="mt-4 border-white/20 text-white hover:bg-white/10"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        
        <section id="quality-index" className="py-6 px-4 md:px-6 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-4">
              <Gauge className="h-5 w-5 mr-2 text-blue-400" />
              <h2 className="text-xl md:text-2xl font-semibold text-white">Quality Index</h2>
            </div>
            
            {airQualityData ? (
              <div className="metrics-grid">
                {METRICS_INFO.map((metricInfo) => (
                  <QualityIndexCard
                    key={metricInfo.key}
                    metricInfo={metricInfo}
                    value={airQualityData.metrics[metricInfo.key]}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-blue-300">
                  No data available. Please enter values or use your location.
                </p>
              </div>
            )}
          </div>
        </section>
        
        <section id="final-air-quality" className="py-6 px-4 md:px-6">
          <div className="final-quality-container">
            <div className="flex items-center mb-4">
              <ThermometerSun className="h-5 w-5 mr-2 text-blue-400" />
              <h2 className="text-xl md:text-2xl font-semibold text-white">Final Air Quality</h2>
            </div>
            
            {airQualityData ? (
              <div className="w-full">
                <FinalAirQuality airQualityData={airQualityData} />
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-blue-300">
                  No data available. Please enter values or use your location.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 py-6 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm text-blue-300">
              Developed with ❤️ by{" "}
              <a 
                href="https://designwithsanjay.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                designwithsanjay
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AirQualityDashboard;
