'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
// import VideoStream from '../components/videoStream';
import CCTVStream from '../components/cctvStream';
import CameraStatusTimeline from "@/components/cameraStatusTime";
import { maps, cameras, logCamera } from '@/lib/apiService';
import AdaptiveVideoPlayer from './adaptiveCameraStream';

const CameraStream = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [streamData, setStreamData] = useState({});
  const [activeCamera, setActiveCamera] = useState('');
  const [dataCameras, setDataCameras] = useState([]);
  const [cameraLogs, setCameraLogs] = useState({});

  // Utility functions
  const formatDateToInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const filterLogsByDate = (logs, targetDate) => {
    if (!Array.isArray(logs) || !targetDate) return [];

    // Format target date ke YYYY-MM-DD
    const targetDateStr = new Date(targetDate).toISOString().split('T')[0];

    return logs.filter(log => {
      if (!log.recorded_at) return false;

      // Ambil tanggal dari recorded_at
      const logDateStr = new Date(log.recorded_at).toISOString().split('T')[0];
      return logDateStr === targetDateStr;
    });
  };

  const getLogCamera = async (cameraId, filterDate = null) => {
    if (!cameraId) return;

    try {
      const res = await logCamera.getById(cameraId);
      const logs = Array.isArray(res?.data?.logs) ? res.data.logs : [];

      // Filter logs berdasarkan tanggal jika filterDate disediakan
      const filteredLogs = filterDate ? filterLogsByDate(logs, filterDate) : logs;

      // Filter hanya status mati (status = 0) jika diperlukan
      const offlineLogs = filteredLogs.filter(log => log.status === 0);

      setCameraLogs(prev => ({
        ...prev,
        [cameraId]: {
          all: filteredLogs,           // Semua log untuk tanggal tersebut
          offline: offlineLogs,        // Hanya log dengan status mati
          raw: logs                    // Data mentah tanpa filter
        }
      }));

      return {
        all: filteredLogs,
        offline: offlineLogs,
        raw: logs
      };
    } catch (err) {
      console.error("Error fetching camera logs:", err);
      setCameraLogs(prev => ({
        ...prev,
        [cameraId]: {
          all: [],
          offline: [],
          raw: []
        }
      }));
    }
  };

  const [dateInput, setDateInput] = useState(() => formatDateToInput(new Date()));

  useEffect(() => {
    if (activeCamera && dateInput) {
      getLogCamera(activeCamera, dateInput);
    }
  }, [activeCamera, dateInput])

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await cameras.getAll();
        // console.log("Hasil getAll:", res); 
        const detectedCameras = res.data.cameras.filter(
          b => b.status == 1
        );
        setDataCameras(detectedCameras);
        // console.log(detectedCameras)
      } catch (err) {
        console.error("Failed to fetch cameras:", err);
      }
    };

    fetchCameras();
  }, []);

  useEffect(() => {
    const socket = io('https://sxe-data.layanancerdas.id');

    socket.on('connect', () => {
      console.log('Socket connected');
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected'); 
      setSocketConnected(false);
    });

    dataCameras.forEach(cam => {
      if (cam?.socket_event && cam?.id && cam?.socket_event !== "not_yet_assign") {
        socket.on(cam.socket_event, (data) => {
          // console.log(cam)
          setStreamData(prev => ({ ...prev, [cam.id]: data }));
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [dataCameras]);

  useEffect(() => {
    if (dataCameras.length > 0) {
      dataCameras.forEach(cam => {
        if (cam?.id) {
          getLogCamera(cam.id, dateInput);
        }
      });
    }
  }, [dataCameras, dateInput]);

  // useEffect(() => {
  //   console.log("Logs untuk kamera ID", cameraLogs);
  // }, [cameraLogs])

  useEffect(() => {
    const today = new Date();
    setDateInput(formatDateToInput(today));
  }, []);

  const videoStreamCameras = dataCameras.filter(cam => cam.socket_event === "not_yet_assign");
  const cctvStreamCameras = dataCameras.filter(cam => cam.socket_event !== "not_yet_assign");

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-5">
        {/* Video Streams - untuk kamera dengan socket_event = "not_yet_assign" */}
        {/* {videoStreamCameras.map((cam) => {
      console.log(cam.url) 
      return(
        <div key={cam.id} className="bg-base-200 rounded-lg shadow-md overflow-hidden">
          <VideoStream
            videoUrl={cam.url}
            title={`Video ${cam.name}`}
            large
            onClick={() => console.log(`Clicked on ${cam.name}`)}
          />
          <div className="p-3 bg-gray-100">
            <p className="text-sm text-gray-600">Stream Type: HLS</p>
            <p className="text-sm text-gray-600">Status: Video Stream</p>
            <p className="text-sm text-gray-600">Socket Event: {cam.url} </p>
          </div>
        </div>
      )})} */}
        {videoStreamCameras.map((cam) => {
          return (
            <div key={cam.id} className="bg-base-200 rounded-lg shadow-md overflow-hidden">
              <AdaptiveVideoPlayer
                videoUrl={cam.url}
                title={`Video ${cam.name}`}
                large
                onClick={() => console.log(`Clicked on ${cam.name}`)}
              />
            </div>
          )
        })}
      </div>
              <div className="h-fit bg-base-200/90 p-4 rounded-3xl backdrop-blur-sm shadow-base-100 my-2" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-5">
        {/* CCTV Streams - untuk kamera dengan socket_event selain "not_yet_assign" */}
        {cctvStreamCameras.map((cam) => {
          // console.log(dateInput);
          return (
            <div key={cam.id} className="bg-base-200 rounded-lg shadow-md overflow-hidden">
              <CCTVStream
                data={streamData[cam.id]}
                title={`CCTV ${cam.name}`}
                large
                onClick={() => setActiveCamera(cam.camera?.id || cam.id)}
              />
              <CameraStatusTimeline
                cameraStatusData={cameraLogs[cam.id]?.all || []}
                selectedDate={dateInput}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default CameraStream;
