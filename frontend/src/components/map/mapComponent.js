import React, { useEffect, useState } from 'react';

const MapComponent = () => {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState(null);
  const [ReactLeaflet, setReactLeaflet] = useState(null);

  useEffect(() => {
    // Set CSR
    setIsClient(true);

    // Dynamically import Leaflet and React-Leaflet to avoid SSR issues
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        const leaflet = await import('leaflet');
        const reactLeaflet = await import('react-leaflet');
        
        // Fix for default markers
        delete leaflet.default.Icon.Default.prototype._getIconUrl;
        leaflet.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        setL(leaflet.default);
        setReactLeaflet(reactLeaflet);
      }
    };

    loadLeaflet();
  }, []);

  const locations = [
    {
      id: 1,
      name: "Bandung City Center",
      position: [-6.9175, 107.6191],
      description: "Pusat kota Bandung"
    },
    {
      id: 2,
      name: "Gedung Sate",
      position: [-6.9020, 107.6181],
      description: "Landmark terkenal di Bandung"
    },
    {
      id: 3,
      name: "ITB Ganesha",
      position: [-6.8915, 107.6107],
      description: "Institut Teknologi Bandung"
    },
     {
      id: 4,
      name: "Baltos",
      position: [-6.9000, 107.6107],
      description: "Baltos Lt 1"
    }
  ];

  // Don't render on server-side
  if (!isClient || !ReactLeaflet) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-600">Loading map...</div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = ReactLeaflet;

  return (
    <div className="w-full p-4 border border-gray-100 my-5 rounded-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-neutral-700 mb-1">Peta Lokasi Kamera</h2>
        <p className="text-neutral-600 text-sm">titik penyebaran lokasi kamera</p>
      </div>

      <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-300">
        <MapContainer
          center={[-6.9175, 107.6191]} // Bandung
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {locations.map((location) => (
            <Marker key={location.id} position={location.position}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-lg text-gray-800">{location.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{location.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {locations.map((location) => (
          <div key={location.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="font-semibold text-gray-800">{location.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{location.description}</p>
            <div className="text-xs text-gray-500 mt-2">
              Lat: {location.position[0]}, Lng: {location.position[1]}
            </div>
          </div>
        ))}
      </div>

      {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Fitur Map Component:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Interactive zoom dan pan</li>
          <li>• Multiple markers dengan popup</li>
          <li>• Responsive design dengan Tailwind CSS</li>
          <li>• SSR-safe (tidak error saat server-side rendering)</li>
          <li>• Menggunakan OpenStreetMap tiles (gratis)</li>
        </ul>
      </div> */}
    </div>
  );
};

export default MapComponent;