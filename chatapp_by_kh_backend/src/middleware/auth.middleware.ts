import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

const verifyTokenAndInjectUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
    // console.log("Inside the auth middleware!");
  try {
    const secret = process.env.NEXTAUTH_SECRET;

    const decoded = await getToken({ req, secret });

    if (!decoded) {
      return res.status(403).json({ success: false, message: "Invalid access token" });
    }

    (req as Request).user = decoded;
    // console.log("Decoded session: ", decoded);

    // const token =
    //   req.cookies?.accessToken ||
    //   req.header("Authorization")?.replace("Bearer ", "");
    // console.log("Incoming cookies: ", req.cookies);


    // const token =
    //     req.cookies?.['next-auth.session-token'] ||  // for HTTP
    //     req.cookies?.['__Secure-next-auth.session-token'] ||  // for HTTPS
    //     req.header("Authorization")?.replace("Bearer ", "");  // fallback for manual token

    // if (!token) {
    //   return res.status(401).json({ error: "Access token is missing." });
    // }

    // console.log("Required token: ", token);

    // const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string);

    // // Optionally attach to request
    // (req as any).decodedToken = decoded;



    next();
  } catch (err) {
    console.log("JWT verification failed:", err);
    return res.status(401).json({ error: "Invalid session token" });
  }
}

// const verifyTokenAndInjectUserInfo = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) : any => {
//     console.log("Inside the auth middleware!");
//   try {
//     // const token =
//     //   req.cookies?.accessToken ||
//     //   req.header("Authorization")?.replace("Bearer ", "");

//     const token =
//         req.cookies?.['next-auth.session-token'] ||  // for HTTP
//         req.cookies?.['__Secure-next-auth.session-token'] ||  // for HTTPS
//         req.header("Authorization")?.replace("Bearer ", "");  // fallback for manual token


//     if (!token) {
//       return res.status(401).json({ error: "Access token is missing." });
//     }

//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

//     // Optionally attach to request
//     (req as any).decodedToken = decoded;

//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid or expired access token." });
//   }
// };

export default verifyTokenAndInjectUserInfo;
