import { Router } from "express";
import { getAllContacts, getContactListDM, searchContact } from "../controllers/Contact.Controller.js";
import { verifyToken } from "../middlewares/Authmiddleware.js";


const contactRoutes=Router();

contactRoutes.post("/search",verifyToken,searchContact);
contactRoutes.get("/get-contacts-for-dm",verifyToken,getContactListDM);
contactRoutes.get("/get-all-contacts",verifyToken,getAllContacts);

export default contactRoutes;