"use server"

import { evomiAPI, ProxySettingsData } from "@/lib/evomi-api"
import { withAuthGuard } from "@/lib/guards/auth-guard"
import { AuthUser } from "@/lib/auth-utils"

/**
 * Server action to fetch proxy settings from Evomi API
 * This action is protected by authentication
 */
export const getProxySettings = withAuthGuard(async (authUser: AuthUser) => {
  try {
    // Fetch proxy settings from Evomi API
    const proxySettings = await evomiAPI.getProxySettings()
    
    return {
      success: true,
      data: proxySettings
    }
  } catch (error) {
    console.error("Failed to fetch proxy settings:", error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred while fetching proxy settings"
    }
  }
})