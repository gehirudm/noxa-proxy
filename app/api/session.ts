import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { auth as adminAuth } from "@/lib/firebase-admin"

// This endpoint creates a session cookie using the Firebase ID token
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    
    if (!idToken) {
      return NextResponse.json(
        { error: "Missing ID token" },
        { status: 400 }
      )
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
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to create session cookie:", error)
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    )
  }
}

// This endpoint clears the session cookie for logout
export async function DELETE() {
  (await cookies()).delete("firebaseSessionCookie")
  return NextResponse.json({ success: true })
}