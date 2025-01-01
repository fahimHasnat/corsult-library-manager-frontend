import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow p-8 sm:p-20">
        {/* <Image
          className="mb-6"
          src="/corsult-library-manager-frontend/src/app/favicon.ico"
          alt="Library Logo"
          width={100}
          height={100}
          priority
        /> */}
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Welcome to Corsult Library Management
        </h1>
        <p className="text-lg text-center text-gray-700 mb-8">
          Your trusted software for seamless library management.
        </p>
        <div className="flex gap-4 items-center flex-wrap justify-center">
          <Link
            href="/dashboard"
            className="rounded-full border border-solid border-transparent transition-colors bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 flex items-center justify-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>

      {/* Footer Section */}
      {/* <footer className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Corsult Library Management System.
            All Rights Reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
}
