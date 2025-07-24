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

    // Fetch the user's proxy subscriptions from Firestore
    const userProxiesRef = db.collection('users').doc(userId).collection('proxies')
    const proxiesSnapshot = await userProxiesRef.get()

    // Get subuser details from Evomi API to get current available balance
    const subUserResponse = await evomiAPI.getSubUser(username)
    if (!subUserResponse) {
      return {
        success: false,
        error: "Failed to fetch user data from Evomi API"
      }
    }

    // Map proxy types to their respective balance fields in the Evomi API response
    const proxyTypeToBalanceMap = {
      'residential': {
        balanceField: 'rpBalance',
        displayName: 'Residential Proxies'
      },
      'datacenter': {
        balanceField: 'sdcBalance',
        displayName: 'Datacenter Proxies'
      },
      'mobile': {
        balanceField: 'mobileBalance',
        displayName: 'Mobile Proxies'
      },
      'static_residential': {
        balanceField: 'staticResidentialBalance', // This might need adjustment based on actual API response
        displayName: 'Static Residential Proxies'
      }
    }

    // Create a map of proxy types to their subscription data
    const subscriptionsMap = new Map<keyof typeof proxyTypeToBalanceMap, SubscriptionData>()

    // First, process the Firestore data to get total purchased bandwidth
    proxiesSnapshot.docs.forEach(doc => {
      const subscription = doc.data()
      const proxyType = subscription.type as keyof typeof proxyTypeToBalanceMap

      if (!subscriptionsMap.has(proxyType)) {
        subscriptionsMap.set(proxyType, {
          type: proxyType,
          displayName: proxyTypeToBalanceMap[proxyType]?.displayName || proxyType,
          planName: subscription.planName,
          isRecurring: subscription.isRecurring,
          totalBandwidth: subscription.bandwidth,
          status: subscription.status || 'active',
          expiresAt: subscription.expiresAt ? subscription.expiresAt.toDate() : null,
          lastPaymentDate: subscription.lastPaymentDate ? subscription.lastPaymentDate.toDate() : null,
          // These will be filled in later
          availableBalance: 0,
          usedBandwidth: '0 GB',
          usagePercentage: 0
        })
      }
    })

    // Now, add the current available balance from the Evomi API
    for (const [proxyType, subscriptionData] of subscriptionsMap.entries()) {
      const balanceField = proxyTypeToBalanceMap[proxyType]?.balanceField

      // Map proxy types to their corresponding product keys in the SubUser interface
      const productMapping: Record<string, keyof SubUser['products']> = {
        'residential': 'residential',
        'datacenter': 'sharedDataCenter',
        'mobile': 'mobile',
        'static_residential': 'residential' // Assuming static residential uses the same product
      }

      const productKey = productMapping[proxyType]

      if (productKey && subUserResponse.products[productKey]) {
        // Get balance from the correct product in the SubUser response
        const productBalance = subUserResponse.products[productKey]?.balance || 0

        // Convert MB to GB for display
        const availableBalanceGB = (productBalance / 1024)
        subscriptionData.availableBalance = availableBalanceGB

        // Parse total bandwidth to calculate usage
        const totalBandwidthMatch = subscriptionData.totalBandwidth.match(/(\d+)\s*GB/)
        if (totalBandwidthMatch && totalBandwidthMatch[1]) {
          const totalBandwidthGB = parseFloat(totalBandwidthMatch[1])
          const usedBandwidthGB = Math.max(0, totalBandwidthGB - availableBalanceGB)

          subscriptionData.usedBandwidth = `${usedBandwidthGB.toFixed(2)} GB`
          subscriptionData.usagePercentage = Math.min(100, Math.round((usedBandwidthGB / totalBandwidthGB) * 100))
        }
      }

      // Calculate days remaining if there's an expiration date
      if (subscriptionData.expiresAt) {
        const now = new Date()
        const diffTime = subscriptionData.expiresAt.getTime() - now.getTime()
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        subscriptionData.daysRemaining = daysRemaining

        if (daysRemaining <= 0) {
          subscriptionData.status = 'expired'
        } else if (daysRemaining <= 3) {
          subscriptionData.status = 'expiring-soon'
        }
      }
    }

    // Convert the map to an array for the response
    const subscriptions = Array.from(subscriptionsMap.values())

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