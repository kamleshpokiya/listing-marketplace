"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateListing, getListingById } from "@/lib/firestore";
import { Listing } from "@/types";
import { useRouter } from "next/navigation";

interface EditListingFormProps {
  listingId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditListingForm({ listingId, onCancel, onSuccess }: EditListingFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  // Load existing listing data
  useEffect(() => {
    const loadListing = async () => {
      try {
        setLoading(true);
        const listing = await getListingById(listingId);
        
        if (!listing) {
          setError("Listing not found");
          return;
        }

        // Check if user owns this listing
        if (listing.ownerId !== user?.uid) {
          setError("You can only edit your own listings");
          return;
        }

        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price.toString(),
        });
      } catch (error) {
        console.error("Error loading listing:", error);
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    if (user && listingId) {
      loadListing();
    }
  }, [listingId, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be logged in to edit listings");
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateListing(listingId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: price,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error("Error updating listing:", error);
      setError("Failed to update listing. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Listing</h2>
        <p className="text-gray-600">Update your listing information</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-800 font-medium">Listing updated successfully!</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            placeholder="Enter listing title"
            maxLength={100}
            required
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">Maximum 100 characters</span>
            <span className="text-xs text-gray-400">{formData.title.length}/100</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
            placeholder="Describe your item in detail"
            maxLength={500}
            required
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">Maximum 500 characters</span>
            <span className="text-xs text-gray-400">{formData.description.length}/500</span>
          </div>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
            Price *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              $
            </span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Enter price in dollars (e.g., 25.99)</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating...
              </div>
            ) : (
              "Update Listing"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
