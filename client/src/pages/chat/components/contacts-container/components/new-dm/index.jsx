import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import apiClient from "@/lib/api-client";
import { animateDefaultOptions, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { CONTACT_ROUTES, HOST, SEARCH_CONTACTS } from "@/utils/constants";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";

function NewDm() {
    const {setSelectedChatType,setSelectedChatData}= useAppStore();
  const [openNewContactModal, setopenNewContactModal] = useState(false);
  const [searchedContacts, setsearchedContacts] = useState([]);
  const searchContact = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status == 200 && response.data.contacts) {
          setsearchedContacts(response.data.contacts);
        } 
      }else {
          setsearchedContacts([]);
        }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact=(contact)=>{
        setopenNewContactModal(false);
        setSelectedChatType("contacts");
        setSelectedChatData(contact);
        setsearchedContacts([]);
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300  "
              onClick={() => setopenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setopenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none h-[400px] w-[400px] text-white flex flex-col ">
          <DialogHeader>
            <DialogTitle>Please Select a Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div>
            <Input
              placeholder="Search Contact"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContact(e.target.value)}
            />
            {searchedContacts.length > 0 && (
              <ScrollArea className="h-[250px] mt-5">
                <div className="flex flex-col gap-5 ">
                  {searchedContacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="flex gap-3 items-center cursor-pointer"
                      onClick={()=>selectNewContact(contact)}
                    >
                      <div className=" h-12 w-12 relative">
                        <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                          {contact.image ? (
                            <AvatarImage
                              src={`${HOST}/${contact.image}`}
                              alt="profile"
                              className="object-cover w-full h-full bg-black"
                            />
                          ) : (
                            <div
                              className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl flex items-center justify-center  ${getColor(
                                contact.color
                              )} `}
                            >
                              {contact.firstName
                                ? contact.firstName.split("")[0]
                                : contact.email.split("")[0]}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          :`${contact.email}`}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            {searchedContacts.length <= 0 && (
              <div>
                <div className="flex-1 md:flex flex-col mt-5 justify-center items-center  duration-300 transition-all">
                  <Lottie
                    isClickToPauseDisabled={true}
                    height={100}
                    width={100}
                    options={animateDefaultOptions}
                  />
                  <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center ">
                    <h3 className="poppins-medium">
                      Hi ! Search New{" "}
                      <span className="text-purple-500">Contact</span>
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDm;
