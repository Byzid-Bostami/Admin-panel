'use client'

import React, { useState, useEffect } from 'react';
import useAllPostFetch from "@/components/useAllPostFetch";
import useAllCommentsFetch from "@/components/useAllCommentsFetch";
import Avatar from 'boring-avatars';
import axios from 'axios';
import Image from "next/image";

interface Post {
  _id: number; 
  title: string;
  createdAt: string;
}

interface Comment {
  _id: number; 
  postId: number;
  userName: string;
  email: string;
  comment: string;
  createdAt: string;
}

const Page = () => {
  const { posts, Ploading, Perror } = useAllPostFetch() as {
    posts: Post[];
    Ploading: boolean;
    Perror: Error | string | null;
  };

  const { comments, loading, error } = useAllCommentsFetch() as {
    comments: Comment[];
    loading: boolean;
    error: Error | string | null;
  };

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (posts) setAllPosts(posts);
  }, [posts]);

  useEffect(() => {
    if (comments) setAllComments(comments);
  }, [comments]);

  if (Ploading || loading) return <div className=' flex justify-center items-center min-h-screen'><Image 
  src="/loading.gif" 
  alt="loading animation" 
  width={200} 
  height={200} 
  className="h-1/2 w-1/2 object-cover" 
/></div>;

  if (Perror || error) {
    const errorMessage = (Perror instanceof Error ? Perror.message : Perror) || (error instanceof Error ? error.message : error);
    return <div>Error: {errorMessage}</div>;
  }

  const deleteComments = async (id: number) => {
    const token = localStorage.getItem("token");
    const url = process.env.NEXT_PUBLIC_MAIN_URL;

    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    try {
      await axios.delete(`${url}/comments/${id}`, {
        headers: { Authorization: token },
      });
      setAllComments(allComments.filter(comment => comment._id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-4 min-h-screen space-y-4">
      <div className="flex justify-center items-center rounded-md px-2 bg-[#5b5de0] py-4">
        <h1 className="text-white text-5xl uppercase font-bold">All Comments</h1>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          placeholder='Search by Post Title'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border py-1 px-3 rounded-md outline-none focus:ring-1 ring-[#5B5DE0]"
        />
      </form>
      <div className="space-y-8">
        {filteredPosts.map((post) => {
          const postComments = allComments.filter(comment => comment.postId === post._id);
          if (postComments.length === 0) return null;

          return (
            <div key={post._id} className="bg-stone-100 rounded-md shadow p-4">
              <div className="mb-4">
                <h2 className="text-2xl font-bold capitalize">{post.title}</h2>
                <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
              <div className="space-y-4">
                {postComments.map(comment => (
                  <div key={comment._id} className="pb-5">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        size={40}
                        name={comment.userName}
                        variant="beam"
                        colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                      />
                      <div>
                        <p className="font-semibold bg-[#5b5de0] px-2 rounded-2xl inline-block text-white">
                          {comment.userName}
                        </p>
                        <p className="text-sm text-gray-500">{comment.email}</p>
                      </div>
                    </div>
                    <p className="mt-2 font-medium">{comment.comment}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                      <button
                        onClick={() => deleteComments(comment._id)}
                        className="text-white font-bold uppercase py-1 px-3 rounded-md hover:shadow-md hover:shadow-black/50 hover:bg-red-800 transition-all duration-150 bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
