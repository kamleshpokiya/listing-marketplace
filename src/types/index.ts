export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  ownerId: string;
  createdAt: Date;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
