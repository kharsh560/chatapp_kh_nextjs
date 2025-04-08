import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

// You can export this for use elsewhere if needed
const clients = new Map<string, WebSocket>();

export function setupWebSocketServer(server: HTTPServer) {
  const wss = new WebSocketServer({ server, path: "/realTimeChat/ws" });

  wss.on("connection", (ws: WebSocket) => {
    const clientId = uuidv4();
    clients.set(clientId, ws);

    console.log("Client connected with ID:", clientId);

    ws.send(JSON.stringify({ system: "Welcome!", clientId }));

    ws.on("message", (data, isBinary) => {
      console.log(`Message from ${clientId}:`, data.toString());

      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    });

    ws.on("close", () => {
      clients.delete(clientId);
      console.log(`Socket connection closed for ${clientId}`);
    });
  });
}
