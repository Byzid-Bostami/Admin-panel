// page.tsx
'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import useAllPostFetch from '@/components/useAllPostFetch';

// Dynamically import the Froala editor component with SSR disabled
const FroalaEditorComponent = dynamic(
  () => import('@/components/FroalaEditorComponent'),
  { ssr: false }
);

interface Post {
  _id: string;
  title: string;
  photo: string;
  description: string;
  status: 'draft' | 'public';
  featurePost: boolean;
  category: 'news' | 'tech' | 'health';
}

const PageContent: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [photo, setPhoto] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<'draft' | 'public'>('draft');
  const [featurePost, setFeaturePost] = useState<boolean>(false);
  const [category, setCategory] = useState<'news' | 'tech' | 'health'>('news');
  const [editorKey, setEditorKey] = useState<number>(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { posts }: { posts: Post[] } = useAllPostFetch();

  useEffect(() => {
    if (id && posts.length > 0) {
      const updatePost: Post | undefined = posts.find((post: Post) => post._id === id);
      if (updatePost) {
        setTitle(updatePost.title);
        setPhoto(updatePost.photo);
        setDescription(updatePost.description);
        setStatus(updatePost.status);
        setFeaturePost(updatePost.featurePost);
        setCategory(updatePost.category);
        // Update editor key to force a remount of the editor if needed
        setEditorKey((prevKey) => prevKey + 1);
      }
    }
  }, [id, posts]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const URL = process.env.NEXT_PUBLIC_MAIN_URL;
      if (!URL) throw new Error('API URL is not defined');

      const headers = { Authorization: token || '' };

      if (id) {
        await axios.put(
          `${URL}/posts/${id}`,
          { title, photo, description, status, featurePost, category },
          { headers }
        );
      } else {
        await axios.post(
          `${URL}/posts`,
          { title, photo, description, status, featurePost, category },
          { headers }
        );
      }
      // Reset fields after submission
      setTitle('');
      setPhoto('');
      setDescription('');
      setStatus('draft');
      setFeaturePost(false);
      setCategory('news');
      router.push('/posts');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error posting post:', error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error('Error posting post:', error.message);
      } else {
        console.error('Error posting post: unknown error', error);
      }
    }
  };

  return (
    <div className="py-4 min-h-screen space-y-4">
      <div className="flex justify-center items-center rounded-md px-2 bg-violet-600 py-4">
        <h1 className="text-white text-3xl md:text-5xl uppercase font-bold">
          {id ? 'Update Post' : 'Add New Post'}
        </h1>
      </div>

      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
          <div className="md:col-span-2 flex flex-col space-y-4 w-full bg-violet-100 p-4 rounded-md shadow shadow-black/50">
            <input
              className="p-3 rounded-md outline-none focus:ring-1 ring-violet-800"
              type="text"
              name="title"
              placeholder="Post Title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              required
            />
            <input
              className="p-3 rounded-md outline-none focus:ring-1 ring-violet-800"
              type="text"
              name="photo"
              placeholder="Image Link"
              value={photo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoto(e.target.value)}
              required
            />
            <div>
              <FroalaEditorComponent
                key={editorKey}
                initialValue={description}
                onChange={(content: string) => setDescription(content)}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3 w-full">
            <div className="bg-indigo-100 p-3 space-x-4 flex items-center font-medium rounded-md shadow shadow-black/50">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                className="rounded-md bg-violet-500 text-white px-1 py-[1px] outline-none"
                value={status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setStatus(e.target.value as 'draft' | 'public')
                }
              >
                <option value="draft">Draft</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="bg-indigo-100 p-3 space-x-4 flex items-center font-medium rounded-md shadow shadow-black/50">
              <label htmlFor="featured">Featured Post:</label>
              <input
                id="featured"
                className="transform scale-150 outline-none"
                type="checkbox"
                checked={featurePost}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFeaturePost(e.target.checked)}
              />
            </div>

            <div className="bg-indigo-100 p-3 space-x-4 flex items-center font-medium rounded-md shadow shadow-black/50">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                className="rounded-md bg-violet-500 text-white px-1 py-[1px] outline-none"
                value={category}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setCategory(e.target.value as 'news' | 'tech' | 'health')
                }
              >
                <option value="news">News</option>
                <option value="tech">Tech</option>
                <option value="health">Health</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="bg-violet-500 font-medium hover:shadow-md hover:shadow-black/50 text-white px-6 py-1 rounded-md text-xl capitalize inline-block hover:bg-violet-700 transition-all duration-150"
            type="submit"
          >
            {id ? 'update' : 'save'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Wrap the component with Suspense

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page;
