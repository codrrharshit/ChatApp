import { Server as SocketIoServer } from "socket.io";
import Message from "./models/Messages.model.js";
import {Channel} from "./models/Channel.model.js"


const serverSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const handleDisconnect = (socket) => { 
    console.log(`Client disconnected: ${socket.id}`);

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    try {

      const sendersSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient); 

      const createdMessage = await Message.create(message); 
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }

      if (sendersSocketId) {
        io.to(sendersSocketId).emit("receiveMessage", messageData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendChannelMessage=async(message)=>{
    const {channelId, sender, content , messageType,fileUrl}=message;
    const createMessage= await Message.create({
      sender,
      recipient:null,
      content,
      messageType,
      timeStamp:Date.now(),
      fileUrl
    })

    const messageData=await Message.findById(createMessage._id).populate("sender","firstName lastName color id email image ").exec();
    await Channel.findByIdAndUpdate(channelId,{
      $push:{messages:createMessage._id}
    })

    const channel= await Channel.findById(channelId).populate("members");
    const finalData = {...messageData._doc,channelId:channel._id}

    if(channel && channel.members){
      channel.members.forEach((member)=>{
        const membersocketId= userSocketMap.get(member._id.toString())
        if(membersocketId){
          io.to(membersocketId).emit("receiveChannelMessage",finalData)
        }
      })

      const adminSocketId=userSocketMap.get(channel.admin._id.toString());
      if(adminSocketId){
        io.to(adminSocketId).emit("receiveChannelMessage",finalData)
      }
    }

  }

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with socketId: ${socket.id}`);
    } else {
      console.log("User ID is not provided during connection");
    }

    socket.on("sendMessage",(data)=>{
      sendMessage(data)
    });
    socket.on("send-channel-message",(data)=>{
      sendChannelMessage(data);
    })
    socket.on("disconnect", () => handleDisconnect(socket)); 
  });
};

export default serverSocket;
