"use client";
import Loader from "@/components/Loader";
import GroupOutlined from "@mui/icons-material/GroupOutlined";

import { CldUploadButton } from "next-cloudinary";

import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function GroupInfo() {
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const { chatId } = useParams();

  const [chat, setChat] = useState({});
  const [loading, setLoading] = useState(true);

  const getChatDetails = async () => {
    try {
      const response = await fetch(`/api/chats/${chatId}`);
      const data = await response.json();
      setChat(data);
      console.log(data);

      setLoading(false);
      reset({
        name: data?.name,
        groupPhoto: data?.groupPhoto,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    chatId && getChatDetails();
  }, [chatId]);

  const uploadPhoto = (result) => {
    setValue("groupPhoto", result?.info?.secure_url);
  };

  const updateGroupChat = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      res.ok && router.push(`/chats/${chatId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <section className="profile-page">
      <h1 className="text-heading3-bold">Edit group info</h1>

      <form className="edit-profile" onSubmit={handleSubmit(updateGroupChat)}>
        <div className="input">
          <input
            {...register("name", {
              required: "Group chat name is required",
              validate: (value) => {
                if (value.length < 3)
                  return "Group chat name must be at least 3 characters";
              },
            })}
            type="text"
            className="input-field"
            placeholder="Group chat name"
          />
          <GroupOutlined sx={{ color: "#737373" }} />
        </div>
        {errors?.name && <p className="text-red-500 ">{errors.name.message}</p>}

        <div className="flex items-center justify-between">
          <img
            src={watch("groupPhoto") || "/assets/group.png"}
            alt="Profile"
            className="w-40 h-40 rounded-full"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onSuccess={uploadPhoto}
            uploadPreset="ywgt71dw"
          >
            <p className="text-body-bold">Upload new photo</p>
          </CldUploadButton>
        </div>

        <div className="flex flex-wrap gap-3">
          {chat?.members?.map((member, index) => (
            <p className="selected-contact" key={index}>
              {member.username}
            </p>
          ))}
        </div>

        <button className="btn" type="submit">
          Save changes
        </button>
      </form>
    </section>
  );
}
