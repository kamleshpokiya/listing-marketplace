import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  startAfter,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Listing } from '@/types';

// Collection reference
const LISTINGS_COLLECTION = 'listings';

// Create a new listing
export const createListing = async (listingData: Omit<Listing, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, LISTINGS_COLLECTION), {
      ...listingData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// Get all listings (sorted by createdAt desc)
export const getAllListings = async (): Promise<Listing[]> => {
  try {
    const q = query(
      collection(db, LISTINGS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const listings: Listing[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      listings.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        price: data.price,
        ownerId: data.ownerId,
        createdAt: data.createdAt.toDate(),
      });
    });
    
    return listings;
  } catch (error) {
    console.error('Error getting listings:', error);
    throw error;
  }
};

// Get listings with pagination
export const getListingsWithPagination = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ listings: Listing[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let q = query(
      collection(db, LISTINGS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    const listings: Listing[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      listings.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        price: data.price,
        ownerId: data.ownerId,
        createdAt: data.createdAt.toDate(),
      });
    });
    
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    
    return { listings, lastDoc: lastVisible };
  } catch (error) {
    console.error('Error getting listings with pagination:', error);
    throw error;
  }
};

// Get a single listing by ID
export const getListingById = async (id: string): Promise<Listing | null> => {
  try {
    const docRef = doc(db, LISTINGS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        price: data.price,
        ownerId: data.ownerId,
        createdAt: data.createdAt.toDate(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting listing:', error);
    throw error;
  }
};

// Get listings by owner ID
export const getListingsByOwner = async (ownerId: string): Promise<Listing[]> => {
  try {
    const q = query(
      collection(db, LISTINGS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const listings: Listing[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.ownerId === ownerId) {
        listings.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          price: data.price,
          ownerId: data.ownerId,
          createdAt: data.createdAt.toDate(),
        });
      }
    });
    
    return listings;
  } catch (error) {
    console.error('Error getting owner listings:', error);
    throw error;
  }
};

// Update a listing (only by owner)
export const updateListing = async (id: string, updates: Partial<Omit<Listing, 'id' | 'ownerId' | 'createdAt'>>): Promise<void> => {
  try {
    const docRef = doc(db, LISTINGS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

// Delete a listing (only by owner)
export const deleteListing = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, LISTINGS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

// Search listings by title or description
export const searchListings = async (searchTerm: string): Promise<Listing[]> => {
  try {
    const q = query(
      collection(db, LISTINGS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const listings: Listing[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const title = data.title.toLowerCase();
      const description = data.description.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      if (title.includes(search) || description.includes(search)) {
        listings.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          price: data.price,
          ownerId: data.ownerId,
          createdAt: data.createdAt.toDate(),
        });
      }
    });
    
    return listings;
  } catch (error) {
    console.error('Error searching listings:', error);
    throw error;
  }
};
