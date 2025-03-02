"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const useAllPostFetch = () => {
  const [posts, setPosts] = useState([]);
  const [Ploading, setPLoading] = useState(true);
  const [Perror, setPError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const url = process.env.NEXT_PUBLIC_MAIN_URL;

      try {
        const response = await axios.get(`${url}/posts`);
        setPosts(response.data || []);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching data:", error.message);
          setPError(error.message);
        } else {
          console.error("Unexpected error:", error);
          setPError("An unexpected error occurred");
        }
      } finally {
        setPLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, Ploading, Perror };
};

export default useAllPostFetch;
