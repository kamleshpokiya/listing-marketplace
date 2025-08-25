"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* App Title/Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white text-xl">🏠</span>
            </div>
            <Link
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              href="/"
            >
              Listing Marketplace
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/listings"
              className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              🔍 Browse Listings
            </Link>
            <Link
              href="/create"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ✨ Create Listing
            </Link>
          </div>

          {/* User Info & Sign Out */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-700 text-sm font-medium">
                Welcome, {user.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
