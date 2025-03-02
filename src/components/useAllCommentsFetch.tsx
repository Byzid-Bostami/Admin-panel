"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const useAllCommentsFetch = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchComments = async () => {
      const url = process.env.NEXT_PUBLIC_MAIN_URL;

      try {
        const response = await axios.get(`${url}/comments`,  {
          headers:{
              Authorization:token,
          }
        });
        setComments(response.data || []);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching comments:", error.message);
          setError(error.message);
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  return { comments, loading, error };
};

export default useAllCommentsFetch;
