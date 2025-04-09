import { Router } from "express";
import verifyTokenAndInjectUserInfo from "../middleware/auth.middleware";
import { webSocketInitializer } from "../controllers/webSocketInitializer.controller";

const router = Router();

router.route("/initializeWS").get(verifyTokenAndInjectUserInfo, webSocketInitializer);

export default router;