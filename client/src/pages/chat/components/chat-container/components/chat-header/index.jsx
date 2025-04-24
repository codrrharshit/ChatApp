import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import React from "react";
import { RiCloseFill } from "react-icons/ri";

function ChatHeader() {
  const { selectedChatData, closeChat,selectedChatType } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 ">
      <div className="flex  flex-1 gap-5 items-center justify-between">
        
          <div className="flex gap-3 items-center justify-center">
            <div className=" h-12 w-12 relative">
              {selectedChatType=="contacts" ?( <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-lg flex items-center justify-center  ${getColor(
                      selectedChatData.color
                    )} `}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("")[0]
                      : selectedChatData.email.split("")[0]}
                  </div>
                )}
              </Avatar>):( <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                {" "}
                #
              </div>)}
             
              
            </div>
            <div>
              {selectedChatType=="channel" && selectedChatData.name}
              {selectedChatType=="contacts" && selectedChatData.firstName && selectedChatData.lastName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : ""}
            </div>
          </div>
        
        <div className="flex items-center justify-center gap-5">
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300 cursor-pointer">
            <RiCloseFill className="text-3xl" onClick={closeChat} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
