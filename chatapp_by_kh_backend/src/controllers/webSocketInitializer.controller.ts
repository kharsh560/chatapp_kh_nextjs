import { Request, Response } from "express";
import jwt from "jsonwebtoken"; 

// const SECRET_KEY = "your-secret-key";

// Function to create a token (could include expiry, etc.)
function createToken(payload: any) {
  if (!process.env.WEB_SOCKET_VALIDATION_SECRET) {
    throw new Error("NEXTAUTH_SECRET is not defined in the environment variables.");
  }
  return jwt.sign(payload, process.env.WEB_SOCKET_VALIDATION_SECRET, { expiresIn: "5m" }); // token valid for 5 minutes
}


const webSocketInitializer = (req : Request, res : Response) => {
    // console.log("Inside webSocketInitializer!");
    // Checking if there is user present in the "req"
    if (!req.user) {
      console.log("Auth failed before WebSocket connection.");
        res.status(401).send("Unauthorized");
    }
    // Else generate a token for WS connection.
    const token = createToken({ user: req.user });
    res.send({ message: "Authenticated! Use the token to connect.", token });
}

export {webSocketInitializer};