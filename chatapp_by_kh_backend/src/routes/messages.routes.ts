import { Router } from "express";
import verifyTokenAndInjectUserInfo from "../middleware/auth.middleware";
import { getAllMessagesForTheGivenConversations } from "../controllers/getMessages.controller";

const router = Router();

router.route("/getAllMessagesForTheGivenConversations").post(verifyTokenAndInjectUserInfo, getAllMessagesForTheGivenConversations);

export default router;