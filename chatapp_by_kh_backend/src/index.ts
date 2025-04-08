
import http from "http";
import dotenv from "dotenv";
import { setupWebSocketServer } from "./socketLogics/sockets"; // ⬅️ importing your socket logic
import app from "./app";
import connectDB from "./db/dbConnLogic";

dotenv.config({
    path: "./.env"
});

// Create HTTP server
const server = http.createServer(app);

// Set up WebSocket server
setupWebSocketServer(server); 

const PORT = process.env.PORT || 8080;


// Connect DB and then start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.log("Server error:", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });