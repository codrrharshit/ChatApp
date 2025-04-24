import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT } from "@/utils/constants";
import React from "react";
import {FiEdit2 } from "react-icons/fi";
import {  useNavigate } from "react-router-dom";
import {IoPowerSharp} from "react-icons/io5"
import { toast } from "sonner";
import apiClient from "@/lib/api-client";

function ProfileInfo() {
  const { userInfo ,setUserInfo} = useAppStore();
  const navigate=useNavigate();
  const handleLogout= async()=>{
    try {
        const response=await apiClient.post(LOGOUT,{},{withCredentials:true});
        if(response.status==200){
            navigate("/auth");
            setUserInfo(null);
        }
    } catch (error) {
        console.log(error);
    }
  }
  return (
    <div className="absolute  bottom-0 flex justify-between items-center px-5 w-full h-16 bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className=" h-12 w-12 relative">
          <Avatar className="h-12 w-12  rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg flex items-center justify-center  ${getColor(
                  userInfo.color
                )} `}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("")[0]
                  : userInfo.email.split("")[0]}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-2 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <FiEdit2 className="text-purple-500 text-xl font-" onClick={()=>navigate("/profile")}/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <IoPowerSharp className="text-red-500 text-xl font-" onClick={handleLogout}/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
