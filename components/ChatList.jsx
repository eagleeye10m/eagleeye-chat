"use client";

import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import ChatBox from "./ChatBox";
import { pusherClient } from "@/lib/pusher";

export default function ChatList({ session, currentChatId }) {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  const currentUser = session?.user;
  console.log(session);

  const getChats = async () => {
    try {
      const response = await fetch(
        search !== ""
          ? `/api/users/${currentUser._id}/searchChat/${search}`
          : `/api/users/${currentUser._id}`,
        {
          next: {
            tags: ["chats"],
          },
        }
      );
      const data = await response.json();

      setChats(data);

      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    currentUser && getChats();
  }, [currentUser, search]);

  useEffect(() => {
    if (currentUser) {
      pusherClient.subscribe(currentUser._id);

      const handleChatUpdate = async (updatedChat) => {
        setChats((allChats) =>
          allChats.map((chat) => {
            if (chat._id === updatedChat.id)
              return { ...chat, messages: updatedChat.messages };
            else return chat;
          })
        );
      };

      const handleNewChat = async (newChat) => {
        setChats((allChats) => [...allChats, newChat]);
      };

      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);

      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      <input
        placeholder="Search chat..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="chats">
        {chats?.map((chat, index) => (
          <ChatBox
            chat={chat}
            index={index}
            currentUser={currentUser}
            currentChatId={currentChatId}
          />
        ))}
      </div>
    </div>
  );
}
