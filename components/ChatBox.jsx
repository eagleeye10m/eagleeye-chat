"use client";
import { format } from "date-fns";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ChatBox = ({ chat, currentUser, currentChatId }) => {
  const otherMembers = chat?.members?.filter(
    //In case we dont have group chat, we will only have 1 person in otherMembers
    (member) => member._id !== currentUser._id
  );

  const lastMessage =
    chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];

  const seen = lastMessage.seenBy?.find(
    (member) => member._id === currentUser._id
  );

  const router = useRouter();

  return (
    <Link
      className={`chat-box ${chat._id === currentChatId ? "bg-blue-2" : ""}`}
      href={`/chats/${chat._id}`}
    >
      <div className="chat-info">
        {chat?.isGroup ? (
          chat?.groupPhoto ? (
            <CldImage
              src={chat?.groupPhoto}
              alt="group-photo"
              width={100}
              height={100}
              className="profilePhoto"
            />
          ) : (
            <img
              src="/assets/group.png"
              className="profilePhoto"
              alt="group-photo"
            />
          )
        ) : otherMembers[0].profileImage ? (
          <CldImage
            src={otherMembers[0].profileImage}
            width={100}
            height={100}
            className="profilePhoto"
            alt="Profile photo"
          />
        ) : (
          <img
            src="/assets/person.jpg"
            alt="Profile photo"
            className="profilePhoto"
          />
        )}

        <div className="flex flex-col gap-1">
          {chat?.isGroup ? (
            <span className="text-base-bold">{chat?.name} </span>
          ) : (
            <span className="text-base-bold">{otherMembers[0]?.username}</span>
          )}

          {!lastMessage && <p className="text-small-bold">Started a chat</p>}

          {lastMessage?.photo ? ( //in case the last message is photo
            lastMessage?.sender?._id === currentUser?._id ? (
              <p className="text-small-medium text-grey-3">You sent a photo</p>
            ) : (
              <p
                className={`${
                  seen ? "text-small-medium text-grey-3" : "text-small-bold"
                }  `}
              >
                {lastMessage?.sender.username} sent a photo
              </p>
            )
          ) : (
            <p
              className={`last-message ${
                seen ? "text-small-medium text-grey-3" : "text-small-bold"
              } `}
            >
              {lastMessage.text}
            </p> //in case the last message is just a text
          )}
        </div>
      </div>

      <p className="text-base-light text-grey-3">
        {!lastMessage
          ? format(new Date(chat?.createdAt), "p")
          : format(new Date(chat?.lastMessageAt), "p")}
      </p>
    </Link>
  );
};

export default ChatBox;
