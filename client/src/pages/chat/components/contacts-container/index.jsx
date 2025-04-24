import React, { useEffect } from "react";
import ProfileInfo from "./components";
import NewDm from "./components/new-dm";
import apiClient from "@/lib/api-client";
import { GET_DMS, GET_USER_CHANNEL } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/CreateChannel";

function ContactConatainer() {
  const { directMessagesContact, setDirectMessagesContact,channels ,setChannels} = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DMS, { withCredentials: true });
      if (response.data.contacts) {
        setDirectMessagesContact(response.data.contacts);
      }
    };

    const getUserChannel= async()=>{
      const response= await apiClient.get(GET_USER_CHANNEL,{withCredentials:true});
      if(response.data.channels){
        setChannels(response.data.channels);
      }
    }

    getContacts();
    getUserChannel();
  }, [setChannels,setDirectMessagesContact]);
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContact} />
        </div>
      </div>

      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

export default ContactConatainer;

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Syncronus</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 font-light pl-10 text-opacity-90 text-sm  ">
      {text}
    </h6>
  );
};
