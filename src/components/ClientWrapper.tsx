"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && window.location.pathname !== "/") {
      router.replace("/");
      return;
    }

    if (token) {
      const verifyToken = async () => {
        try {
          const response = await axios.get(
            process.env.NEXT_PUBLIC_MAIN_URL || "http://localhost:5000/",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );

          if (response.status !== 200) {
            router.replace("/");
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          router.replace("/");
        }
      };

      verifyToken();
    }
  }, [router]);

  return <>{children}</>;
}
