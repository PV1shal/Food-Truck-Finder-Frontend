
export default async function getTrucks(location) {
    try {
        const response = await fetch(`https://data.sfgov.org/resource/rqzj-sfat.json?$where=within_circle(location, ${location.latitude}, ${location.longitude}, 500)`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}