// types.d.ts
import { JWT } from "next-auth/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JWT;
    }
  }
}
