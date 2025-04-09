import express from "express";
import http, { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken"; // For generating tokens

const SECRET_KEY = "your-secret-key";
const clients = new Map<string, WebSocket>();

// Function to create a token (could include expiry, etc.)
function createToken(payload: any) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "5m" }); // token valid for 5 minutes
}

function setupWebSocketServer(server: HTTPServer) {
  const wss = new WebSocketServer({ noServer: true, path: "/realTimeChat/ws" });

  server.on("upgrade", (req, socket, head) => {
    // Manually parse cookies from the request headers.
    const cookieHeader = req.headers.cookie || "";
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      acc[name] = rest.join("=");
      return acc;
    }, {} as Record<string, string>);

    // Option 1: Validate via cookies.
    if (!cookies.auth || cookies.auth !== "your-auth-token") {
      // Option 2: Alternatively, validate via token in query parameter.
      const urlParams = new URLSearchParams(req.url?.split("?")[1]);
      const token = urlParams.get("token");
      try {
        if (!token || !jwt.verify(token, SECRET_KEY)) {
          socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
          socket.destroy();
          return;
        }
      } catch (err) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }
    }

    // If authentication passes, upgrade the connection.
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws: WebSocket, req) => {
    const clientId = uuidv4();
    clients.set(clientId, ws);
    console.log("Client connected with ID:", clientId);
    ws.send(JSON.stringify({ system: "Welcome!", clientId }));

    ws.on("message", (data, isBinary) => {
      console.log(`Message from ${clientId}:`, data.toString());
      // Broadcast to all connected clients.
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

const app = express();
app.use(cookieParser());

// HTTP endpoint for initial authentication and token issuance.
app.get("/initializeWSserver", (req, res) => {
  // Check auth via cookies or any other middleware.
  if (!req.cookies || req.cookies.auth !== "your-auth-token") {
    return res.status(401).send("Unauthorized");
  }
  // Generate a token for WS connection.
  const token = createToken({ user: req.cookies.user || "unknown" });
  res.send({ message: "Authenticated! Use the token to connect.", token });
});

const server = http.createServer(app);

// Initialize WebSocket server once.
setupWebSocketServer(server);

server.listen(8000, () => {
  console.log("Server listening on port 8000");
});
