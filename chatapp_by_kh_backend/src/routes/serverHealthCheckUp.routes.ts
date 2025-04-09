import { Router } from "express";
import { serverHealthCheck } from "../controllers/serverHealthCheck.controller";
import verifyTokenAndInjectUserInfo from "../middleware/auth.middleware";

const router = Router();

// router.route("/healthcheck").get(verifyTokenAndInjectUserInfo, serverHealthCheck);
router.route("/healthcheck").get( serverHealthCheck );
// router.get("/healthcheck", verifyTokenAndInjectUserInfo, serverHealthCheck);

export default router;