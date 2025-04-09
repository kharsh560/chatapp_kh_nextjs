import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { parse } from "url";
import jwt from "jsonwebtoken"

// You can export this for use elsewhere if needed
const clients = new Map<string, WebSocket>();

export function setupWebSocketServer(server: HTTPServer) {
//   const wss = new WebSocketServer({ server, path: "/realTimeChat/ws" });
  const wss = new WebSocketServer({ noServer: true, path: "/realTimeChat/ws" });
    let decoded : {
        user: {
            name: string;
            email: string;
            sub: string;
            iat: number;
            exp: number;
            jti: string;
        },
        iat: number;
        exp: number;
    };
    server.on("upgrade", (req, socket, head) => {
        const { query } = parse(req.url!, true); // Extract query params
        const token = query.token as string; // Get clientId from URL

        try {
            const decodedToken = jwt.verify(token, process.env.WEB_SOCKET_VALIDATION_SECRET as string);
            if (typeof decodedToken === "object" && decodedToken !== null) {
                decoded = decodedToken as {
                    user: {
                        name: string;
                        email: string;
                        sub: string;
                        iat: number;
                        exp: number;
                        jti: string;
                    },
                    iat: number;
                    exp: number;
                };
            } else {
                throw new Error("Invalid token payload");
            }
            // console.log("decoded token: ", decoded);
        } catch (error) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }

        if (clients.has(decoded.user.sub)) {
            console.log("This client already exists!");
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }
        

        // If authentication passes, upgrade the connection.
        wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
        });
  });

  wss.on("connection", (ws: WebSocket) => {
    // const clientId = uuidv4();
    const clientId = decoded.user.sub;
    clients.set(clientId, ws);

    console.log("Client connected with ID:", clientId);

    ws.send(JSON.stringify({ system: "Welcome!", clientId, name: decoded.user.name }));

    ws.on("message", (data, isBinary) => {
      console.log(`Message from ${clientId}:`, data.toString());

      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        console.log(clients.size);
        if (client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    });

    ws.on("close", () => {
      clients.delete(clientId);
      console.log(clients.size);
      console.log(`Socket connection closed for ${clientId}`);
    });
  });
}
