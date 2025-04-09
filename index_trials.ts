// import { WebSocketServer, WebSocket } from "ws";
// import { v4 as uuidv4 } from "uuid";


// const wss = new WebSocket.Server({port: 8080});
// const clients = new Map<string, WebSocket>();

// wss.on("connection", (ws) => {
//     const clientId = uuidv4(); // Generate unique ID
//     clients.set(clientId, ws);
//     // console.log("WS connected at the port: 8080!")
//     // ws.send("Hey there! From Server!");
//     console.log("🆕 Client connected with ID:", clientId);

//     ws.send(JSON.stringify({ system: "Welcome!", clientId }));
//     // ws.on("message", (data, isBinary) => {
//     //     // console.log("📨 Received from client:", data.toString());
//     //     // const parsedData = JSON.parse(data.toString());
//     //     // console.log(`${parsedData.userName} connected!`);
//     //     // clients.set(parsedData.userName, ws);
//     //     ws.send(data, {binary: isBinary});
//     // })
    
//     ws.on("message", (data, isBinary) => {
//         console.log(`📨 Message from ${clientId}:`, data.toString());
//         // const parsedData = JSON.parse(data.toString());
//         // if (!clientMap.has(ws)) {
//         //     clientMap.set(ws, parsedData.userName);
//         // }

//         wss.clients.forEach((client) => {
//             // console.log(client);
//             if (client.readyState == WebSocket.OPEN) {
//                 // if (parsedData.userName === clientMap[ws])
//                 client.send(data, {binary: isBinary});
//             }
//         })

//         // clients.forEach((client) => {
//         //     if (clients[clientId].)
//         // })

//         // for (const key of clients.keys()) {
//         //     if (key != clientId) {
//         //         clients[key].send(data, {binary: isBinary});
//         //     }
//         // }

//         // for (const key of clients.keys()) {
//         //     if (key !== clientId) {
//         //         const clientSocket = clients.get(key);
//         //         if (clientSocket?.readyState === WebSocket.OPEN) {
//         //         clientSocket.send(data, { binary: isBinary });
//         //         }
//         //     }
//         // }
//     })

//     ws.on("close", () => {
//         // ws.on("message", (data, isBinary) => {
//         //     const parsedData = JSON.parse(data.toString());
//         //     console.log(`${parsedData.userName} is going to be disconnected. (Server)!`);
//         //     if (parsedData.userName && clients.has(parsedData.userName)) {
//         //         clients.delete(parsedData.userName);
//         //         console.log(`${parsedData.userName} Deleted from clients. (Server)!`);
//         //     }
//         // })
//         // Doesn't work!
//         // console.log("Clients Before: ",clientMap.size);
//         // clientMap.delete(ws);
//         // console.log("Clients After: ",clientMap.size);
//         clients.delete(clientId);
//         ws.send("Socket connection closed!");
//         console.log(`Socket connection closed for ${clientId}`);
//     })
// })








// // import express from "express";
// // import { createServer } from "http";
// // import { WebSocketServer, WebSocket } from "ws";
// // import jwt from "jsonwebtoken";
// // import { parse } from "url";
// // import dotenv from "dotenv";

// // dotenv.config();

// // const app = express();

// // // Create HTTP server from Express app
// // const server = createServer(app);

// // server.listen(8080, () => {
// //   console.log("Server running on port 8080");
// // });

// // // Create WebSocket server attached to the HTTP server
// // const wss = new WebSocketServer({ server });

// // wss.on("headers", (headers, req) => {
// //   headers.push("Access-Control-Allow-Origin: *");
// // });

// // // Map to hold active WebSocket connections (optional)
// // const clients = new Map<string, WebSocket>();

// // wss.on("connection", (ws, req) => {
// //   // Extract token from query parameters e.g. ws://localhost:8080?token=YOUR_JWT_TOKEN
// //   console.log("New connection attempt...");

// //     ws.on("error", (err) => {
// //     console.error("WebSocket error:", err);
// //   });

// //   const { query } = parse(req.url!, true);
// //   const username = query.username as string;

// //   if (!username) {
// //     console.log("No token provided. Closing connection.");
// //     ws.close();
// //     return;
// //   }
// //     //   Optionally, attach the user details to the WebSocket instance
// //     clients.set(username, ws);
// //     (ws as any).user = username;

