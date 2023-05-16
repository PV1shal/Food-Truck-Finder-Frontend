import { useEffect, useState, Suspense, useContext } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { ColorModeContext } from '../components/RootLayout';
import { CircularProgress } from '@mui/material';


const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), {
    ssr: false,
});

const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), {
    ssr: false,
});

const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), {
    ssr: false,
});

const Popup = dynamic(() => import('react-leaflet').then((module) => module.Popup), {
    ssr: false,
});

let L;
if (typeof window !== 'undefined') {
    L = require('leaflet');
}

export default function Homepage() {
    const [location, setLocation] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Track the loading state
    const { toggleColorMode, darkMode } = useContext(ColorModeContext);
    const [foodTruckMarkers, setFoodTruckMarkers] = useState([]); // Track the food truck markers
    let truckIcon;
    if (typeof window !== 'undefined') {
        truckIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/532/532857.png',
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50],
        });
    }

    useEffect(() => {
        const getLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                }
            );
        };

        getLocation();
    }, []);

    useEffect(() => {
        const getFoodTrucks = async () => {
            if (location.latitude && location.longitude) {
                const response = await fetch(`https://data.sfgov.org/resource/rqzj-sfat.json?$where=within_circle(location, ${location.latitude}, ${location.longitude}, 500)`);
                const data = await response.json();
                var markers = [];
                console.log(data);
                data.forEach((foodTruck) => {
                    markers.push(
                        <Marker
                            key={foodTruck.objectid}
                            position={[foodTruck.latitude, foodTruck.longitude]}
                            icon={truckIcon}
                        >
                            <Popup>
                                <h1><b>Name: </b>{foodTruck.applicant}</h1><br />
                                <h2><b>Food items: </b>{foodTruck.fooditems}</h2>
                                <p><b>Location: </b>{foodTruck.locationdescription ? foodTruck.locationdescription : "NA"}</p>
                            </Popup>
                        </Marker>
                    );
                });
                setFoodTruckMarkers(markers);
                setIsLoading(false);
            }
        };

        getFoodTrucks();
    }, [location]);

    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                {isLoading ? ( // Show the fallback loading component when still loading
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <CircularProgress />
                    </div>
                ) : (
                    typeof window !== 'undefined' && location.latitude && location.longitude && (
                        <MapContainer center={[location.latitude, location.longitude]} zoom={35} scrollWheelZoom={true} style={{ height: '93vh', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url={
                                    darkMode === 'dark'
                                        ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
                                        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                }
                            />
                            <Marker position={[location.latitude, location.longitude]} icon={
                                L.icon({
                                    iconUrl: 'https://www.svgrepo.com/show/127575/location-sign.svg',
                                    iconSize: [50, 50],
                                    iconAnchor: [25, 50],
                                    popupAnchor: [0, -50],
                                })
                            }></Marker>
                            {foodTruckMarkers}
                        </MapContainer>
                    )
                )}
            </Suspense>
        </main>
    );
}
