'use client'

import React, { useEffect, useState } from 'react'
import PostsNavbar from '@/components/PostsNavbar'
import useAllPostFetch from "@/components/useAllPostFetch";
import Link from "next/link";
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useRouter } from "next/navigation";
import Image from "next/image";

type Post = {
  _id: number;
  photo: string;
  title: string;
  description: string;
  status: string;
  category: string;
  createdAt: string;
  featurePost: boolean;
};

const Page = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const pageTitle: string = "All Posts";
  const router = useRouter();

  const { posts, Ploading, Perror } = useAllPostFetch() as {
    posts: Post[];
    Ploading: boolean;
    Perror: Error | null;
  };


  useEffect(() => {
    if (posts) {
      setAllPosts(posts);
    }
  }, [posts]);

  const deletePost = async (id: number) => {
    const token = localStorage.getItem("token");
    const url = process.env.NEXT_PUBLIC_MAIN_URL;

    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    try {
      await axios.delete(`${url}/posts/${id}`, {
        headers: { Authorization: token },
      });
      
      setAllPosts(prevPosts => prevPosts.filter(post => post._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

 
  const recentPosts: Post[] = [...allPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );


  const createMarkup = (htmlContent: string) => {
    return {
      __html: DOMPurify.sanitize(htmlContent),
    };
  };


  return (
    <div className='py-4 min-h-screen space-y-4'>
      <div className='pb-5'>
        <PostsNavbar title={pageTitle} />
      </div>

      <div className='flex flex-col gap-5'>
        {Ploading ? (
          <div className='flex justify-center items-center min-h-screen'>
            <Image
              src="/loading.gif"  
              alt="loading animation"
              width={150} 
              height={150} 
              className="h-1/3 w-1/3 object-cover"
            />
          </div>
        ) : Perror ? (
          <p>Error loading posts: {Perror.toString()}</p>
        ) : recentPosts.length > 0 ? (
          recentPosts.map((post: Post) => (
            <div onClick={() => router.push(`/post/${post._id}`)} key={post._id}>
              <div className='bg-stone-100 shadow cursor-pointer shadow-black/40 md:hover:scale-105 transition-all duration-150 hover:shadow-black rounded-md p-5 space-y-5'>
                <div className="flex flex-col md:flex-row justify-between space-x-5 ">
                <Image
                    src={post.photo} 
                    alt={post.title}
                    width={300} 
                    unoptimized
                    height={200}
                    className="md:w-1/4 rounded-md object-cover"
                  />
                  <div className='space-y-1'>
                    <p className='text-2xl font-semibold capitalize'>{post.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                    <div
                      className='pt-2 text-base first-letter:text-xl first-letter:font-medium'
                      dangerouslySetInnerHTML={createMarkup(
                        post.description.length > 350
                          ? post.description.slice(0, 350) + '...'
                          : post.description
                      )}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:justify-between items-center">
                  <div className='flex justify-center items-center space-x-2'>
                    <p
                      className={`${
                        post.status === "public" ? "bg-green-500" : "bg-red-500"
                      } px-2 text-center font-medium rounded-2xl text-white capitalize`}
                    >
                      {post.status}
                    </p>
                    <p className="text-white bg-lime-600 px-2 rounded-2xl text-center font-semibold capitalize">
                      {post.category}
                    </p>
                    <p
                      className={`${
                        post.featurePost ? "bg-green-500" : ""
                      } px-2 text-center font-medium rounded-2xl text-white capitalize`}
                    >
                      {post.featurePost ? "feature" : ""}
                    </p>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/blog?id=${post._id}`}
                        className="capitalize font-medium text-white hover:bg-lime-600 hover:shadow-sm hover:shadow-black transition-all duration-150 bg-lime-500 rounded-md py-[5px] px-3"
                      >
                        Edit
                      </Link>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        deletePost(post._id);
                      }}
                      className='capitalize hover:shadow-sm hover:shadow-black transition-all duration-150 font-medium text-white hover:bg-red-600 bg-red-500 rounded-md py-1 px-3'
                    >
                      delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  )
}

export default Page;
