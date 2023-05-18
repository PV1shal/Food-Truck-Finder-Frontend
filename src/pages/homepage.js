import dynamic from "next/dynamic";

const ClientMap = dynamic(() => import('../components/ClientMapComponent'), {
    ssr: false,
});

export default function Homepage(searchLocation) {

    return (
        <main>
            <ClientMap searchLocation={searchLocation.searchLocation} />
        </main>
    );
}
