// Map.tsx
import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const API_KEY = "AIzaSyA-BAdaQ7CAlBniXGzQTmAfMbbwqYiWkkQ";

interface MapProps {
  address: string;
}

export const Map: React.FC<MapProps> = ({ address }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });

  const geocodeAddress = useCallback(async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ lat, lng });
      } else {
        setError("Dirección no encontrada.");
      }
    } catch (err) {
      setError("Error al geolocalizar la dirección.");
    }
  }, [address]);

  useEffect(() => {
    if (isLoaded) {
      geocodeAddress();
    }
  }, [isLoaded, geocodeAddress]);

  if (loadError) return <div>Error cargando el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="h-full w-full">
      {location && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={16}
        >
          <Marker position={location} />
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
