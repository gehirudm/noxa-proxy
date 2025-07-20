"use server"

import { cookies } from "next/headers"
import { auth as adminAuth } from "@/lib/firebase-admin"

/**
 * Creates a Firebase session cookie from an ID token
 * @param idToken Firebase ID token from client authentication
 * @returns Object containing success status and optional error message
 */
export async function createSessionCookie(idToken: string) {
  try {
    if (!idToken) {
      return {
        success: false,
        error: "Missing ID token"
      }
    }
    
    // Create a session cookie using the Firebase Admin SDK
    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
    
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    // Set the cookie
    (await cookies()).set({
      name: "firebaseSessionCookie",
      value: sessionCookie,
      maxAge: expiresIn / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict"
    })
    
    return { success: true }
  } catch (error) {
    console.error("Failed to create session cookie:", error)
    return {
      success: false,
      error: "Failed to create session"
    }
  }
}

/**
 * Clears the Firebase session cookie for logout
 */
export async function clearSessionCookie() {
  (await cookies()).delete("firebaseSessionCookie")
  return { success: true }
}