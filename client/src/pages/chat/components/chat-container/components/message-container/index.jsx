import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_CHANNEL_MESSAGES, GET_MESSAGES, HOST, MESSAGE_ROUTES } from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

function MessageContainer() {
  const scrollRef = useRef();
  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();

  useEffect(() => {
    const getMessage = async () => {
      const response = await apiClient.post(
        GET_MESSAGES,
        { id: selectedChatData._id },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    };

    const getChannelMessages= async()=>{
      const response= await apiClient.get(`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,{withCredentials:true});
      if(response.data.messages){
        setSelectedChatMessages(response.data.messages);
      }
    }
    if (selectedChatData._id) {
      if (selectedChatType === "contacts") getMessage();
      if(selectedChatType==="channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
        });
      }, 100);
    }
  }, [selectedChatMessages]);

  const [showImage, setShowImage] = useState(false);
  const [fileURL, setFileURL] = useState(null);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|svg|webp|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      const isLastMessage = index === selectedChatMessages.length - 1; // Check if last message

      return (
        <div key={index} ref={isLastMessage ? scrollRef : null}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timeStamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contacts" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessage(message)}
        </div>
      );
    });
  };

  const handleDownloadFile = async (url) => {
    setIsDownloading(true);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((100 * loaded) / total);
        setFileDownloadProgress(percentCompleted);
      },
    });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffff]/20"
          }  border inline-block p-4 rounded my-1 max-w-[50%] break-words `}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "files" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffff]/20"
          }  border inline-block p-4 rounded my-1 max-w-[50%] break-words `}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setFileURL(message.fileUrl);
                setShowImage(true);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span className="overflow-hidden">
                {message.fileUrl.split("/").pop()}
              </span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => handleDownloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-600">
        {moment(message.timeStamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessage = (message) => {
    return (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/90 border-[#ffff]/20"
            }  border inline-block p-4 rounded my-1 max-w-[50%] break-words  ml-9`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "files" && (
        <div
          className={`${
            message.sender._id=== userInfo.id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffff]/20"
          }  border inline-block p-4 rounded my-1 max-w-[50%] break-words `}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setFileURL(message.fileUrl);
                setShowImage(true);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span className="overflow-hidden">
                {message.fileUrl.split("/").pop()}
              </span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => handleDownloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}

        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8  rounded-full overflow-hidden">
            {message.sender.image && (
              <AvatarImage
                src={`${HOST}/${message.sender.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) }
              <AvatarFallback
                className={`uppercase h-8 w-8  text-lg flex items-center justify-center rounded-full   ${getColor(
                  message.sender.color
                )} `}
              >
                {message.sender.firstName? message.sender.firstName.split("")[0]:message.sender.email.split("")[0]}
              </AvatarFallback>
          </Avatar>
          <span className="text-sm text-white/60">{ `${message.sender.firstName } ${message.sender.lastName}`}</span>

          <span className="text-sm text-white/60">{`${moment(message.timeStamp).format("LT")}`}</span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">
            {`${moment(message.timeStamp).format("LT")}`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="messages-container flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessage()}
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg">
          <div>
            <img
              src={`${HOST}/${fileURL}`}
              className="h-[80vh] w-[80vw] object-contain"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => handleDownloadFile(fileURL)}
            >
              <IoMdArrowRoundDown />
            </button>

            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setFileURL(null);
                setShowImage(false);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageContainer;
