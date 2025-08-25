"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { getAllListings } from "@/lib/firestore";
import { Listing } from "@/types";
import ListingCard from "@/components/listings/ListingCard";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadRecentListings();
    }
  }, [user]);

  const loadRecentListings = async () => {
    try {
      setListingsLoading(true);
      const allListings = await getAllListings();
      // Show only the 6 most recent listings
      setRecentListings(allListings.slice(0, 6));
    } catch (error) {
      console.error("Error loading recent listings:", error);
    } finally {
      setListingsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Listing Marketplace! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your one-stop destination for buying and selling amazing items.
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">🚀</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Getting Started
              </h2>
              <p className="text-gray-600 text-lg">
                You're now logged in and ready to explore listings or create
                your own!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link
                href="/listings"
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 cursor-pointer text-left border-2 border-blue-200 hover:border-blue-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">🔍</span>
                  </div>
                  <h3 className="font-bold text-blue-900 text-xl">
                    Browse All Listings
                  </h3>
                </div>
                <p className="text-blue-700 text-base leading-relaxed">
                  Explore amazing items from other users in the marketplace.
                  Find unique treasures and great deals!
                </p>
              </Link>

              <Link
                href="/create"
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 cursor-pointer text-left border-2 border-green-200 hover:border-green-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">✨</span>
                  </div>
                  <h3 className="font-bold text-green-900 text-xl">
                    Create New Listing
                  </h3>
                </div>
                <p className="text-green-700 text-base leading-relaxed">
                  Turn your items into cash! Create compelling listings that
                  attract buyers and maximize your sales.
                </p>
              </Link>
            </div>

            {/* Recent Listings */}
            <div className="border-t border-gray-200 pt-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  🔥 Recent Listings
                </h3>
                <p className="text-gray-600">
                  Check out the latest items in our marketplace
                </p>
              </div>

              {listingsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 text-lg">
                    Loading recent listings...
                  </p>
                </div>
              ) : recentListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onDelete={loadRecentListings}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-4xl">📦</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">
                    No listings yet
                  </h4>
                  <p className="text-gray-500 mb-6">
                    Be the first to create a listing and start selling!
                  </p>
                  <Link
                    href="/create"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    ✨ Create First Listing
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
