import { Router } from "express";
import { verifyToken } from "../middlewares/Authmiddleware.js";
import { createChannel, getChannelMessages, getUserChannel } from "../controllers/Channel.controller.js";


const channelRoutes=Router();

channelRoutes.post("/createChannel",verifyToken,createChannel);
channelRoutes.get("/getUserChannel",verifyToken,getUserChannel);
channelRoutes.get("/getChannelMessage/:channelId",verifyToken,getChannelMessages);

export default channelRoutes;