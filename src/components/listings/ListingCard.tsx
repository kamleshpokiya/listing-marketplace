"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { deleteListing } from "@/lib/firestore";
import { Listing } from "@/types";
import Link from "next/link";

interface ListingCardProps {
  listing: Listing;
  onDelete?: () => void;
}

export default function ListingCard({ listing, onDelete }: ListingCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = user?.uid === listing.ownerId;
  const formattedDate = new Date(listing.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const handleDelete = async () => {
    if (!isOwner) return;

    setIsDeleting(true);
    try {
      await deleteListing(listing.id);
      onDelete?.();
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Card Header - Fixed height areas for consistency */}
      <div className="flex-1 p-6 pb-4">
        {/* Title - Fixed height container */}
        <div className="h-12 mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
            {listing.title}
          </h3>
        </div>

        {/* Date with Icon - Fixed height container */}
        <div className="h-6 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formattedDate}
          </div>
        </div>

        {/* Description - Fixed height container */}
        <div className="h-16 mb-6">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {listing.description}
          </p>
        </div>
      </div>

      {/* Fixed Bottom Section - Price and Actions */}
      <div className="mt-auto">
        {/* Price Section - Centered with Gradient */}
        <div className="px-6 pb-4">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-3 px-4 rounded-xl shadow-md">
            <div className="text-2xl font-bold">
              ${listing.price.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Card Footer - Actions */}
        <div className="px-6 pb-6">
          {isOwner && (
            <div className="flex justify-between gap-2">
              {/* Edit Button */}
              <Link
                href={`/edit/${listing.id}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Link>

              {/* Delete Button */}
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 hover:border-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-1.5"
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
                        Confirm
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}
