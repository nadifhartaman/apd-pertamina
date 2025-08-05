"use client";

import { useEffect, useState } from "react";

function NotComplete() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Set launch date to 30 days from now
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);
      
      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
      
      if (difference <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-3">Coming Soon</h1>
            <div className="h-1 w-24 bg-blue-400 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg md:text-xl">
              We're working on something amazing for our Survei feature!
            </p>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex justify-center items-center space-x-4 md:space-x-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-400 text-white rounded-lg w-16 md:w-20 h-16 md:h-20 flex items-center justify-center text-2xl md:text-3xl font-bold">
                {days}
              </div>
              <p className="text-gray-600 mt-2">Days</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-400 text-white rounded-lg w-16 md:w-20 h-16 md:h-20 flex items-center justify-center text-2xl md:text-3xl font-bold">
                {hours}
              </div>
              <p className="text-gray-600 mt-2">Hours</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-400 text-white rounded-lg w-16 md:w-20 h-16 md:h-20 flex items-center justify-center text-2xl md:text-3xl font-bold">
                {minutes}
              </div>
              <p className="text-gray-600 mt-2">Minutes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-400 text-white rounded-lg w-16 md:w-20 h-16 md:h-20 flex items-center justify-center text-2xl md:text-3xl font-bold">
                {seconds}
              </div>
              <p className="text-gray-600 mt-2">Seconds</p>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </div>
  );
}

export default NotComplete;