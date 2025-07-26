"use server"

import { evomiAPI, SubUser } from "@/lib/evomi-api"
import { revalidatePath } from "next/cache"
import { auth, db } from "@/lib/firebase/firebase-admin"
import { cookies } from "next/headers"

export type SubscriptionData = {
  type: string;
  displayName: string;
  planName: string;
  isRecurring: boolean;
  totalBandwidth: string;
  status: 'active' | 'expired' | 'expiring-soon' | 'suspended';
  expiresAt: Date | null;
  lastPaymentDate: Date | null;
  availableBalance: number;
  usedBandwidth: string;
  usagePercentage: number;
  daysRemaining?: number;
}

/**
 * Validates the session and returns the user ID
 */
async function validateSession(): Promise<string | null> {
  const sessionCookie = (await cookies()).get("firebaseSessionCookie")?.value

  if (!sessionCookie) {
    return null
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie)
    return decodedClaims.uid
  } catch (error) {
    console.error("Invalid session:", error)
    return null
  }
}

/**
 * Fetches a user's Evomi username from Firestore
 */
async function getEvomiUsernameFromFirestore(userId: string): Promise<string | null> {
  try {
    const userDoc = await db.collection("users").doc(userId).get()

    if (!userDoc.exists) {
      console.error("User document not found")
      return null
    }

    const userData = userDoc.data()
    if (!userData?.evomi?.username) {
      console.error("Evomi username not found in user document")
      return null
    }

    return userData.evomi.username
  } catch (error) {
    console.error("Error fetching Evomi username:", error)
    return null
  }
}

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
export async function getUserProxyUsage(duration = "24h", granularity = "hour") {
  try {
    // Validate session and get user ID
    const userId = await validateSession()
    if (!userId) {
      return {
        success: false,
        error: "Authentication required"
      }
    }

    // Get the user's Evomi username from Firestore
    const username = await getEvomiUsernameFromFirestore(userId)
    if (!username) {
      return {
        success: false,
        error: "Evomi username not found for this user"
      }
    }

    // Now fetch the usage history with the retrieved username
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

/**
 * Fetches an Evomi subuser's details
 * @returns Object containing success status and either the subuser data or an error message
 */
export async function getEvomiSubUser() {
  try {
    // Validate session and get user ID
    const userId = await validateSession()
    if (!userId) {
      return {
        success: false,
        error: "Authentication required"
      }
    }

    // Get the user's Evomi username from Firestore
    const username = await getEvomiUsernameFromFirestore(userId)
    if (!username) {
      return {
        success: false,
        error: "Evomi username not found for this user"
      }
    }

    // Now fetch the subuser details with the retrieved username
    const subUser = await evomiAPI.getSubUser(username)
    return { success: true, data: subUser }
  } catch (error) {
    console.error("Failed to fetch Evomi subuser:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}


/**
 * Fetches a user's current proxy subscriptions and usage data
 * @returns Object containing success status and either the subscriptions data or an error message
 */
export async function getUserSubscriptions() {
  try {
    // Validate session and get user ID
    const userId = await validateSession()
    if (!userId) {
      return {
        success: false,
        error: "Authentication required"
      }
    }

    // Get the user's Evomi username from Firestore
    const username = await getEvomiUsernameFromFirestore(userId)
    if (!username) {
      return {
        success: false,
        error: "Evomi username not found for this user"
      }
    }

    // Get subuser details from Evomi API to get current available balance
    const subUserResponse = await evomiAPI.getSubUser(username)
    if (!subUserResponse) {
      return {
        success: false,
        error: "Failed to fetch user data from Evomi API"
      }
    }

    // Get the user document to access proxyPlans
    const userDoc = await db.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      return {
        success: false,
        error: "User document not found"
      }
    }

    const userData = userDoc.data()
    const proxyPlans = userData?.proxyPlans || {}

    // Map proxy types to their respective display names and Evomi product keys
    const proxyTypeConfig = {
      'residential': {
        displayName: 'Residential Proxies',
        evomiProduct: 'residential' as keyof SubUser['products']
      },
      'datacenter': {
        displayName: 'Datacenter Proxies',
        evomiProduct: 'sharedDataCenter' as keyof SubUser['products']
      },
      'mobile': {
        displayName: 'Mobile Proxies',
        evomiProduct: 'mobile' as keyof SubUser['products']
      },
      'static_residential': {
        displayName: 'Static Residential Proxies',
        evomiProduct: 'residential' as keyof SubUser['products']
      }
    }

    // Create subscription data from the proxyPlans in the user document
    const subscriptions: SubscriptionData[] = []

    for (const [proxyType, planData] of Object.entries(proxyPlans)) {
      if (!planData || !planData.isActive) continue

      const config = proxyTypeConfig[proxyType as keyof typeof proxyTypeConfig]
      if (!config) continue

      const evomiProduct = config.evomiProduct
      const productBalance = subUserResponse.products[evomiProduct]?.balance || 0

      // Convert MB to GB for display
      const availableBalanceGB = (productBalance / 1024)
      
      // Parse total bandwidth to calculate usage
      const totalBandwidthMatch = planData.bandwidth.match(/(\d+)\s*GB/)
      let totalBandwidthGB = 0
      let usedBandwidthGB = 0
      let usagePercentage = 0
      
      if (totalBandwidthMatch && totalBandwidthMatch[1]) {
        totalBandwidthGB = parseFloat(totalBandwidthMatch[1])
        usedBandwidthGB = Math.max(0, totalBandwidthGB - availableBalanceGB)
        usagePercentage = Math.min(100, Math.round((usedBandwidthGB / totalBandwidthGB) * 100))
      }

      // Determine subscription status
      let status = 'active'
      let daysRemaining: number | undefined = undefined
      
      if (planData.expiresAt) {
        const expiresAt = planData.expiresAt.toDate ? planData.expiresAt.toDate() : new Date(planData.expiresAt)
        const now = new Date()
        const diffTime = expiresAt.getTime() - now.getTime()
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (daysRemaining <= 0) {
          status = 'expired'
        } else if (daysRemaining <= 3) {
          status = 'expiring-soon'
        }
      }

      // Create the subscription data object
      subscriptions.push({
        type: proxyType,
        displayName: config.displayName,
        planName: planData.planName || `${proxyType.charAt(0).toUpperCase() + proxyType.slice(1)} Plan`,
        isRecurring: !!planData.isRecurring,
        totalBandwidth: planData.bandwidth,
        status: planData.refundedAt ? 'refunded' : status,
        expiresAt: planData.expiresAt ? (planData.expiresAt.toDate ? planData.expiresAt.toDate() : new Date(planData.expiresAt)) : null,
        lastPaymentDate: planData.purchasedAt ? (planData.purchasedAt.toDate ? planData.purchasedAt.toDate() : new Date(planData.purchasedAt)) : null,
        availableBalance: availableBalanceGB,
        usedBandwidth: `${usedBandwidthGB.toFixed(2)} GB`,
        usagePercentage: usagePercentage,
        daysRemaining: daysRemaining
      })
    }

    return {
      success: true,
      data: subscriptions
    }
  } catch (error) {
    console.error("Failed to fetch user subscriptions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}


/**
 * Updates a user's profile information in Firestore
 * @param profileData Object containing the profile data to update
 * @returns Object containing success status and either a success message or an error message
 */
export async function updateUserProfile(profileData: {
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  location?: string;
}) {
  try {
    // Validate session and get user ID
    const userId = await validateSession();
    if (!userId) {
      return {
        success: false,
        error: "Authentication required"
      };
    }

    // Get the user document reference
    const userDocRef = db.collection("users").doc(userId);

    // Get current user data to preserve existing fields
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return {
        success: false,
        error: "User document not found"
      };
    }

    // Update the user document with the new profile data
    await userDocRef.update({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      username: `${profileData.firstName} ${profileData.lastName}`.trim(),
      phone: profileData.phone || null,
      bio: profileData.bio || null,
      location: profileData.location || null,
      updatedAt: new Date().toISOString()
    });

    // Revalidate any paths that might display user data
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profile updated successfully"
    };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}