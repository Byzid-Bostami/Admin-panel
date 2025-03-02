"use client";

import Head from "next/head";
import useAllPostFetch from "@/components/useAllPostFetch";
import useAllCommentsFetch from "@/components/useAllCommentsFetch";
import { IoIosPaper } from "react-icons/io";
import { BiSolidCommentDetail } from "react-icons/bi";
import Link from "next/link";
import { IoEye } from "react-icons/io5";
import Image from "next/image";

type post = {
  _id: number;
  photo: string;
  title: string;
  status: string;
  category: string;
  createdAt: string;
  featurePost: boolean;
};

type comm = {
  _id: number;
  userName: string;
  comment: string;
  createdAt: string;
};

export default function Home() {
  const { posts, Ploading, Perror } = useAllPostFetch() as {
    posts: post[];
    Ploading: boolean;
    Perror: Error | null;
  };

  const { comments, loading, error } = useAllCommentsFetch() as {
    comments: comm[];
    loading: boolean;
    error: Error | null;
  };

  const recentPosts: post[] = posts
    ? [...posts]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 9)
    : [];

  const recentComments: comm[] = comments
    ? [...comments]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
    : [];

  return (
    <div className="py-6 space-y-7">
      <Head>
        <link rel="icon" href="../../public/favicon.ico" />
      </Head>

      {/* Total view section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-3 lg:gap-5">
        <div className="bg-[#1a9a7e] text-white p-3 py-5 rounded-sm shadow shadow-black/50 flex justify-evenly items-center">
          <div className="space-y-1">
            <p className="text-4xl font-bold">{posts.length}</p>
            <p className="text-lg font-medium capitalize">total posts</p>
            <p className="capitalize md:text-xs lg:text-base">
              Pub, Drf, Feat, All Cat
            </p>
          </div>
          <p className="text-3xl md:text-4xl text-[#1a9a7e] bg-white rounded-full p-3">
            <IoIosPaper />
          </p>
        </div>

        {/* Total comments section */}
        <div className="bg-[#3f4d41] text-white p-3 py-5 rounded-sm shadow shadow-black/50 flex justify-evenly items-center">
          <div className="space-y-1">
            <p className="text-4xl font-bold">{comments.length}</p>
            <p className="text-lg md:text-base lg:text-lg font-medium capitalize">
              total comments
            </p>
          </div>
          <p className="text-3xl md:text-4xl text-[#3f4d41] bg-white rounded-full p-3">
            <BiSolidCommentDetail />
          </p>
        </div>

        {/* Total visitor section */}
        <div className="bg-[#642039] text-white p-3 py-5 rounded-sm shadow shadow-black/50 flex justify-evenly items-center">
          <div className="space-y-1">
            <p className="text-4xl font-bold">0.3k</p>
            <p className="text-lg font-medium capitalize">Total Visitors</p>
            <p className="capitalize md:text-xs lg:text-base">Last 30 Days</p>
          </div>
          <p className="text-3xl md:text-4xl text-[#642039] bg-white rounded-full p-3">
            <IoEye />
          </p>
        </div>
      </div>

      {/* Posts section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 col-span-1 bg-teal-50 rounded-sm shadow space-y-10 p-4 shadow-black">
          <h2 className="text-3xl text-stone-600 font-bold border-b-2 border-stone-600 capitalize inline-block pb-2">
            Recent posts
          </h2>
          <div className="space-y-4">
            {Ploading ? (
              <div className=" flex justify-center items-center">
                <Image
                  src="/load.gif"
                  alt="loading animation"
                  width={100}
                  height={100}
                  className="w-1/12 object-cover"
                />
              </div>
            ) : Perror ? (
              <p>Error loading posts: {Perror.toString()}</p>
            ) : recentPosts.length > 0 ? (
              recentPosts.map((post: post) => (
                <div
                  className="flex flex-col md:flex-row justify-between items-center"
                  key={post._id}
                >
                  <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-4">
                    <Image
                      src={post.photo}
                      alt={post.title}
                      unoptimized
                      width={40}
                      height={40}
                      className="md:size-10 size-full rounded-sm object-cover"
                    />
                    <p className="font-medium capitalize">
                      {post.title.length > 39
                        ? post.title.slice(0, 39) + "..."
                        : post.title}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <p
                      className={`${
                        post.featurePost === true ? "bg-green-500" : ""
                      } px-2 text-center font-medium rounded-2xl text-white capitalize`}
                    >
                      {post.featurePost === true ? "feature" : ""}
                    </p>
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
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>

          <div className="flex justify-center">
            <Link
              className="inline-flex justify-center items-center hover:shadow-md hover:shadow-black transition-all duration-150 text-white hover:bg-purple-800 font-bold text-lg py-1 px-3 rounded-md bg-indigo-500 uppercase"
              href={"/posts"}
            >
              All posts
            </Link>
          </div>
        </div>

        {/* Comments section */}
        <div className="bg-purple-50 rounded-sm shadow space-y-10 p-4 shadow-black">
          <h2 className="text-3xl text-stone-600 font-bold border-b-2 border-stone-600 capitalize inline-block pb-2">
            Recent comments
          </h2>
          <div className="space-y-4">
            {loading ? (
              <div className=" flex justify-center items-center">
                <Image
                  src="/load.gif"
                  alt="loading animation"
                  width={100}
                  height={100}
                  className="w-1/6 object-cover"
                />
              </div>
            ) : error ? (
              <p>Error loading comments: {error.toString()}</p>
            ) : recentComments.length > 0 ? (
              recentComments.map((comm: comm) => (
                <div className="flex flex-col space-y-1" key={comm._id}>
                  <p>
                    <span className="inline-block px-2 rounded-2xl text-white font-medium text-left bg-indigo-500">
                      {comm.userName}
                    </span>
                  </p>
                  <p className="px-2 text-left font-medium rounded-2xl text-black capitalize">
                    {comm.comment}
                  </p>
                </div>
              ))
            ) : (
              <p>No comments available.</p>
            )}
          </div>

          <div className="flex justify-center">
            <Link
              className="inline-flex justify-center items-center hover:shadow-md hover:shadow-black transition-all duration-150 text-white hover:bg-purple-800 font-bold text-lg py-1 px-3 rounded-md bg-green-500 uppercase"
              href={"/comments"}
            >
              All comments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
