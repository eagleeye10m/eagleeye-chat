import { format } from "date-fns";
import { CldImage } from "next-cloudinary";
import React from "react";

const MessageBox = ({ message, currentUser }) => {
  return message?.sender?._id !== currentUser._id ? (
    <div className="message-box">
      {message?.sender?.profileImage ? (
        <CldImage
          width={100}
          height={100}
          src={message?.sender?.profileImage}
          alt="Profile photo"
          className="message-profilePhoto"
        />
      ) : (
        <img
          src="/assets/person.jpg"
          alt="Profile photo"
          className="message-profilePhoto"
        />
      )}
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender?.username} &#160; &#183; &#160;{" "}
          {format(new Date(message?.createdAt), "p")}
        </p>

        {message?.text ? (
          <p className="message-text">{message?.text}</p>
        ) : (
          <CldImage
            width={100}
            height={100}
            src={message?.photo}
            alt="message photo"
            className="message-photo"
          />
        )}
      </div>
    </div>
  ) : (
    <div className="message-box justify-end">
      <div className="message-info items-end">
        <div className="text-small-bold">
          {format(new Date(message?.createdAt), "p")}

          {message?.text ? (
            <p className="message-text-sender">{message?.text}</p>
          ) : (
            <CldImage
              width={100}
              height={100}
              src={message?.photo}
              alt="message photo"
              className="message-photo"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
