"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from "react";
import Navbar from "@/components/layout/Navbar";
import EditListingForm from "@/components/listings/EditListingForm";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPage({ params }: EditPageProps) {
  const resolvedParams = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setShowForm(true);
    }
  }, [user, loading, router]);

  const handleCancel = () => {
    router.push("/listings");
  };

  const handleSuccess = () => {
    router.push("/listings");
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
        {showForm && (
          <EditListingForm
            listingId={resolvedParams.id}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        )}
      </main>
    </div>
  );
}
