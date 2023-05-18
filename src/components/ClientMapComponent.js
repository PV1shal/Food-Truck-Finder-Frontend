'use client';

import { useEffect, useState, Suspense, useContext } from 'react';
import 'leaflet/dist/leaflet.css';
import { ColorModeContext } from '../components/RootLayout';
import { Alert, Box, Card, CardContent, CircularProgress } from '@mui/material';
import getLatLong from '@/pages/api/getLatLong';
import { Close } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useLeafletContext } from 'react-leaflet';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

const truckIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/532/532857.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
});

function MapContent({ location, foodTruckMarkers }) {
    const { toggleColorMode, darkMode } = useContext(ColorModeContext);
    const map = useMap();

    useEffect(() => {
        if (location.latitude && location.longitude) {
            map.setView([location.latitude, location.longitude], 32);
        }
    }, [location, map]);

    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={
                    darkMode === 'dark'
                        ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
                        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
            />
            <Marker position={[location.latitude, location.longitude]}
                icon={
                    L.icon({
                        iconUrl: 'https://www.svgrepo.com/show/127575/location-sign.svg',
                        iconSize: [50, 50],
                        iconAnchor: [25, 50],
                        popupAnchor: [0, -50],
                    })
                }
            >
                <Popup>
                    <h1><b>You are here!</b></h1>
                </Popup>
            </Marker>
            {foodTruckMarkers}
        </>
    );
}

export default function ClientMapComponent(searchLocation) {
    const [location, setLocation] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [foodTruckMarkers, setFoodTruckMarkers] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [locationError, setLocationError] = useState(false);

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
        if (searchLocation.searchLocation !== '') {
            const getSearchAddress = async () => {
                try {
                    const coordinates = await getLatLong(searchLocation);
                    setLocation({ latitude: coordinates[1], longitude: coordinates[0] });
                } catch (error) {
                    setLocationError(true);
                    // console.error(error);
                }
            };

            getSearchAddress();
        }
    }, [searchLocation]);

    useEffect(() => {
        const getFoodTrucks = async () => {
            if (location.latitude && location.longitude) {
                const response = await fetch(`https://data.sfgov.org/resource/rqzj-sfat.json?$where=within_circle(location, ${location.latitude}, ${location.longitude}, 500)`);
                const data = await response.json();
                setTrucks(data);
                var markers = [];
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

    const getTrucksList = () => {
        if (trucks.length === 0) {
            return (
                <Card
                    sx={{
                        width: '20vw',
                        border: '1px solid black',
                        margin: '1rem',
                        padding: '1rem',
                    }}
                >
                    <CardContent>
                        <h1><b>No food trucks found!</b></h1>
                        <h2>Try searching for a different location.</h2>
                    </CardContent>
                </Card>
            )
        }
        return trucks.map((truck) => {
            return (
                <Card
                    key={truck.objectid}
                    sx={{
                        width: '20vw',
                        border: '1px solid black',
                        margin: '1rem',
                        padding: '1rem',
                    }}
                >
                    <CardContent>
                        <h1><b>{truck.applicant}</b></h1>
                        <h2>{truck.fooditems}</h2>
                        <p>{truck.locationdescription}</p>
                    </CardContent>
                </Card>
            )
        })
    }

    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                {isLoading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <CircularProgress />
                    </div>
                ) : (
                    typeof window !== 'undefined' && location.latitude && location.longitude && (
                        <div style={{
                            display: "flex",
                        }}>
                            <MapContainer
                                center={[location.latitude, location.longitude]}
                                zoom={18}
                                scrollWheelZoom={true}
                                style={{
                                    height: '93vh', width: '80%'
                                }}
                            >
                                <MapContent location={location} foodTruckMarkers={foodTruckMarkers} />
                            </MapContainer>
                            <Box
                                sx={{
                                    height: '93vh',
                                    overflowY: 'scroll',
                                    overflowX: 'hidden',
                                }}
                            >
                                <Card
                                    sx={{
                                        height: '5vh',
                                        border: '1px solid black',
                                        background: "#7d7dc2",
                                        borderRadius: "0px",
                                    }}
                                >
                                    <CardContent>
                                        <h2 style={{
                                            color: "white",
                                            fontSize: "18px",
                                            marginBottom: "1rem",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                        }}>Found {trucks.length} food trucks 500 meters near you!</h2>
                                    </CardContent>
                                </Card>
                                {getTrucksList()}
                            </Box>
                            {locationError && (
                                <Alert
                                    severity="error"
                                    variant='filled'
                                    action={
                                        <Close onClick={() => setLocationError(false)} />
                                    }
                                    sx={{
                                        position: 'absolute',
                                        zIndex: 10000,
                                        width: '100vw',
                                        fontWeight: 'bold',
                                    }}
                                >Error: Location Not Found!</Alert>
                            )}
                        </div>
                    )
                )}
            </Suspense>
        </main>
    );
}