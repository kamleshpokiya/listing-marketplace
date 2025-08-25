'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createListing } from '@/lib/firestore';
import { useRouter } from 'next/navigation';

export default function CreateListingForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate inputs
      if (!title.trim() || !description.trim() || !price.trim()) {
        throw new Error('All fields are required');
      }

      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Price must be a positive number');
      }

      if (!user) {
        throw new Error('You must be logged in to create a listing');
      }

      // Create the listing
      await createListing({
        title: title.trim(),
        description: description.trim(),
        price: priceValue,
        ownerId: user.uid,
      });

      setSuccess('Listing created successfully!');
      
      // Clear form
      setTitle('');
      setDescription('');
      setPrice('');
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to create a listing.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📝</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h2>
          <p className="text-gray-600">Share your amazing item with the marketplace community</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Listing Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
              placeholder="e.g., Vintage Gaming Console, Designer Handbag, etc."
              required
              maxLength={100}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Be descriptive and catchy!</span>
              <span>{title.length}/100</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 resize-none"
              placeholder="Describe your item in detail. Include condition, features, why someone would want it..."
              required
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Detailed descriptions get more views!</span>
              <span>{description.length}/500</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500 text-lg font-medium">$</span>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 text-lg"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <p className="text-xs text-gray-500">Set a competitive price to attract buyers</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                '✨ Create Listing'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-semibold text-lg border-2 border-gray-200 hover:border-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
