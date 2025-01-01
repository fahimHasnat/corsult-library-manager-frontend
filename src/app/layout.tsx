import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "Corsult Library Management System",
  description: "An Elegant Software To Maintain Library",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <AuthProvider>
          {/* Header */}
          <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-xl font-bold">
                <a href="/">Corsult Library</a>
              </h1>
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <a
                      href="/dashboard"
                      className="hover:text-gray-200 transition duration-300"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="/login"
                      className="hover:text-gray-200 transition duration-300"
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      href="/signup"
                      className="hover:text-gray-200 transition duration-300"
                    >
                      Signup
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">{children}</main>

          {/* Footer */}
          <footer className="bg-blue-600 text-white mt-10">
            <div className="container mx-auto px-4 py-6 text-center">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Corsult Library Management
                System. All rights reserved.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
