"use client";

import Logout from "@mui/icons-material/Logout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function BottomBar() {
  const pathName = usePathname();

  const { data: session } = useSession();
  const user = session?.user;

  const handleLogOut = async () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <section className="bottom-bar">
      <Link
        href="/chats"
        className={`${
          pathName === "/chats" ? "text-red-1" : ""
        } text-heading4-bold`}
      >
        Chats
      </Link>
      <Link
        href="/contacts"
        className={`${
          pathName === "/contacts" ? "text-red-1" : ""
        } text-heading4-bold`}
      >
        Contacts
      </Link>

      <Logout
        sx={{ color: "#737373", cursor: "pointer" }}
        onClick={handleLogOut}
      />

      <Link href="/profile">
        <Image
          src={user?.profileImage || "/assets/person.jpg"}
          alt="Profile photo"
          loading="eager"
          width={100}
          height={100}
          className="profilePhoto"
        />
      </Link>
    </section>
  );
}
