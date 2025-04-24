import { Channel } from "../models/Channel.model.js";
import { User } from "../models/User.model.js";

export const createChannel= async(req,res)=>{
    try {
        const {name,members}= req.body;
        const userId= req.userId;
        const admin= await User.findById(userId);
        if(!admin){
            return res.status(404).send("Admin User not found");
        }

        const validateMembers= await User.find({_id:{$in:members}})
        if(validateMembers.length !== members.length){
            return res.status(400).send("some members are not Validate")
        }

        const newChannel = new Channel({
            name,
            members,
            admin:userId
        })

        await newChannel.save();
        return res.status(201).json({channel:newChannel});

    } catch (error) {
        console.log({error});
        return res.status(500).send("Internal server Error")
    }
}

export const getUserChannel=async(req,res)=>{
    try {
        const userId= req.userId;
        const channels= await Channel.find({
            $or:[{members:userId}, {admin:userId}]
        }).sort({updatedAt:-1});

        return res.status(200).json({channels})
    } catch (error) {
        console.log({error});
        return res.status(500).send("Internal Server Error");
    }
}

export const getChannelMessages=async(req,res)=>{
   try {
    const {channelId}= req.params;
    const channel= await Channel.findById(channelId).populate({
        path:"messages",
        populate:{
            path:"sender",
            select:"firstName lastName _id email image color"
        }
   });
   if(!channel){
    return res.status(404).send("Channel not found")
   }

   const messages=channel.messages;
   return res.status(200).json({messages})
   } catch (error) {
    console.log({error});
    return res.status(500).send("Internal Server Error")
   }

}