import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// Route imports:-
import serverHealthCheckUpRoutes from "./routes/serverHealthCheckUp.routes";
import webSocketInitializerRoutes from "./routes/webSocketInitializer.routes";
import conversationsRoutes from "./routes/converations.routes";
import messagesRoutes from "./routes/messages.routes"


const app = express();
app.use(cookieParser());
// const whitelist = ["http://localhost:3000"];

// const corsOptions = {
//   origin: function (origin : any, callback : any) {
//     // Allow requests with no origin (like server-to-server requests) or those from the whitelist
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not Allowed by CORS"));
//     }
//   },
//   methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
//   credentials: true,
// };

// // Middlewares -->
// app.use(cors(corsOptions));

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

app.use(express.json()); 
// This line is middleware that tells Express to automatically parse incoming requests with JSON payloads.



// HTTP routes
app.use("/api/v1", serverHealthCheckUpRoutes);
app.use("/api/v1/websockets", webSocketInitializerRoutes);
app.use("/app/v1/conversations", conversationsRoutes);
app.use("/app/v1/messages", messagesRoutes);

export default app;