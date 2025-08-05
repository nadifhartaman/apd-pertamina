"use client";

import { useEffect, useState } from "react";

export default function BlobVideoPlayer({ videoUrl }) {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (error) {
        console.error("Failed to fetch video:", error);
      }
    };

    fetchVideo();

    // Cleanup: Revoke blob URL when component unmounts
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [videoUrl]);
    

  if (!blobUrl) return <div>Loading video...</div>;

  return (
    <video
      className="stream p-1 m-0"
      id="playerElement235"
      controls
      autoPlay
      muted
      src={blobUrl}
    />
  );
}
