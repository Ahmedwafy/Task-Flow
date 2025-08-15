import "./globals.scss";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Flow",
  description: "Manage your tasks efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* الخلفية */}
        {/* المحتوى */}
        <div>{children}</div>
      </body>
    </html>
  );
}
