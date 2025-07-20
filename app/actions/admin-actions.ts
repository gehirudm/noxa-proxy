"use server"

import { getAuthUser } from "@/app/actions/auth-utils"
import { db, convertTimestamps } from "@/lib/firebase-admin"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Types for admin actions
export type User = {
    uid: string
    email: string
    username: string
    firstName?: string
    lastName?: string
    role: string
    createdAt: string
    lastLoginAt?: string
    evomiUsername?: string
    status: "active" | "suspended" | "banned"
    subscriptions?: {
        type: string
        tier: string
        status: string
        expiresAt?: string
    }[]
    profileImage?: string
}

export type UsersResponse = {
    users: User[]
    totalUsers: number
    totalPages: number
    currentPage: number
}

/**
 * Validates that the current user has admin privileges
 */
async function validateAdminAccess() {
    const authUser = await getAuthUser()

    if (!authUser) {
        return { success: false, error: "Authentication required" }
    }

    if (authUser.role !== "admin") {
        return { success: false, error: "Admin privileges required" }
    }

    return { success: true, userId: authUser.uid }
}

/**
 * Fetches all users with pagination, filtering, and search capabilities
 */
export async function getUsers({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    searchQuery = "",
    filterRole = "",
    filterStatus = ""
}: {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
    searchQuery?: string
    filterRole?: string
    filterStatus?: string
}) {
    try {
        // Validate admin access
        const accessCheck = await validateAdminAccess()
        if (!accessCheck.success) {
            return {
                success: false,
                error: accessCheck.error
            }
        }

        // Calculate pagination
        const offset = (page - 1) * limit

        // Start with base query to get total count
        let countQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection("users");

        // Apply role filter to count query if provided
        if (filterRole) {
            countQuery = db.collection("users").where("role", "==", filterRole)
        }

        // Apply status filter to count query if provided
        if (filterStatus) {
            countQuery = db.collection("users").where("status", "==", filterStatus)
        }

        // Get total count for pagination
        const totalSnapshot = await countQuery.count().get()
        const totalUsers = totalSnapshot.data().count
        const totalPages = Math.ceil(totalUsers / limit)

        // Start building the main query
        let usersQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection("users")

        // Apply filters if provided
        if (filterRole) {
            usersQuery = usersQuery.where("role", "==", filterRole)
        }

        if (filterStatus) {
            usersQuery = usersQuery.where("status", "==", filterStatus)
        }

        // Apply sorting
        usersQuery = usersQuery.orderBy(sortBy, sortOrder)

        // Apply pagination
        usersQuery = usersQuery.limit(limit).offset(offset)

        // Execute query
        const usersSnapshot = await usersQuery.get()

        // Process results
        let users: User[] = []

        for (const doc of usersSnapshot.docs) {
            const userData = convertTimestamps(doc.data())

            // Extract Evomi username if available
            const evomiUsername = userData.evomi?.username || null

            // Format user data for admin view
            const adminUser: User = {
                uid: doc.id,
                email: userData.email || "",
                username: userData.username || "",
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                role: userData.role || "user",
                createdAt: userData.createdAt || "",
                lastLoginAt: userData.lastLoginAt || "",
                evomiUsername: evomiUsername,
                status: userData.status || "active",
                profileImage: userData.profileImage || null
            }

            // If search query is provided, filter results client-side
            // Note: For large datasets, this should be handled differently
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                const matchesSearch =
                    adminUser.email.toLowerCase().includes(query) ||
                    adminUser.username.toLowerCase().includes(query) ||
                    adminUser.firstName?.toLowerCase().includes(query) ||
                    adminUser.lastName?.toLowerCase().includes(query) ||
                    adminUser.uid.toLowerCase().includes(query) ||
                    (evomiUsername && evomiUsername.toLowerCase().includes(query))

                if (!matchesSearch) {
                    continue
                }
            }

            // Add subscriptions data if available
            if (userData.subscriptions) {
                adminUser.subscriptions = userData.subscriptions
            }

            users.push(adminUser)
        }

        return {
            success: true,
            data: {
                users,
                totalUsers,
                totalPages,
                currentPage: page
            } as UsersResponse
        }
    } catch (error) {
        console.error("Failed to fetch users:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch users"
        }
    }
}