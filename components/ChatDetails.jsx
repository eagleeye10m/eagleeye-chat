"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Loader from "./Loader";
import Link from "next/link";
import { CldImage, CldUploadButton } from "next-cloudinary";
import AddPhotoAlternate from "@mui/icons-material/AddPhotoAlternate";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";

const ChatDetails = ({ chatId, session }) => {
  console.log(session);

  const currentUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});
  const [text, setText] = useState("");

  const getChatDetails = async () => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        next: {
          tags: ["chat"],
        },
      });
      const data = await response.json();
      setChat(data);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) getChatDetails();
  }, [currentUser, chatId]);

  const otherMembers = useMemo(
    () => chat?.members?.filter((member) => member._id !== currentUser._id),
    [chat, currentUser]
  );

  let timeout;
  const timeoutFn = (e) => {
    timeout !== undefined && clearTimeout(timeout);
    timeout = setTimeout(() => {
      setText(e.target.value);
    }, 500);
  };

  const sendText = async () => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          text,
        }),
      });
      if (response.ok) {
        document.querySelector("#message_input").value = "";
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendPhoto = async (result) => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          photo: result?.info?.secure_url,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    pusherClient.subscribe(chatId);

    const handleMessage = async (newMessage) => {
      setChat((prevChat) => {
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        };
      });
    };

    pusherClient.bind("new-message", handleMessage);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-message", handleMessage);
    };
  }, [chatId]);

  //Scrolling down to the bottom when having the new message
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.messages]);

  return loading ? (
    <Loader />
  ) : (
    <section className="pb-20">
      <div className="chat-details">
        <div className="chat-header">
          {chat?.isGroup ? (
            <>
              <Link href={`/chats/${chatId}/group-info`}>
                {chat?.groupPhoto ? (
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
                )}
              </Link>

              <div className="text">
                <p>
                  {chat?.name} &#160; &#183; &#160; {chat?.members?.length}{" "}
                  members
                </p>
              </div>
            </>
          ) : (
            <>
              {otherMembers[0].profileImage ? (
                <CldImage
                  src={otherMembers[0].profileImage}
                  alt="Profile photo"
                  width={100}
                  height={100}
                  className="profilePhoto"
                />
              ) : (
                <img
                  src="/assets/person.jpg"
                  alt="profile Image"
                  className="profilePhoto"
                />
              )}
              <div className="text">
                <span>{otherMembers[0].username}</span>
              </div>
            </>
          )}
        </div>{" "}
        <div className="chat-body">
          {chat?.messages?.map((message, index) => (
            <MessageBox
              key={index}
              message={message}
              currentUser={currentUser}
            />
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="send-message">
          <div className="prepare-message">
            <CldUploadButton
              options={{ maxFiles: 1 }}
              onSuccess={sendPhoto}
              uploadPreset="ywgt71dw"
            >
              <AddPhotoAlternate
                sx={{
                  fontSize: "35px",
                  color: "#737373",
                  cursor: "pointer",
                  ":hover": { color: "red" },
                }}
              />
            </CldUploadButton>

            <input
              id="message_input"
              type="text"
              className="input-field"
              placeholder="Write a message..."
              onChange={(e) => {
                timeoutFn(e);
              }}
              required
            />
          </div>

          <div onClick={sendText}>
            <img src="/assets/send.jpg" alt="send" className="send-icon" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatDetails;
