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
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore"
import { createEvomiSubUser } from "@/app/actions/user-actions"

interface AuthContextType {
  user: User | null
  loading: boolean
  evomiUsername: string | null
  signIn: (email: string, password: string) => Promise<UserCredential>
  signUp: (username: string, email: string, password: string) => Promise<UserCredential>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const db = getFirestore();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [evomiUsername, setEvomiUsername] = useState<string | null>(null)

  // Function to create a session cookie on the server
  const createSession = async (user: User) => {
    try {
      const idToken = await getIdToken(user)

      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      if (!response.ok) {
        throw new Error('Failed to create session')
      }
    } catch (error) {
      console.error('Error creating session:', error)
    }
  }

  // Function to fetch Evomi username from Firestore
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Create a session when user logs in
        await createSession(user)
        // Fetch Evomi username
        await fetchEvomiUsername(user.uid)
      } else {
        // Clear Evomi username when user logs out
        setEvomiUsername(null)
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

      // Store additional user data in Firestore, including Evomi subuser information
      await setDoc(doc(db, "users", user.uid), {
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
      })

      // Set the Evomi username in state
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
    await fetch('/api/auth/session', {
      method: 'DELETE',
    })
    
    // Clear Evomi username
    setEvomiUsername(null)
    
    await signOut(auth)
  }

  return <AuthContext.Provider value={{ user, loading, evomiUsername, signIn, signUp, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}