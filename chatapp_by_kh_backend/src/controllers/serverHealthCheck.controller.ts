import { Request, Response } from "express";

const serverHealthCheck = (req : Request , res : Response) => {
    console.log("Its a health check: The server has spun up successfully on port 5600! Welcome: ", req.user?.name);
    res.status(200).json({message: `The server has spun up successfully on port 5600! Welcome ${req.user?.name}!`});
};

export {serverHealthCheck};