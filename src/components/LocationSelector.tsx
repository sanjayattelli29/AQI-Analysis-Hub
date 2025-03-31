import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface LocationSelectorProps {
  onLocationSelected: (location: string) => void;
  onDetectLocation: () => void;
  isLoading: boolean;
  currentLocation?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onLocationSelected, 
  onDetectLocation,
  isLoading,
  currentLocation
}) => {
  const [location, setLocation] = useState("");
  const isMobile = useIsMobile();
  
  // Update the input field when currentLocation changes
  useEffect(() => {
    if (currentLocation && currentLocation !== "Unknown Location" && currentLocation !== "Current Location") {
      setLocation(currentLocation);
    }
  }, [currentLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onLocationSelected(location.trim());
    } else {
      toast.error("Please enter a location");
    }
  };
  
  const handleDetectLocation = () => {
    // First check if geolocation is available
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    // Show loading state
    onDetectLocation();
    
    // Request high accuracy location with timeout
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Successfully got location
        console.log("Location detected:", position);
        onDetectLocation();
      },
      (error) => {
        // Handle different types of errors
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Please allow location access in your browser settings");
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
      },
      {
        enableHighAccuracy: true, // Request high accuracy
        timeout: 10000, // 10 second timeout
        maximumAge: 0 // Don't use cached position
      }
    );
  };

  return (
    <Card className="glass-card animate-fade-in border-white/10">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base font-medium flex items-center text-white">
          <MapPin className="h-4 w-4 mr-2 text-blue-400" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter city or location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="backdrop-blur-sm bg-white/10 border-white/10 text-white placeholder:text-white/50"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full backdrop-blur-sm bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs md:text-sm"
            onClick={handleDetectLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                {!isMobile && "Detecting..."}
              </>
            ) : (
              <>
                <MapPin className="mr-1 h-3 w-3" />
                {isMobile ? "Current Location" : "Use Current Location"}
              </>
            )}
          </Button>
          
          {navigator.geolocation === undefined && (
            <div className="text-xs text-orange-400 flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              Geolocation unavailable
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default LocationSelector;
