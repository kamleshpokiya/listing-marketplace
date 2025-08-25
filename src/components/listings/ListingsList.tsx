"use client";

import { useState, useEffect } from "react";
import {
  getAllListings,
  searchListings,
  getListingsWithPagination,
} from "@/lib/firestore";
import { Listing } from "@/types";
import ListingCard from "./ListingCard";
import { useRouter } from "next/navigation";

export default function ListingsList() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Filter state
  const [priceFilter, setPriceFilter] = useState<
    "none" | "high-to-low" | "low-to-high"
  >("none");
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);

  const ITEMS_PER_PAGE = 9; // 3x3 grid

  useEffect(() => {
    loadListings();
  }, []);

  // Apply price filter whenever listings or filter changes
  useEffect(() => {
    if (priceFilter === "none") {
      setFilteredListings(listings);
    } else {
      const sorted = [...listings].sort((a, b) => {
        if (priceFilter === "high-to-low") {
          return b.price - a.price;
        } else {
          return a.price - b.price;
        }
      });
      setFilteredListings(sorted);
    }
  }, [listings, priceFilter]);

  const loadListings = async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
        setLastDoc(null);
        setHasMore(true);
        setIsSearchMode(false);
      } else {
        setLoadingMore(true);
      }

      const result = await getListingsWithPagination(
        ITEMS_PER_PAGE,
        reset ? null : lastDoc
      );

      if (reset) {
        setListings(result.listings);
      } else {
        setListings((prev) => [...prev, ...result.listings]);
      }

      setLastDoc(result.lastDoc);
      setHasMore(result.listings.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error loading listings:", error);
      setError("Failed to load listings. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadListings(true);
      return;
    }

    try {
      setSearching(true);
      setCurrentPage(1);
      setLastDoc(null);
      setHasMore(true);
      setIsSearchMode(true);

      const searchResults = await searchListings(searchTerm);
      setListings(searchResults);
    } catch (error) {
      console.error("Error searching listings:", error);
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = () => {
    // Reload listings after deletion
    loadListings(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    loadListings(true);
  };

  const loadMore = () => {
    if (!isSearchMode && hasMore && !loadingMore) {
      setCurrentPage((prev) => prev + 1);
      loadListings(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            🔍 Find Your Perfect Item
          </h3>
          <p className="text-gray-600 text-sm">
            Search through our marketplace listings
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search listings by title or description..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {searching ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </div>
            ) : (
              "Search"
            )}
          </button>
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Price Filter */}
      {!isSearchMode && listings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-gray-700">
                💰 Sort by Price:
              </span>
              <select
                value={priceFilter}
                onChange={(e) =>
                  setPriceFilter(
                    e.target.value as "none" | "high-to-low" | "low-to-high"
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white hover:border-gray-400"
              >
                <option value="none">Default (Newest First)</option>
                <option value="high-to-low">Price: High to Low</option>
                <option value="low-to-high">Price: Low to High</option>
              </select>
            </div>
            {priceFilter !== "none" && (
              <button
                onClick={() => setPriceFilter("none")}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Listings */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm ? "No listings found" : "No listings yet"}
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? `No listings match "${searchTerm}". Try a different search term.`
              : "Be the first to create a listing!"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => (window.location.href = "/create")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create First Listing
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!isSearchMode && hasMore && filteredListings.length > 0 && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loadingMore ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Loading more...
              </div>
            ) : (
              "Load More Listings"
            )}
          </button>
        </div>
      )}

      {/* End of Results */}
      {!isSearchMode && !hasMore && filteredListings.length > 0 && (
        <div className="text-center pt-6">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            You've reached the end of all listings
          </div>
        </div>
      )}

      {/* Results Count */}
      {filteredListings.length > 0 && (
        <div className="text-center text-gray-600">
          {searchTerm
            ? `Found ${filteredListings.length} listing${
                filteredListings.length === 1 ? "" : "s"
              } for "${searchTerm}"`
            : `Showing ${filteredListings.length} listing${
                filteredListings.length === 1 ? "" : "s"
              }`}
        </div>
      )}
    </div>
  );
}
