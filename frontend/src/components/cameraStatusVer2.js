import { useState, useEffect } from 'react';

// Sample JSON data for camera status
const sampleData = [
  { start: "00:00", end: "06:00", status: "on" },
  { start: "06:00", end: "08:00", status: "off" },
  { start: "08:00", end: "09:00", status: "on" },
  { start: "09:00", end: "10:00", status: "off" },
  { start: "10:00", end: "12:00", status: "on" }
];

export default function CameraStatusTimeline() {
  const [cameraData, setCameraData] = useState(sampleData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // In a real application, you would fetch the data from an API
  // This is just a simulation with the sample data
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setCameraData(sampleData);
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Convert time string (HH:MM) to minutes since midnight
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  // Calculate total day minutes (24 hours = 1440 minutes)
  const totalDayMinutes = 24 * 60;
  
  // Calculate width percentage for each time segment
  const calculateWidth = (start, end) => {
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    return ((endMinutes - startMinutes) / totalDayMinutes) * 100;
  };
  
  if (isLoading) return <div className="text-center p-4">Loading camera status data...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error loading data: {error}</div>;
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 my-5">
      
      <div className="w-full h-12 flex rounded overflow-hidden mb-2">
        {cameraData.map((item, index) => (
          <div 
            key={index}
            className={`h-full ${item.status === 'on' ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${calculateWidth(item.start, item.end)}%` }}
            title={`${item.start} - ${item.end}: ${item.status === 'on' ? 'Camera On' : 'Camera Off'}`}
          />
        ))}
        
        {/* Fill the rest of the day with gray if data doesn't cover full 24 hours */}
        {cameraData.length > 0 && timeToMinutes(cameraData[cameraData.length - 1].end) < totalDayMinutes && (
          <div 
            className="h-full bg-gray-300"
            style={{ 
              width: `${(totalDayMinutes - timeToMinutes(cameraData[cameraData.length - 1].end)) / totalDayMinutes * 100}%` 
            }}
            title={`${cameraData[cameraData.length - 1].end} - 24:00: No Data`}
          />
        )}
      </div>
      
      {/* Time labels */}
      <div className="w-full flex justify-between text-sm text-gray-600">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:59</span>
      </div>
      
      {/* <div className="mt-4 flex items-center text-sm">
        <div className="w-4 h-4 bg-green-500 mr-1"></div>
        <span className="mr-4">Camera On</span>
        <div className="w-4 h-4 bg-red-500 mr-1"></div>
        <span className="mr-4">Camera Off</span>
        <div className="w-4 h-4 bg-gray-300 mr-1"></div>
        <span>No Data</span>
      </div>
      
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Camera Status Data</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Start Time</th>
                <th className="py-2 px-4 border">End Time</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {cameraData.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{item.start}</td>
                  <td className="py-2 px-4 border">{item.end}</td>
                  <td className={`py-2 px-4 border ${item.status === 'on' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.status === 'on' ? 'Camera On' : 'Camera Off'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}