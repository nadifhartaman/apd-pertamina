"use client"
import { useState, useEffect } from 'react';

const ClockBar = () => {
  const [timeNow, setTimeNow] = useState("00:00:00"); 
  const days = {
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    id: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  }; 
  const language = "id"; 
  const todayIndex = new Date().getDay(); 
  const today = days[language][todayIndex]; 

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" });
      setTimeNow(now)
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-center bg-base-200 p-2 text-base-800 text-sm font-semibold">
      {timeNow} - {today}
    </div>
  );
};
export default ClockBar;