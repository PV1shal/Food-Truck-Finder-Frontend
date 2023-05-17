import axios from "axios";

export default async function getLatLong(address) {
    try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: address.searchLocation,
                format: "geocodejson",
            },
        });

        if (response.data.features.length > 0) {
            const coordinates = response.data.features[0].geometry.coordinates;
            return coordinates;
        } else {
            throw new Error("No results found");
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
