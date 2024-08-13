"use client";
import Loader from "@/components/Loader";
import PersonOutline from "@mui/icons-material/PersonOutline";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Profile() {
  const { data: session } = useSession();

  const user = session?.user;

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      });
    }

    setLoading(false);
  }, []);

  const uploadPhoto = (result) => {
    setValue("profileImage", result?.info?.secure_url);
  };

  const updateUser = async (data) => {
    setLoading(true);
    try {
      console.log(user._id);
      const res = await fetch(`api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      //window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <section className="profile-page">
      <h1 className="text-heading3-bold">Edit your profile</h1>

      <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
        <div className="input">
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 3)
                  return "Username must be at least 3 characters";
              },
            })}
            type="text"
            className="input-field"
            placeholder="Username"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {errors?.username && (
          <p className="text-red-500 ">{errors.username.message}</p>
        )}

        <div className="flex items-center justify-between">
          <img
            src={
              watch("profileImage") ||
              user?.profileImage ||
              "/assets/person.jpg"
            }
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

        <button className="btn" type="submit">
          Save changes
        </button>
      </form>
    </section>
  );
}
