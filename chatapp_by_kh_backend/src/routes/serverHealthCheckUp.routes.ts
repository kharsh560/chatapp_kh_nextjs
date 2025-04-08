import { Router } from "express";
import { serverHealthCheck } from "../controllers/serverHealthCheck.controller";

const router = Router();

router.route("/healthcheck").get(serverHealthCheck);

export default router;