import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

export default function LeafletMap() {
    useEffect(() => {
        // Code that relies on browser-specific APIs can be placed here
        // This code will only run in the browser environment
    }, []);

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
}
