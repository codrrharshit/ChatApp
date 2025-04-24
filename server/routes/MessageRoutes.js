import { Router } from "express";
import {verifyToken} from "../middlewares/Authmiddleware.js"
import { getMessages, uploadFile } from "../controllers/Messages.controller.js";
import multer from "multer"


const messageRoutes=Router();

const upload= multer({dest:"uploads/files"});

messageRoutes.post("/get-messages",verifyToken,getMessages);
messageRoutes.post("/upload-file",upload.single("file"),uploadFile);

export default messageRoutes;