"use client";

import { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";


const Row = ({ index, style, data }) => {
  const event = data[index];

  if (!event) {
    return (
      <div style={style} className="flex gap-1 items-center content-center">
        <div className="w-full p-2 text-center text-gray-500">No data</div>
      </div>
    );
  }

  return (
    <div style={style} className="flex gap-1 items-center content-center border-b border-gray-200 bg-gray-100/90 rounded-md overflow-x-auto overflow-y-hidden h-fit scrollbar-thin-custom">
      <div className="w-1/3">
        {event.image ? (
          <img
            src={event.image}
            className="w-full min-w-28 h-20 object-cover rounded"
          />
        ) : (
          <div className="w-full h-20 bg-black/90 text-white flex items-center justify-center rounded text-xs">
            No image
          </div>
        )}
      </div>
      <div className="w-full flex">
        <div className="w-1/2 p-2">
          <div className="font-medium text-sm capitalize">ID Simpang: {event?.id_simpang || 'N/A'}</div>
          <div className="text-xs truncate">{event?.timestamp.split('T')[0] || 'N/A'}</div>
          <div className="text-xs text-gray-600">{event?.timestamp.split('T')[1].split('.')[0] || 'N/A'}</div>
        </div>
        <div className="w-1/2 flex">
          {event.data.map((data, i) => (
            <div key={i} className="flex gap-1 w-full">
              <div className="w-1/2 p-2">
                <div className="font-xs text-sm text-nowrap">Jenis: {data?.class || 'N/A'}</div>
                <div className="text-xs capitalize text-nowrap">Arah: {data?.dari_arah || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function RecentVehicle ({ hg, data, allData, streamData }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataVehicle, setDataVehicle] = useState([]);


  useEffect(() => {
    if (data?.message?.detections?.length > 0) {
      console.log(data);
      setVehicles(prev => [
        ...prev,
        { data: data.message.detections, image: data.message.image_url, timestamp: data.message.timestamp, id_simpang: data.message.id_simpang }
      ]);
    }
  }, [data])

  useEffect(() => {
    console.log(vehicles)
  }, [vehicles])

  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/vehicle/recent");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load recent vehicles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    import("@/data/DataHistory.json").then((data) => setDataVehicle(data.default || []))
    // fetchVehicles();
  }, []);


  useEffect(() => {
    if (!allData) return;

    const newVehicles = [];

    allData
      .filter(fB => fB.camera?.some(d => d.socket_event !== "not_yet_assign"))
      .forEach((dataCamera) => {
        const firstCamera = dataCamera?.camera?.[0];
        const cameraId = firstCamera?.id;
        const stream = cameraId ? streamData[cameraId] : null;

        if (stream?.message?.detections?.length > 0) {
          const alreadyExists = vehicles.some(
            v => v.timestamp === stream.message.timestamp && v.id_simpang === stream.message.id_simpang
          );
          if (!alreadyExists) {
            newVehicles.push({
              data: stream.message.detections,
              image: stream.message.image_url,
              timestamp: stream.message.timestamp,
              id_simpang: stream.message.id_simpang,
            });
          }
        }
      });

    if (newVehicles.length > 0) {
      setVehicles(prev => [...prev, ...newVehicles]);
    }
  }, [allData, streamData]);

  return (
    <div className="bg-[#314385]/10 h-full p-4 rounded-xl text-xs xl:max-w-3xl">

      <div className="grid grid-cols-3 gap-2">
        {/* <button className="btn bg-[#314385]/90 text-white">Snapshot</button> */}
        <div title="snapshot" className="bg-[#314385]/90 text-white p-2 font-semibold rounded-xl inline-block text-center content-center">Snapshot</div>
        <div title="Channel Time Trigger Name" className="bg-[#314385]/90 text-white p-2 font-semibold rounded-xl inline-block text-center content-center truncate">Channel Time Trigger Name</div>
        <div title="Type Origin Object ID" className="bg-[#314385]/90 text-white p-2 font-semibold rounded-xl inline-block text-center content-center truncate">Type Origin Object ID</div>
      </div>
      <div className="flex gap-2 my-2 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search recent events"
            className="w-full border rounded-md input input-sm bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <Search className="absolute right-3 top-2 text-gray-400" size={20} /> */}
        </div>
        <button className="bg-gray-800 text-white btn btn-sm rounded-md">
          Clear
        </button>
      </div>

      <div className={`mt-[5%] overflow-y-auto scrollbar-thin-custom`}>
        <List
          height={hg ? hg : 350} // tinggi container
          itemCount={Array.isArray(vehicles) ? vehicles.length : 0}
          itemSize={90} // tinggi tiap item (px)
          width={"100%"}
          itemData={vehicles}
        >
          {Row}
        </List>
      </div>
      {/* {dataVehicle?.map(event => (
        <div key={event.id} className="flex flex-row gap-4 h-fit">
          <div className="w-1/3">
            {event.image && (
              <img
                src={event.image}
                alt="Event snapshot"
                className="w-full h-24 object-cover"
              />
            ) || (
                <div className="w-full h-24 bg-black/90 text-white flex items-center justify-center">
                  No image
                </div>
              )}

          </div>
          <div className="w-1/3 p-2">
            <div className="font-medium">{event.channel}</div>
            <div className="text-xs">{event.time}</div>
            <div className="text-xs">{event.triggerName}</div>
          </div>
          <div className="w-1/3 p-2">
            <div className="font-medium">{event.type}</div>
            <div className="text-xs">{event.origin}</div>
            <div className="text-xs">{event.objectId}</div>
          </div>
        </div>
      ))} */}
    </div >)
}