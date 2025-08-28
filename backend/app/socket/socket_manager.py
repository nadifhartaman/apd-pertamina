import socketio
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',  # In production, replace with specific origins
)

# Create ASGI app for Socket.IO
sio_app = socketio.ASGIApp(sio)

# Socket.IO manager class
class SocketManager:
    def __init__(self):
        self.connected_clients = {}
        self.setup_events()
    
    def setup_events(self):
        @sio.event
        async def connect(sid, environ):
            logger.info(f"Client connected: {sid}")
            self.connected_clients[sid] = {
                'sid': sid,
                'data': {}
            }
            await sio.emit('connection_status', {'status': 'connected', 'sid': sid}, to=sid)
        
        @sio.event
        async def disconnect(sid):
            logger.info(f"Client disconnected: {sid}")
            if sid in self.connected_clients:
                del self.connected_clients[sid]
        
        @sio.event
        async def subscribe_camera(sid, data):
            camera_id = data.get('camera_id')
            if camera_id:
                logger.info(f"Client {sid} subscribed to camera {camera_id}")
                if sid in self.connected_clients:
                    self.connected_clients[sid]['data']['camera_id'] = camera_id
                await sio.emit('subscription_status', {'status': 'subscribed', 'camera_id': camera_id}, to=sid)
    
    async def emit_detection_result(self, camera_id: str, detection_data: Dict[str, Any]):
        """Emit detection result to clients subscribed to a specific camera"""
        logger.info(f"Emitting detection result for camera {camera_id}")
        
        # Find clients subscribed to this camera
        for sid, client_data in self.connected_clients.items():
            if client_data.get('data', {}).get('camera_id') == camera_id:
                await sio.emit('result_detection_2', detection_data, to=sid)
        
        # Also broadcast to all clients for general monitoring
        await sio.emit('detection_broadcast', {
            'camera_id': camera_id,
            'timestamp': detection_data.get('timestamp'),
            'summary': detection_data.get('summary')
        })

# Create socket manager instance
socket_manager = SocketManager()