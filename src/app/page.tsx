'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Rubik } from 'next/font/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from "next/navigation";

const rubik = Rubik({ subsets: ['latin'], weight: ['400', '700'] });


const Login = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_MAIN_URL;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${url}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        router.push("/");
      });
  }, [router,url]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`${url}/login`, { userName, email, password })
      .then((User) => {
        localStorage.setItem("token", User.data.token);
        console.log(User);
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        router.push("/");
      });

    setUserName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-stone-50 p-8 flex flex-col space-y-4 rounded-sm shadow shadow-black/40 w-5/6 md:w-[460px] lg:w-[420px]'>
        <Image
          className='flex justify-center items-center self-center'
          src="/logo.png"
          alt="Example Image"
          width={150}
          height={150}
        />

        <div className='space-y-1'>
          <h1 className={`text-[33px] font-bold text-[#323a33] text-center capitalize ${rubik.className}`}>
            Welcome back!
          </h1>
          <p className='text-gray-500 text-center'>Login to continue</p>
        </div>

        <form className='space-y-3' onSubmit={handleSubmit}>
          <div className='flex flex-col space-y-1'>
            <label className='capitalize font-medium text-gray-700' htmlFor="userName">
              User Name
            </label>
            <input
              className='outline-none ring-1 ring-gray-500/50 p-1 rounded-sm'
              type="text"
              value={userName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col space-y-1'>
            <label className='capitalize font-medium text-gray-700' htmlFor="email">
              Email
            </label>
            <input
              className='outline-none ring-1 ring-gray-500/50 p-1 rounded-sm'
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col space-y-1 relative'>
            <label className='capitalize font-medium text-gray-700' htmlFor="password">
              Password
            </label>
            <input
              className='outline-none ring-1 ring-gray-500/50 p-1 rounded-sm pr-10'
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              id="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className='absolute right-3 text-gray-500 top-2/3 transform -translate-y-1/2'
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <button
            className='hover:bg-[#303631] bg-[#1fa88a] hover:transition-all hover:duration-200 font-medium text-lg text-white capitalize rounded-md w-full py-1'
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
