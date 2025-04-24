import { Router } from "express";
import { getUserInfo, login, logout, removeImageProfile, signup, updateProfile, uploadProfileImage} from "../controllers/Auth.controller.js";
import { verifyToken } from "../middlewares/Authmiddleware.js";
import multer from "multer";
const upload=multer({dest:"uploads/profiles/"})

const authRoute=Router();

authRoute.post("/signup",signup);
authRoute.post("/login",login);
authRoute.get("/get-userInfo",verifyToken,getUserInfo)
authRoute.post("/update-profile",verifyToken,updateProfile);
authRoute.post("/update-profile-image",verifyToken,upload.single("profile-image"),uploadProfileImage);
authRoute.delete("/remove-profile-image",verifyToken,removeImageProfile)
authRoute.post("/logout",logout)

export default authRoute;