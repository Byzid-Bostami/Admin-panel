"use client";
import React, { useState, useEffect } from "react";
import useAllPostFetch from "@/components/useAllPostFetch";
import useAllCommentsFetch from "@/components/useAllCommentsFetch";
import Link from "next/link";
import axios from "axios";
import DOMPurify from "dompurify";
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

type comm = {
  _id: number;
  postId: number;
  userName: string;
  email: string;
  comment: string;
  createdAt: string;
};

const Page = ({ params }: { params: Promise<{ _id: string }> }) => {
  const resolvedParams = React.use(params);
  const postId = resolvedParams._id;
  const [allComments, setAllComments] = useState<comm[]>([]);

  const { posts, Ploading, Perror } = useAllPostFetch() as {
    posts: Post[];
    Ploading: boolean;
    Perror: Error | null;
  };

  const { comments } = useAllCommentsFetch() as {
    comments: comm[];
  };

  const router = useRouter();

  useEffect(() => {
    if (comments) setAllComments(comments);
  }, [comments]);

  const deletePost = async (id: number) => {
    const token = localStorage.getItem("token");
    const url = process.env.NEXT_PUBLIC_MAIN_URL;

    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    try {
      await axios
        .delete(`${url}/posts/${id}`, {
          headers: { Authorization: token },
        })
        .then(() => {
          router.push(`/posts`);
        });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

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
      setAllComments(allComments.filter((comment) => comment._id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const createMarkup = (htmlContent: string) => ({
    __html: DOMPurify.sanitize(htmlContent),
  });

  const filteredPosts = posts.filter(
    (post: Post) => post._id.toString() === postId
  );

  return (
    <div className="py-4 min-h-screen space-y-4">
      <div className="flex flex-col gap-5">
        {Ploading ? (
          <div className="flex justify-center items-center min-h-screen">
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
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post: Post) => (
            <div key={post._id}>
              <div className="space-y-5">
                <div className="flex flex-col justify-between space-y-3">
                  <Image
                    src={post.photo}
                    alt={post.title}
                    unoptimized
                    width={800}
                    height={600}
                    className="self-center lg:w-[80%] rounded-md object-cover"
                  />
                  <div className="space-y-1 flex flex-col justify-center lg:px-[10%]">
                    <h1 className="md:text-3xl text-2xl font-bold capitalize">
                      {post.title}
                    </h1>
                    <p className="text-sm text-gray-600 flex space-x-2">
                      <span>Publish Date:</span>{" "}
                      <span>{new Date(post.createdAt).toLocaleString()}</span>
                    </p>
                    <div className="flex py-2 space-x-2 capitalize">
                      <p>Categories:</p>
                      <p className="bg-gray-500 px-2 rounded-md text-white">
                        {post.status}
                      </p>
                      <p className="bg-gray-500 px-2 rounded-md text-white">
                        {post.category}
                      </p>
                      {post.featurePost && (
                        <p className="bg-gray-500 px-2 rounded-md text-white">
                          feature
                        </p>
                      )}
                    </div>
                    <div
                      className="pt-2 text-base first-letter:text-xl first-letter:font-medium"
                      dangerouslySetInnerHTML={createMarkup(post.description)}
                    ></div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className=" pt-8 space-y-4 lg:px-[10%] ">
                  <h2 className="text-2xl bg-stone-500 text-white inline-block px-3 py-1 rounded-md uppercase font-bold">
                    Comments
                  </h2>
                  {allComments
                    .filter((comment) => comment.postId === post._id)
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((comment) => (
                      <div key={comment._id} className="border p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold capitalize">
                              {comment.userName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {comment.email}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteComments(comment._id);
                            }}
                            className="bg-red-500 hover:bg-red-800 hover:shadow-md inline-block hover:shadow-black/50 text-white uppercase font-semibold rounded-md transition-all duration-150 px-2 py-[1px]"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="mt-2">{comment.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <div onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/blog?id=${post._id}`}
                      className="capitalize font-medium text-white hover:bg-lime-600 hover:shadow-sm hover:shadow-black transition-all duration-150 bg-lime-500 rounded-md py-[5px] px-3"
                    >
                      Edit Post
                    </Link>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      deletePost(post._id);
                    }}
                    className="capitalize hover:shadow-sm hover:shadow-black transition-all duration-150 font-medium text-white hover:bg-red-600 bg-red-500 rounded-md py-1 px-3"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No post found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
