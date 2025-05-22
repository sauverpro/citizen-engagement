import { useEffect, useRef } from 'react';

export default function useComplaintWebSocket(token, onStatusUpdate) {
  const wsRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const ws = new WebSocket('ws://localhost:5000');
    wsRef.current = ws;
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'STATUS_UPDATE') {
        onStatusUpdate(data);
      }
    };
    return () => ws.close();
  }, [token, onStatusUpdate]);

  return wsRef;
}
