import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function SocketConnection() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io('https://sxe-data.layanancerdas.id');
    setSocket(socketInstance);

    // Connection event handlers
    socketInstance.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('Connected');
      console.log('Connected to socket server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setConnectionStatus('Disconnected');
      console.log('Disconnected from socket server');
    });

    socketInstance.on('connect_error', (error) => {
      setConnectionStatus('Connection Error');
      console.error('Connection error:', error);
    });

    // Listen to result_detection_2 topic
    socketInstance.on('result_detection_2', (data) => {
      console.log('Received data from result_detection_2:', data);
      setMessages(prev => [...prev, {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        data: data
      }]);
    });

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  const reconnect = () => {
    if (socket) {
      socket.disconnect();
      socket.connect();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Socket.IO Connection</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`font-medium ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {connectionStatus}
            </span>
          </div>
          <button 
            onClick={reconnect}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reconnect
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">
            Topic: result_detection_2
          </h2>
          <button 
            onClick={clearMessages}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
          >
            Clear Messages
          </button>
        </div>
        
        <div className="bg-gray-50 border rounded-lg p-4 h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">Waiting for messages...</p>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div key={message.id} className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(message.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p><strong>Server:</strong> https://sxe-data.layanancerdas.id</p>
        <p><strong>Topic:</strong> result_detection_2</p>
        <p><strong>Messages Received:</strong> {messages.length}</p>
      </div>
    </div>
  );
}