import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multipleSelect";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import apiClient from "@/lib/api-client";

import { useAppStore } from "@/store";
import {
  CONTACT_ROUTES,
  CREATE_CHANNEL,
  GET_ALL_CONTACTS,
  HOST,
  SEARCH_CONTACTS,
} from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

function CreateChannel() {
  const { setSelectedChatType, setSelectedChatData,addChannels } = useAppStore();
  const [NewChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setallContacts] = useState([]);
  const [selectedContacts, setselectedContacts] = useState([]);
  const [channelName, setchannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS, {
        withCredentials: true,
      });
      setallContacts(response.data.contacts);
    };

    getData();
  }, []);

  const createChannel = async () => {
    try {
        if(channelName.length>0 && selectedContacts.length>0){
            const response= await apiClient.post(CREATE_CHANNEL,{
                name:channelName,
                members:selectedContacts.map((contact)=>contact.value)
            },{withCredentials:true});

            if(response.status==201){
                setchannelName("");
                setselectedContacts([]);
                setNewChannelModal(false);
                addChannels(response.data.channel)
            }
        }
    } catch (error) {
        
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300  "
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={NewChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none h-[400px] w-[400px] text-white flex flex-col ">
          <DialogHeader>
            <DialogTitle>
              Please fill up the detail for the new Channel{" "}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div>
            <Input
              placeholder="channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setchannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg !bg-[#2c2e3b] border-none py-2  ! text-white"
              defaultOptions={allContacts}
              placeholder=" Search Contacts"
              value={selectedContacts}
              onChange={setselectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-60">
                  {" "}
                  No result Found.{" "}
                </p>
              }
            />
          </div>

          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 "
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateChannel;
