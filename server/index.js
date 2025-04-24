import dotenv from "dotenv";
dotenv.config({});
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoute from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import serverSocket from "./socket.js";
import messageRoutes from "./routes/MessageRoutes.js";
import channelRoutes from "./routes/ChannelrRoutes.js";


const app = express();
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URI;

app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true
}))

app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use("/uploads/files",express.static("uploads/files"))

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",authRoute);
app.use("/api/contact",contactRoutes);
app.use("/api/message",messageRoutes);
app.use("/api/channel",channelRoutes);

 const server=app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});

serverSocket(server)

mongoose
  .connect(databaseUrl)
  .then(() => console.log("database connected"))
  .catch((error) => console.log(error.message));
