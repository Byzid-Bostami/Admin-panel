import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import LayoutContainer from "@/components/LayoutContainer";

export const metadata: Metadata = {
  title: "Admin Panel",
  description:
    "Manage your daily blog effortlessly with our powerful admin panel. Create, edit, and publish posts, manage categories, moderate comments, and optimize for SEO—all in one place!",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          <LayoutContainer>{children}</LayoutContainer>
        </ClientWrapper>
      </body>
    </html>
  );
}
