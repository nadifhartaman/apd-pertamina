import "./globals.css";
import { Inter } from "next/font/google"
import LoadingBar from "@/components/ui/loadingBar";
import LayoutMain from "@/components/layout/layoutMain";
import { AuthProvider } from "@/contexts/authContext";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Pertamina Vehicle Tracking",
  description: "Pertamina Vehicle Tracking",
  generator: "Pertamina Vehicle Tracking",
}

export function PageLoadingFallback() {
  return <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse text-center">
      <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
      <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
    </div>
  </div>;
}

export default function RootLayout({ children }) {
  // const cookieHeader = headers().get("cookie") || "";
  // const isAuthenticated = cookieHeader.includes("token="); // Periksa apakah ada token

  return (
    <html lang="en" data-theme="light" attribute="class">
      <body className={inter.className}>
        <AuthProvider>
          <LayoutMain>
            <LoadingBar />
            <Suspense fallback={<PageLoadingFallback/>}>
              {children}
            </Suspense>
          </LayoutMain>
        </AuthProvider>
      </body>
    </html>
  );
}
