import { useAppStore } from "@/store";
import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

function ContactList({ contacts, isChannel = false }) {
  const {
    selectedChatData,
    selectedChatType,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();
  const HandleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contacts");

    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[$8417ff]"
              : " hover:bg-[#f1f1f111]"
          }`}
          onClick={() => HandleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12  text-lg flex items-center justify-center rounded-full  ${getColor(
                      contact.color
                    )} `}
                  >
                    {contact.firstName
                      ? contact.firstName.split("")[0]
                      : contact.email.split("")[0]}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                {" "}
                #
              </div>
            )}

            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>{`${contact.firstName} ${contact.lastName}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactList;
