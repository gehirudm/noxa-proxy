"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  type UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  getIdToken,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore"
import { createEvomiSubUser } from "@/app/actions/user-actions"
import { useRouter } from "next/navigation"
import { clearSessionCookie, createSessionCookie } from "@/app/actions/auth-actions"

interface UserData {
  uid: string;
  profileImage?: string;
  username: string;
  email: string;
  createdAt: string;
  role: string;
  evomi?: {
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
    products: Record<string, any>;
  };
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  evomiUsername: string | null;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<User>;
  signUp: (username: string, email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  fetchUserData: () => Promise<UserData | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const db = getFirestore();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [evomiUsername, setEvomiUsername] = useState<string | null>(null)

  const router = useRouter();

  // Function to create a session cookie on the server
  const createSession = async (user: User) => {
    try {
      const idToken = await getIdToken(user)

      // Create the session cookie using the server action
      const result = await createSessionCookie(idToken);

      if (!result.success) {
        throw new Error(result.error || "Failed to create session")
      }
    } catch (error) {
      console.error('Error creating session:', error)
    }
  }

  const fetchUserData = async (_userId?: string): Promise<UserData | null> => {
    const userId = _userId?? user?.uid;
    if (!userId) return null;
    
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      console.log(userDoc.data())

      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);

        // Also update Evomi username if available
        if (data.evomi?.username) {
          setEvomiUsername(data.evomi.username);
        }

        return data;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const fetchEvomiUsername = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.evomi && userData.evomi.username) {
          setEvomiUsername(userData.evomi.username)
        }
      }
    } catch (error) {
      console.error("Error fetching Evomi username:", error)
    }
  }

  // Function to check if user profile is complete and redirect if needed
  const checkProfileCompletion = async (user: User) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      // If user document doesn't exist or doesn't have Evomi username, redirect to complete profile
      if (!userDoc.exists() || !userDoc.data()?.evomi?.username) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking profile completion:", error);
      return false;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Create a session when user logs in
        await createSession(user)
        // Fetch Evomi username
        await fetchEvomiUsername(user.uid)
        // Fetch user data
        await fetchUserData(user.uid)
      } else {
        // Clear Evomi username when user logs out
        setEvomiUsername(null)
        setUserData(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    await createSession(userCredential.user)
    await fetchEvomiUsername(userCredential.user.uid)
    return userCredential
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create session
      await createSession(user);

      // Check if user has a complete profile
      const isProfileComplete = await checkProfileCompletion(user);

      if (!isProfileComplete) router.push('/auth/complete-profile')
      else router.push('/dashboard')

      // If profile is not complete, the redirect happens in checkProfileCompletion
      // Otherwise, we can return the user
      return user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  const signUp = async (username: string, email: string, password: string) => {
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile with username
      await updateProfile(user, {
        displayName: username
      })

      // Create Evomi sub-user via server action and get the response
      const evomiResponse = await createEvomiSubUser(username, email)

      if (!evomiResponse.success || !evomiResponse.data) {
        console.error("Failed to create Evomi subuser:", evomiResponse.error)
        throw new Error(`Failed to create proxy account: ${evomiResponse.error}`)
      }

      // Extract the subuser data from the response
      const subUser = evomiResponse.data

      const newUserData: UserData = {
        uid: user.uid,
        username,
        email,
        createdAt: new Date().toISOString(),
        role: "user",
        evomi: {
          username: subUser.username,
          email: subUser.email,
          created_at: subUser.created_at,
          updated_at: subUser.updated_at,
          products: subUser.products || {}
        }
      };

      // Store additional user data in Firestore, including Evomi subuser information
      await setDoc(doc(db, "users", user.uid), newUserData)

      // Set the user data and Evomi username in state
      setUserData(newUserData)
      setEvomiUsername(subUser.username)

      // Create a session
      await createSession(user)

      return userCredential
    } catch (error) {
      console.error("Error during sign up:", error)
      throw error
    }
  }

  const logout = async () => {
    // Clear the session cookie
    await clearSessionCookie();

    // Clear Evomi username
    setEvomiUsername(null)
    setUserData(null)

    await signOut(auth)

    router.replace('/auth');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        evomiUsername,
        signIn,
        signInWithGoogle,
        signUp,
        logout,
        fetchUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}