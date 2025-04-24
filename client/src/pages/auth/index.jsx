import React, { useState } from "react";
import victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import backGround from "../../assets/login2.png"
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { LOGIN, SIGNUP } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";


function Auth() {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [confirmPassword,setConfirmPassword]=useState("")
  const navigate=useNavigate()
  const {setUserInfo}=useAppStore();

  const validateLogin=()=>{
    if(!email.length){
      toast.error("Email is Required");
      return false;
    }
    if(!password.length){
      toast.error("Password is required")
      return false
    }
    return true;
  }

  const validateSignup=()=>{
    if(!email.length){
      toast.error("Email is Required");
      return false;
    }
    if(!password.length){
      toast.error("Password is required")
      return false
    }
    if(password!==confirmPassword){
      toast.error("password and ConfirmPassword should be same ")
      return false
    }

    return true;
  }

  const handleLogin= async()=>{
   try {
    if(validateLogin()){
      const response=await apiClient.post(LOGIN,{email,password},{withCredentials:true});

      if(response.data.user.id){
        setUserInfo(response.data.user)
        if(response.data.user.profileSetUp) navigate("/chat")
          else navigate("/profile")
      }
    
      console.log(response);
    }
   } catch (error) {
    toast.error(error.response.data)
   }


  }
  const handleSignup= async()=>{
    try {
      if(validateSignup()){
        const response=await apiClient.post(SIGNUP,{email,password},{withCredentials:true});
        if(response.status==201){
          setUserInfo(response.data.user)
          navigate("/profile");
        }
       
      }
    } catch (error) {
      toast.error(error.response.data)
    }

  }
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] xl:w-[60vw] lg:w-[70vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center ">
            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
            <img src={victory} alt="victory-emoji" className="h-[100px]" />
          </div>
          <p className="font-medium text-center">
            Fill in the details to get started with best chat App
          </p>
          <div className="flex items-center justify-center w-full my-3">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full  ">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 data-[state=actve]:text-black  data-[state=active]:border-b-purple-500 data-[state=active]:font-bold  w-full rounded-none p-3 transition-all duration-300 shadow-none"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 data-[state=actve]:text-black  data-[state=active]:border-b-purple-500 data-[state=active]:font-bold  w-full rounded-none p-3 transition-all duration-300 shadow-none"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
              <Input
              type="email"
              placeholder="Email"
              className="rounded-full p-6"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="rounded-full p-6"
              />
              <Button  className="rounded-full p-6  cursor-pointer" onClick={handleLogin} >Login</Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
              <Input
              type="email"
              placeholder="Email"
              className="rounded-full p-6"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="rounded-full p-6"
              />
              <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              className="rounded-full p-6"/>
              <Button className="rounded-full p-6 " onClick={handleSignup} >SignUp</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex items-center justify-center">
          <img src={backGround} alt="" />

        </div>
      </div>
    </div>
  );
}

export default Auth;
