import express from "express";
import { serverHealthCheck } from "./controllers/serverHealthCheck.controller";
// Import routes
// import userRoutes from "./routes/user.route";
// import chatRoutes from "./routes/chat.route";
const app = express();
app.use(express.json()); 
// This line is middleware that tells Express to automatically parse incoming requests with JSON payloads.

// HTTP routes
app.use("/api/v1", serverHealthCheck);

export default app;