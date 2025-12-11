"use client";

import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const WebSocketCameraPreview = ({ url, cameraId, customcss, streamType = "auto" }) => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [actualStreamType, setActualStreamType] = useState(null);

  useEffect(() => {
    if (!url) return;

    const cleanup = () => {
      if (socketRef.current) {
        if (socketRef.current.disconnect) {
          socketRef.current.disconnect();
        } else if (socketRef.current.close) {
          socketRef.current.close();
        }
        socketRef.current = null;
      }
      setIsConnected(false);
      setError(null);
    };

    // Auto-detect stream type if not specified
    let detectedType = streamType;
    if (streamType === "auto") {
      if (url.startsWith("ws://") || url.startsWith("wss://")) {
        detectedType = "websocket";
      } else if (url.startsWith("socket://")) {
        detectedType = "socketio";
      } else {
        setError("Unknown WebSocket URL format");
        return cleanup;
      }
    }

    setActualStreamType(detectedType);

    if (detectedType === "websocket") {
      handleWebSocketStream(url);
    } else if (detectedType === "socketio") {
      handleSocketIOStream(url);
    }

    return cleanup;
  }, [url, cameraId, streamType]);

  const handleWebSocketStream = (wsUrl) => {
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        
        // Send camera request if cameraId provided
        if (cameraId) {
          ws.send(JSON.stringify({
            type: 'subscribe',
            cameraId: cameraId,
            format: 'base64' // or 'binary'
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          // Handle different message types
          if (event.data instanceof Blob) {
            // Binary data (image frame)
            handleBinaryFrame(event.data);
          } else {
            // Try to parse as JSON first
            try {
              const data = JSON.parse(event.data);
              if (data.type === 'frame' && data.image) {
                handleBase64Frame(data.image);
              } else if (data.image || data.frame) {
                handleBase64Frame(data.image || data.frame);
              }
            } catch {
              // If not JSON, assume it's base64 image data
              handleBase64Frame(event.data);
            }
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        setError('WebSocket connection error');
        setIsConnected(false);
        console.error('WebSocket error:', error);
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        
        // Attempt to reconnect after delay if not a normal closure
        if (event.code !== 1000 && event.code !== 1001) {
          setTimeout(() => {
            if (!socketRef.current) {
              handleWebSocketStream(wsUrl);
            }
          }, 3000);
        }
      };

      socketRef.current = { close: () => ws.close() };
    } catch (error) {
      setError('Failed to create WebSocket connection');
      console.error('WebSocket creation error:', error);
    }
  };

  const handleSocketIOStream = (socketUrl) => {
    try {
      // Parse socket.io URL (socket://host:port/namespace)
      const cleanUrl = socketUrl.replace('socket://', 'http://');
      
      const socket = io(cleanUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        maxReconnectionAttempts: 10
      });

      socket.on('connect', () => {
        setIsConnected(true);
        setError(null);
        
        // Subscribe to camera stream
        if (cameraId) {
          socket.emit('subscribe-camera', {
            cameraId: cameraId,
            format: 'base64' // or 'binary'
          });
        } else {
          socket.emit('request-stream');
        }
      });

      // Handle different event names for camera frames
      const frameEvents = [
        'camera-frame', 
        'video-frame', 
        'stream-data', 
        'frame',
        'image-data',
        'mjpeg-frame'
      ];
      
      frameEvents.forEach(eventName => {
        socket.on(eventName, handleSocketFrame);
      });

      socket.on('connect_error', (error) => {
        setError(`Socket.IO connection error: ${error.message}`);
        console.error('Socket.IO connection error:', error);
      });

      socket.on('error', (error) => {
        setError(`Socket.IO error: ${error.message || error}`);
        console.error('Socket.IO error:', error);
      });

      socket.on('disconnect', (reason) => {
        setIsConnected(false);
      });

      socket.on('reconnect', (attemptNumber) => {
        setIsConnected(true);
        setError(null);
      });

      socketRef.current = socket;
    } catch (error) {
      setError('Failed to create Socket.IO connection');
      console.error('Socket.IO creation error:', error);
    }
  };

  const handleSocketFrame = (data) => {
    try {
      if (data.image || data.frame) {
        handleBase64Frame(data.image || data.frame);
      } else if (data instanceof ArrayBuffer || data instanceof Blob) {
        handleBinaryFrame(data);
      } else if (typeof data === 'string') {
        // Assume it's base64 encoded image
        handleBase64Frame(data);
      }
    } catch (error) {
      console.error('Error handling socket frame:', error);
    }
  };

  const handleBase64Frame = (base64Data) => {
    if (!canvasRef.current || !base64Data) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Clear and draw new frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    img.onerror = () => {
      console.error('Failed to load image frame');
    };

    // Handle base64 with or without data URL prefix
    const imageSrc = base64Data.startsWith('data:') 
      ? base64Data 
      : `data:image/jpeg;base64,${base64Data}`;
    
    img.src = imageSrc;
  };

  const handleBinaryFrame = (binaryData) => {
    if (!canvasRef.current || !binaryData) return;

    const blob = binaryData instanceof Blob ? binaryData : new Blob([binaryData]);
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        URL.revokeObjectURL(url);
        return;
      }
      
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      console.error('Failed to load binary frame');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const renderStatus = () => {
    if (error) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-red-400 text-center p-4">
            <div className="text-sm font-medium mb-1">Connection Error</div>
            <div className="text-xs opacity-75 max-w-xs break-words">{error}</div>
          </div>
        </div>
      );
    }

    if (!isConnected) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <div className="text-sm">Connecting to camera...</div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`relative w-full h-full rounded-lg bg-black overflow-hidden ${customcss || ""}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%',
          imageRendering: 'auto'
        }}
      />

      {renderStatus()}

      {/* Connection Status Indicator */}
      {isConnected && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs text-white">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <span>{actualStreamType?.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-xs">{isConnected ? 'LIVE' : 'OFFLINE'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSocketCameraPreview;
