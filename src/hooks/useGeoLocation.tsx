// geolocation custom hook

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export default function useGeoLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported.",
      });

      toast.error(
        "Geolocation is not supported. Please use a different browser."
      );
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => {
        setLocation({
          latitude: null,
          longitude: null,
          error: error.message,
        });

        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Please enable location services to create a report.");
        }
      }
    );
  };
  useEffect(() => {}, []);

  return { ...location, requestLocation };
}
