import { Request, Response } from "express";

const serverHealthCheck = (_ : Request , res : Response) => {
    console.log("Its a health check: The server has spun up successfully on port 5600!");
    res.status(200).json({message: "The server has spun up successfully on port 5600!"});
};

export {serverHealthCheck};