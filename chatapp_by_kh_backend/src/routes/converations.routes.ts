import { Router } from "express";
import verifyTokenAndInjectUserInfo from "../middleware/auth.middleware";
import { createConversationForNewSignedUpUser, getConversationsOfIndividualUser } from "../controllers/conversations.controller";

const router = Router();

router.route("/createConversations").post(createConversationForNewSignedUpUser); // Ismei kyu chaye bhai protection? "verifyTokenAndInjectUserInfo"
router.route("/getConversations").get(verifyTokenAndInjectUserInfo, getConversationsOfIndividualUser);


export default router;