// //   ws.on("message", (data, isBinary) => {
// //     console.log("Received message:", data.toString());
// //     // Here, you can process the incoming messages further
// //   });


// //   ws.on("close", () => {
// //     // Remove the connection from the map when the client disconnects
// //     const user = (ws as any).user;
// //     if (user) {
// //       clients.delete(username);
// //       console.log(`User ${username} disconnected`);
// //     }
// //   });



// //   ws.send(`Hello ${username}, WebSocket connection established! : From Backend!`);
// // });




// // import express from "express";
// // import { WebSocketServer, WebSocket } from "ws";
// // import { parse } from "url";

// // const app = express();
// // const httpServer = app.listen(8080, () => console.log("Server running on port 8080"));
// // const wss = new WebSocketServer({ server: httpServer });

// // // Dummy token verification function
// // const verifyToken = (token: string) => {
// //   // In a real app, verify the token (e.g., JWT) and return user details if valid.
// //   // Return null or throw error if invalid.
// //   if (token === "valid-token") {
// //     return { id: "user123", name: "John Doe" };
// //   }
// //   return null;
// // };

// // wss.on("connection", (ws, req) => {
// //   // Extract token from query parameters (e.g., ws://localhost:8080?token=valid-token)
// //   const { query } = parse(req.url!, true);
// //   const token = query.token as string;

// //   const user = verifyToken(token);
// //   if (!user) {
// //     console.log("Invalid token. Closing connection.");
// //     ws.close();
// //     return;
// //   }

// //   // Attach user details to the WebSocket instance
// //   (ws as any).user = user;
// //   console.log(`User ${user.name} connected via WebSocket`);

// //   ws.on("message", (data) => {
// //     console.log(`Message from ${user.name}: ${data}`);
// //     // Process the message...
// //   });

// //   ws.on("close", () => {
// //     console.log(`User ${user.name} disconnected`);
// //   });

// //   ws.send(`Hello ${user.name}, WebSocket connection established!`);
// // });



// // import express from "express";
// // import { WebSocketServer, WebSocket } from "ws";
// // import { parse } from "url"; // Extracts query params

// // const app = express();
// // const clients = new Map<string, WebSocket>(); // Store clientId -> WebSocket

// // const httpServer = app.listen(8080, () => console.log("Server running on port 8080"));

// // const wss = new WebSocketServer({ server: httpServer });

// // wss.on("connection", (ws, req) => {
    // const { query } = parse(req.url!, true); // Extract query params
    // const clientId = query.clientId as string; // Get clientId from URL

// //     if (!clientId) {
// //         console.log("Client ID missing. Closing connection.");
// //         ws.close();
// //         return;
// //     }

// //     // Store WebSocket connection
// //     clients.set(clientId, ws);
// //     console.log(`Client ${clientId} connected via WebSocket`);

// //     ws.on("message", (data) => {
// //         console.log(`Message from ${clientId}: ${data}`);
// //     });

// //     ws.on("close", () => {
// //         clients.delete(clientId);
// //         console.log(`Client ${clientId} disconnected`);
// //     });

// //     ws.send(`Hello ${clientId}, WebSocket connection established!`);
// // });










// // import express from "express";
// // import { WebSocketServer, WebSocket } from "ws"

// // const app = express();

// // const clients = new Map<string, WebSocket | null>();

// // app.get("/activateSocket/:clientId", (req : express.Request, res : express.Response) => {
// //     // const userName = req.body.name;
// //     const clientId = req.params.clientId;
// //     clients.set(clientId, null);
// //     res.send("Socket connected!");
// // })

// // const httpServer = app.listen(8080, () => console.log("Server running on port 8080"));

// // const wss = new WebSocketServer({server: httpServer});

// // wss.on("connection", function connection(ws, req) {
// //     ws.on("error", (error) => console.log(error));
    
// //     const clientId = req.params.clientId;
// //     clients.set(clientId, ws);

//     // ws.on("message", (data, isBinary) => {
//     //     wss.clients.forEach((client) => {
//     //         // console.log(client);
//     //         if (client.readyState == WebSocket.OPEN) {
//     //             client.send(data, {binary: isBinary});
//     //         }
//     //     })
//     // })

// //     ws.send("Hello from server!!");
// // })