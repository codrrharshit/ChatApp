import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js";
import { compare } from "bcrypt";
import {renameSync,unlinkSync} from "fs"

const maxAge=3*24*60*60*1000

const createToken= (userId,email)=>{
    return jwt.sign({email,userId},process.env.JWT_SECRET_KEY,{expiresIn:maxAge});
}


export const signup= async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("Email and Password are required !");
        }

        const user= await User.create({email,password});
        // we have to setup the cookie 
        res.cookie("jwt",createToken(user.id,email,),{
            maxAge,
            secure:true,
            sameSite:"none"
        })

        res.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup
            }
        })
    } catch (error) {
       console.log(error); 
       return res.status(500).send("Internal server Error!!")
    }
}
    
export const login= async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("Email and Password are required !");
        }

        const user= await User.findOne({email});

        if(!user){
            return res.status(404).send("user is not found")
        }
        // we have to check for the password 
        const auth= await compare(password,user.password);
        if(!auth){
            return res.status(400).send("Password is incorrect");
        }
        // we have to setup the cookie 
        res.cookie("jwt",createToken(user.id,email),{
            maxAge,
            secure:true,
            sameSite:"none"
        })

        res.status(200).json({
            user:{
                id:user.id,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color,
                profileSetup:user.profileSetup
            }
        })
    } catch (error) {
       console.log(error); 
       return res.status(500).send("Internal server Error!!")
    }
}

export const getUserInfo= async(req,res)=>{
    try {
        const userData=await User.findById(req.userId);
        if(!userData) return res.status(404).send("User not found");

        return res.status(200).json({
            
                id:userData._id,
                email:userData.email,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
                color:userData.color,
                profileSetup:userData.profileSetup
        })
    } catch (error) {
        console.log(error);
        return res.status(501).send("Internal server Error")
    }
}

export const updateProfile=async(req,res)=>{
    try {
        // we will get the color , image , firstName, lastName 
        const userId=req.userId;
        const {firstName,lastName,color}=req.body;
        if(!firstName || !lastName || color===undefined){
            return res.status(400).send("Firstname , lastName and color is required");
        }

        const userData=await User.findByIdAndUpdate(userId,{firstName,lastName,color,profileSetup:true},{new:true,runValidators:true})


        return res.status(200).json({
            
            id:userData._id,
            email:userData.email,
            firstName:userData.firstName,
            lastName:userData.lastName,
            image:userData.image,
            color:userData.color,
            profileSetup:userData.profileSetup
    })

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error ")
    }
}

export const uploadProfileImage= async(req,res)=>{
    try {
        if(!req.file){
            return res.status(404).send("Flie is Required");
        }

        const date=Date.now();
        let fileName="uploads/profiles/"+date+req.file.originalname;
        renameSync(req.file.path,fileName);

        const updateUser= await User.findByIdAndUpdate(req.userId,{image:fileName},{new:true,runValidators:true});

        return res.status(200).json({
            image:updateUser.image
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server Error");
    }
}

export const removeImageProfile= async(req,res)=>{
    try {
        const userId=req.userId;
        const user= await User.findById(userId);
        if(!user){
            return res.status(404).send("User not found");
        }

        if(user.image){
            unlinkSync(user.image);
        }

        user.image=null;
        await user.save();
        return res.status(200).json({message:"Image Deleted SuccessFully."})
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server Error")
    }
}
    

export const logout=async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"});
        return res.status(200).send("logout successfully.")
        
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error")
    }
}