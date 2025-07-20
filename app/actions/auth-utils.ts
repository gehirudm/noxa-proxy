"use server"

import { cookies } from "next/headers"
import { auth as adminAuth, db } from "../../lib/firebase-admin"

export interface AuthUser {
  uid: string
  email: string
  displayName: string | null
  role: "user" | "admin"
}

/**
 * Verifies the Firebase session cookie and returns the user data
 * To be used in server actions and API routes
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const sessionCookie = (await cookies()).get("firebaseSessionCookie")?.value

    if (!sessionCookie) {
      return null
    }
    
    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
    
    // Get additional user data from Firestore
    const userDoc = await db.collection("users").doc(decodedClaims.uid).get()
    const userData = userDoc.data()
    
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email || "",
      displayName: decodedClaims.name || userData?.username || null,
      role: userData?.role || "user"
    }
  } catch (error) {
    console.error("Error verifying auth session:", error)
    return null
  }
}