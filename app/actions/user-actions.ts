"use server"

import { evomiAPI } from "@/lib/evomi-api"
import { revalidatePath } from "next/cache"

/**
 * Creates a new sub-user in the Evomi system
 * This is a server action that will be called during user registration
 */
export async function createEvomiSubUser(username: string, email: string) {
  try {
    // Create the sub-user in Evomi
    const subUser = await evomiAPI.createSubUser(username, email)
    
    // Revalidate any paths that might display user data
    revalidatePath("/dashboard")
    
    return { success: true, data: subUser }
  } catch (error) {
    console.error("Failed to create Evomi sub-user:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }
  }
}

/**
 * Fetches a user's proxy usage history
 */
export async function getUserProxyUsage(username: string, duration = "24h", granularity = "hour") {
  try {
    const usageHistory = await evomiAPI.getUsageHistory(username, duration, granularity)
    return { success: true, data: usageHistory }
  } catch (error) {
    console.error("Failed to fetch user proxy usage:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }
  }
}