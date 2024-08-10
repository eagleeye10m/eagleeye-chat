"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";

export default function Contacts({ session }) {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [search, setsearch] = useState("");

  const router = useRouter();

  const currentUser = session?.user;

  const getContacts = async () => {
    try {
      const response = await fetch(
        search !== "" ? `/api/users/searchContact/${search}` : "/api/users",
        {
          next: {
            tags: ["contacts"],
          },
        }
      );
      const data = await response.json();
      setContacts(data.filter((contact) => contact._id !== currentUser._id)); //make sure to not include ourself
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    currentUser && getContacts();
  }, [session, search]);

  /*SELECT CONTACT */
  const [selectedContacts, setSelectedContacts] = useState([]);

  const isGroup = selectedContacts.length > 1;

  const handleSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact)
      ); //if an item has selected before , dont select it again
    } else {
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
  };

  /*ADD GROUP CHAT NAME */
  const [name, setName] = useState("");

  /*CREATE CHAT */
  const createChat = async () => {
    const res = await fetch("/api/chats", {
      method: "POST",
      body: JSON.stringify({
        currentUserId: currentUser._id,
        members: selectedContacts.map((contact) => contact._id),
        isGroup,
        name,
      }),
    });

    const chat = await res.json();

    res.ok && router.push(`/chats/${chat._id}`);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="create-chat-container">
      {" "}
      <input
        placeholder="Search contact..."
        className="input-search"
        value={search}
        onChange={(e) => {
          setsearch(e.target.value);
        }}
      />
      <div className="contact-bar">
        <div className="contact-list ">
          <p className="text-body-bold">Select or Deselect</p>
          {contacts.map((user, index) => (
            <div
              key={index}
              className="contact"
              onClick={() => {
                handleSelect(user);
              }}
            >
              {selectedContacts.find((item) => item === user) ? (
                <CheckCircle sx={{ color: "red" }} />
              ) : (
                <RadioButtonUnchecked />
              )}

              {user.profileImage ? (
                <CldImage
                  loading="eager"
                  src={user.profileImage}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="profilePhoto"
                />
              ) : (
                <img
                  src="/assets/person.jpg"
                  alt="Profile"
                  className="profilePhoto"
                />
              )}
              <p className="text-base-bold">{user.username}</p>
            </div>
          ))}
        </div>

        <div className="create-chat">
          {isGroup && (
            <>
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Group chat name</p>
                <input
                  placeholder="Search group chat name..."
                  className="input-group-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Members</p>
                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact, index) => (
                    <p className="selected-contact" key={index}>
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          <button className="btn" onClick={createChat}>
            Find or start a new chat
          </button>
        </div>
      </div>
    </div>
  );
}
