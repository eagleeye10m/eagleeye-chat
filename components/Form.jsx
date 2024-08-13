"use client";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import PersonOutline from "@mui/icons-material/PersonOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function Form({ type }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    if (type === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      res.ok
        ? toast.success("User has successfully created") && router.push("/")
        : toast.error(res.statusText);
    }
    if (type === "login") {
      const res = await signIn("credentials", { ...data, redirect: false });

      res.ok ? router.push("/chats") : toast.error(res.error);
    }
  };

  return (
    <section className="auth">
      <div className="content">
        <Image
          src="/assets/logo.bmp"
          alt="logo"
          priority
          className="logo"
          width={200}
          height={200}
        />

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          {type === "register" && (
            <div>
              <div className="input">
                <input
                  defaultValue=""
                  {...register("username", {
                    required: "Username is required",
                    validate: (value) => {
                      if (value.length < 3) {
                        return "Username must be at least 3 characters";
                      }
                    },
                  })}
                  type="text"
                  placeholder="Username"
                  className="input-field"
                />
                <PersonOutline sx={{ color: "#737373" }} />
              </div>
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
          )}

          <div>
            <div className="input">
              <input
                defaultValue=""
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="input">
              <input
                defaultValue=""
                {...register("password", {
                  required: "Password is required",
                  validate: (value) => {
                    if (
                      value.length < 5 ||
                      !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                    ) {
                      return "Password must be at least 5 characters and contain at least one special character";
                    }
                  },
                })}
                type="password"
                placeholder="Password"
                className="input-field"
              />
              <LockOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button className="button" type="submit">
            {type === "register" ? "Join free" : "Let's chat"}
          </button>
        </form>

        {type === "register" ? (
          <Link href="/" className="link">
            <p className="text-center">Already have an account? Sign in here</p>
          </Link>
        ) : (
          <Link href="/register" className="link">
            <p className="text-center">Don't have an account? Register here</p>
          </Link>
        )}
      </div>
    </section>
  );
}
