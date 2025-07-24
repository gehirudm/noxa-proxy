"use server"

import { cookies } from "next/headers"
import { auth as adminAuth, db } from "./firebase/firebase-admin"

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  role: "user" | "admin"
}

/**
 * Verifies the Firebase session cookie and returns the user data
 * To be used in server actions and API routes
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const sessionCookie = (await cookies()).get("firebaseSessionCookie")?.value

  if (!sessionCookie) {
    return null
  }

  const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true).catch(e => {
    console.error("Failed to verify session cookie:", e)
    return null
  })

  if (!decodedClaims) {
    return null
  }

  // Get additional user data from Firestore
  const userDoc = await db.collection("users").doc(decodedClaims.uid).get().catch(e => {
    console.error(`Error while trying to fetch ${decodedClaims.uid} user data: ${e.message}`)
    return null
  })
  const userData = userDoc? userDoc.data() : {};

  return {
    uid: decodedClaims.uid,
    email: decodedClaims.email || null,
    displayName: decodedClaims.name || userData?.username || null,
    role: userData?.role || "user"
  }
}