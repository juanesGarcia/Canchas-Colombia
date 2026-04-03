import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const API_KEY = "AIzaSyA-BAdaQ7CAlBniXGzQTmAfMbbwqYiWkkQ";

interface MapProps {
  lat: number;
  lng: number;
}

export const Map: React.FC<MapProps> = ({ lat, lng }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: ["places"], // puedes quitar esto si no usas places
  });

  useEffect(() => {
    if (isLoaded) {
      if (lat && lng) {
        setLocation({ lat, lng });
      } else {
        setError("Coordenadas no válidas.");
      }
    }
  }, [isLoaded, lat, lng]);

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