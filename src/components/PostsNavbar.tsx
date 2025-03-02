"use client";

import React from 'react'
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { useState } from 'react';
interface PostsNavbarProps {
  title: string;
}

const PostsNavbar: React.FC<PostsNavbarProps> = ({ title }) => {
  const [search, setSearch] = useState('');
const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href ? "bg-[#1FB997] text-white border-none hover:text-black" : "";

const handleSubmit =(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  if (search.trim()) {
    router.push(`/search?query=${encodeURIComponent(search)}`);
    setSearch('');
  } else {
    console.log('Please enter a valid search query.');
  }
};


  return (
    <div className='space-y-4'>
        <div className="flex justify-center items-center rounded-md px-2 bg-[#1fb997] py-4">
          <h1 className='text-white text-3xl md:text-5xl uppercase font-bold'>{title}</h1>
        </div>

        <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between md:items-start lg:items-center '>
          <form onSubmit={handleSubmit}  className='space-x-2 space-y-2 md:space-y-0'>
          <input
          type="search"
          placeholder='Search by Title'
          value={search}
          onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)}
          className="border py-1 px-3 rounded-md outline-none md:text-sm lg:text-base focus:ring-1 ring-[#5B5DE0]"
        />
            <button className='text-white font-medium bg-[#1FB997] rounded-md px-3 py-1 md:text-sm lg:text-base' type="submit">Search</button>
          </form>

          <div className='flex md:justify-between justify-center items-center flex-wrap space-y-2 space-x-2 text-sm lg:text-base md:space-y-0  capitalize'>
              <Link className={`px-2 py-[2px] border self-end md:self-center border-black/50 font-semibold hover:border-[#1FB997] hover:text-[#1FB997] rounded-md transition-all duration-150 ${isActive("/posts")}`} href={'/posts'} >all</Link>
              <Link className={`px-2 py-[2px] border border-black/50 font-semibold hover:border-[#1FB997] hover:text-[#1FB997] rounded-md transition-all duration-150 ${isActive("/posts/public")}`} href={'/posts/public'} >public</Link>
              <Link className={`px-2 py-[2px] border font-semibold border-black/50 hover:border-[#1FB997] hover:text-[#1FB997] rounded-md transition-all duration-150 ${isActive("/posts/draft")}`} href={'/posts/draft'} >draft</Link>
              <Link className={`px-2 py-[2px] font-semibold border border-black/50 hover:border-[#1FB997] hover:text-[#1FB997] rounded-md transition-all duration-150 ${isActive("/posts/feature")}`} href={'/posts/feature'} >feature</Link>
              <Link className={`px-2 py-[2px] font-semibold border border-black/50 hover:border-[#1FB997] hover:text-[#1FB997] rounded-md transition-all duration-150 ${isActive("/posts/health")}`} href={'/posts/health'} >health</Link>
              <Link className={`px-2 py-[2px] border font-semibold border-black/50 hover:border-[#1FB997] hover:text-[#1FB997] rounded-md transition-all duration-150 ${isActive("/posts/news")}`} href={'/posts/news'} >news</Link>
              <Link className={`px-2 py-[2px] border font-semibold border-black/50 hover:border-[#1FB997] hover:text-[#1FB997] rounded-md transition-all duration-150 ${isActive("/posts/tech")}`} href={'/posts/tech'} >tech</Link>
        </div>
        </div>

    </div>
    
  )
}

export default PostsNavbar;
