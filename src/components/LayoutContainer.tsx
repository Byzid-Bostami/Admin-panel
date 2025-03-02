"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LayoutContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex justify-between">
      <div className="border-r fixed border-black/35 bg-[#252e2e]">
        <Navbar />
      </div>

      {/* Conditionally render the spacing div unless the route is "/login" */}
      {pathname !== "/" && (
        <div className="lg:w-[6%] md:w-[8%] w-[20%]"></div>
      )}

      <div className="container mx-auto min-h-screen px-3 md:px-8 lg:px-14">
        {children}
      </div>
    </div>
  );
}
