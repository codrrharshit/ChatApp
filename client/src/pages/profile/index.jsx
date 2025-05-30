import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { HOST, REMOVE_PROFILE_IMAGE, UPDATE_PROFILE, UPDATE_PROFILE_IMAGE } from "@/utils/constants";

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hovered, setHovered] = useState(false);
  const [image, setImage] = useState(null);
  const [color, setColor] = useState(0);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setColor(userInfo.color);
    }
    if(userInfo.image){
        setImage(`${HOST}/${userInfo.image}`)
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName.length) {
      toast.error("FirstName is required");
      return false;
    }
    if (!lastName.length) {
      toast.error("LastName is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE,
          { firstName, lastName, color },
          { withCredentials: true }
        );
        if (response.status == 200 && response.data) {
          setUserInfo(response.data);
          toast.success("Profile Update successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("please setup the profile");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = async (e) => {
    const file=e.target.files[0];
    console.log(file);
    if(file){
        const formData=new FormData();
        formData.append("profile-image",file);
        const response= await apiClient.post(UPDATE_PROFILE_IMAGE,formData,{withCredentials:true});
        if(response.status===200 && response.data.image){
            setUserInfo({...userInfo,image:response.data.image})
            toast.success("Image updated successfully.");
        }
    }
  };

  const handleDeleteImage = async () => {
    const response= await apiClient.delete(REMOVE_PROFILE_IMAGE,{withCredentials:true});
    if(response.status==200){
        toast.success(response.data.message)
        setUserInfo({...userInfo,image:null});
        setImage(null);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max ">
        <div onClick={handlNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer " />
        </div>
        <div className="grid grid-cols-2 place-items-center">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl flex items-center justify-center  ${getColor(
                    color
                  )} `}
                >
                  {firstName
                    ? firstName.split("")[0]
                    : userInfo.email.split("")[0]}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50  rounded-full cursor-pointer"
                onClick={image?handleDeleteImage:handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".jpeg,.png,.jpg,.webp"
            />
          </div>

          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                type="email"
                placeholder="Email"
                value={userInfo.email}
                disabled
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="FirstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="LastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((c, index) => (
                <div
                  key={index}
                  className={`${c} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    color === index ? " outline-white/50 outline-1" : ""
                  }`}
                  onClick={() => setColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
