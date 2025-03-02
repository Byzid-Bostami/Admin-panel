"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdSpaceDashboard, MdOutlinePostAdd, MdModeComment, MdAnalytics, MdLogout } from "react-icons/md";
import { RiPagesFill } from "react-icons/ri";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";


const Navbar = () => {
  const [toggle, setToggle] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/") {
    return null;
  }

  const isActive = (href: string) =>
    pathname === href ? "border-l-2 border-[#21e2b8]" : "";


  const logout =()=>{
    localStorage.removeItem("token");
    router.push("/");
  }

  return (
    <div className={`flex flex-col justify-between z-50 text-white h-screen transition-all duration-300 ${toggle ? "w-16" : "w-48"}`}>
      {/* Toggle Button */}
      <button
        className="self-end p-3 transition-transform duration-300"
        onClick={() => setToggle((prev) => !prev)}
      >
        {toggle ? <FaArrowRightLong /> : <FaArrowLeftLong />}
      </button>

      {/* Navigation Links */}
      <div className="flex flex-col p-3 space-y-4">
        <Link className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-150 ${isActive("/dashboard")}`} href="/dashboard">
          <span className="text-2xl text-[#21e2b8]">
            <MdSpaceDashboard />
          </span>
          <span className={`transition-opacity duration-300 ${toggle ? "opacity-0 w-0" : "opacity-100"}`}>
            Dashboard
          </span>
        </Link>

        <Link className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-150 ${isActive("/blog")}`} href="/blog">
          <span className="text-2xl text-[#21e2b8]">
            <MdOutlinePostAdd />
          </span>
          <span className={`transition-opacity duration-300 ${toggle ? "opacity-0" : "opacity-100"}`}>
             New
          </span>
        </Link>

        <Link className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-150 ${isActive("/posts")}`} href="/posts">
          <span className="text-2xl text-[#21e2b8]">
            <RiPagesFill />
          </span>
          <span className={`transition-opacity duration-300 ${toggle ? "opacity-0 w-0" : "opacity-100"}`}>
            Posts
          </span>
        </Link>

        <Link className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-150 ${isActive("/comments")}`} href="/comments">
          <span className="text-2xl text-[#21e2b8]">
            <MdModeComment />
          </span>
          <span className={`transition-opacity duration-300 ${toggle ? "opacity-0 w-0" : "opacity-100"}`}>
            Comments
          </span>
        </Link>
 
        <Link className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-150 ${isActive("/Analytics")}`} href="/Analytics">
          <span className="text-2xl text-[#21e2b8]">
          <MdAnalytics />
          </span>
          <span className={`transition-opacity duration-300 ${toggle ? "opacity-0 w-0" : "opacity-100"}`}>
          Analytics
          </span>
        </Link>

      </div>

      {/* Logout Button */}
      <button className="inline-flex mb-20 items-center justify-center  group space-x-2 font-medium capitalize transition-all duration-300" onClick={logout}>
        <span className="text-xl bg-[#22b897] group-hover:bg-red-500 rounded-sm p-1">
          <MdLogout />
        </span>
        <span className={`transition-opacity duration-300 ${toggle ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
          Logout
        </span>
      </button>
    </div>
  );
};

export default Navbar;
