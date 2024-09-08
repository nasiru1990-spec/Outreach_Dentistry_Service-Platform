import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  getFirestore,
  collection,
  getDocs,
  GeoPoint,
} from "firebase/firestore";

const containerStyle = {
  width: "100%",
  height: "400px",
};

function Map() {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [retirementHomes, setRetirementHomes] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("Error: The Geolocation service failed.");
        }
      );
    }

    // Fetch retirement homes from Firestore
    const fetchRetirementHomes = async () => {
      const db = getFirestore();
      const homesCollection = collection(db, "retirementHomes");
      const homesSnapshot = await getDocs(homesCollection);
      const homesList = homesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        position: {
          lat: doc.data().location.latitude,
          lng: doc.data().location.longitude,
        },
      }));
      setRetirementHomes(homesList);
    };

    fetchRetirementHomes();
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {retirementHomes.map((home) => (
          <Marker key={home.id} position={home.position} title={home.name} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
