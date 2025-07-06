"use server"

import { db, auth, convertTimestamps } from "@/lib/firebase-admin"
import { revalidatePath } from "next/cache"
import { getAuthUser } from "@/lib/auth-utils"

export type TicketPriority = "Low" | "Medium" | "High" | "Critical"
export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed"

export interface TicketMessage {
  id: string
  content: string
  createdAt: string
  authorId: string
  authorName: string
  authorRole: "user" | "admin" | "system"
  attachments?: string[]
}

export interface Ticket {
  id: string
  subject: string
  priority: TicketPriority
  status: TicketStatus
  userId: string
  username: string
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
}

/**
 * Creates a new support ticket
 */
export async function createSupportTicket(
  subject: string,
  description: string,
  priority: TicketPriority
) {
  try {
    // Get the current authenticated user using Firebase session cookie
    const authUser = await getAuthUser()
    
    if (!authUser) {
      return { success: false, error: "You must be logged in to create a ticket" }
    }
    
    const userId = authUser.uid
    const username = authUser.displayName || authUser.email || "Unknown User"
    
    // Create a new ticket document
    const ticketRef = db.collection("supportTickets").doc()
    const ticketId = ticketRef.id
    
    const now = new Date().toISOString()
    
    const messageId = `msg_${Date.now()}`
    
    const newTicket: Ticket = {
      id: ticketId,
      subject,
      priority,
      status: "Open",
      userId,
      username,
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: messageId,
          content: description,
          createdAt: now,
          authorId: userId,
          authorName: username,
          authorRole: "user"
        }
      ]
    }
    
    await ticketRef.set(newTicket)
    
    // Notify admins about new ticket (could be implemented with a cloud function)
    
    // Revalidate the support page
    revalidatePath("/dashboard/support")
    
    return { success: true, data: { ticketId } }
  } catch (error) {
    console.error("Failed to create support ticket:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create ticket" 
    }
  }
}

/**
 * Adds a reply to an existing ticket
 */
export async function replyToTicket(ticketId: string, content: string, attachments?: string[]) {
  try {
    // Get the current authenticated user using Firebase session cookie
    const authUser = await getAuthUser()
    
    if (!authUser) {
      return { success: false, error: "You must be logged in to reply to a ticket" }
    }
    
    const userId = authUser.uid
    const username = authUser.displayName || authUser.email || "Unknown User"
    const userRole = authUser.role
    
    // Get the ticket document
    const ticketRef = db.collection("supportTickets").doc(ticketId)
    const ticketDoc = await ticketRef.get()
    
    if (!ticketDoc.exists) {
      return { success: false, error: "Ticket not found" }
    }
    
    const ticket = convertTimestamps(ticketDoc.data()) as Ticket
    
    // Check if user is authorized to reply (either the ticket owner or an admin)
    if (ticket.userId !== userId && userRole !== "admin") {
      return { success: false, error: "You are not authorized to reply to this ticket" }
    }
    
    const now = new Date().toISOString()
    const messageId = `msg_${Date.now()}`
    
    const newMessage: TicketMessage = {
      id: messageId,
      content,
      createdAt: now,
      authorId: userId,
      authorName: username,
      authorRole: userRole as "user" | "admin",
      attachments
    }
    
    // Add the new message to the ticket
    await ticketRef.update({
      messages: [...ticket.messages, newMessage],
      updatedAt: now,
      // If an admin replies, update status to "In Progress" if it's currently "Open"
      ...(userRole === "admin" && ticket.status === "Open" ? { status: "In Progress" as TicketStatus } : {})
    })
    
    // Revalidate the support page
    revalidatePath("/dashboard/support")
    
    return { success: true, data: { messageId } }
  } catch (error) {
    console.error("Failed to reply to ticket:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to reply to ticket" 
    }
  }
}

/**
 * Updates the status of a ticket
 */
export async function updateTicketStatus(ticketId: string, status: TicketStatus) {
  try {
    // Get the current authenticated user using Firebase session cookie
    const authUser = await getAuthUser()
    
    if (!authUser) {
      return { success: false, error: "You must be logged in to update a ticket" }
    }
    
    const userId = authUser.uid
    const userRole = authUser.role
    
    // Only admins can change status (except users can close their own tickets)
    if (userRole !== "admin" && (status !== "Closed")) {
      return { success: false, error: "You are not authorized to update this ticket's status" }
    }
    
    // Get the ticket document
    const ticketRef = db.collection("supportTickets").doc(ticketId)
    const ticketDoc = await ticketRef.get()
    
    if (!ticketDoc.exists) {
      return { success: false, error: "Ticket not found" }
    }
    
    const ticket = convertTimestamps(ticketDoc.data()) as Ticket
    
    // If user is not admin, check if they own the ticket
    if (userRole !== "admin" && ticket.userId !== userId) {
      return { success: false, error: "You can only update your own tickets" }
    }
    
    const now = new Date().toISOString()
    
    // Add a system message about the status change
    const systemMessage: TicketMessage = {
      id: `msg_${Date.now()}`,
      content: `Ticket status changed from ${ticket.status} to ${status}`,
      createdAt: now,
      authorId: "system",
      authorName: "System",
      authorRole: "system"
    }
    
    // Update the ticket
    await ticketRef.update({
      status,
      updatedAt: now,
      messages: [...ticket.messages, systemMessage]
    })
    
    // Revalidate the support page
    revalidatePath("/dashboard/support")
    
    return { success: true }
  } catch (error) {
    console.error("Failed to update ticket status:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update ticket status" 
    }
  }
}

/**
 * Gets all tickets for the current user
 */
export async function getUserTickets() {
  try {
    // Get the current authenticated user using Firebase session cookie
    const authUser = await getAuthUser()
    
    if (!authUser) {
      return { success: false, error: "You must be logged in to view tickets" }
    }
    
    const userId = authUser.uid
    const userRole = authUser.role
    
    let ticketsQuery;
    
    // Admins can see all tickets, users can only see their own
    if (userRole === "admin") {
      ticketsQuery = db.collection("supportTickets")
        .orderBy("updatedAt", "desc");
    } else {
      ticketsQuery = db.collection("supportTickets")
        .where("userId", "==", userId)
        .orderBy("updatedAt", "desc");
    }
    
    const ticketsSnapshot = await ticketsQuery.get()
    const tickets = ticketsSnapshot.docs.map(doc => convertTimestamps(doc.data()) as Ticket)
    
    return { success: true, data: tickets }
  } catch (error) {
    console.error("Failed to get user tickets:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to get tickets" 
    }
  }
}

/**
 * Gets a specific ticket by ID
 */
export async function getTicketById(ticketId: string) {
  try {
    // Get the current authenticated user using Firebase session cookie
    const authUser = await getAuthUser()
    
    if (!authUser) {
      return { success: false, error: "You must be logged in to view a ticket" }
    }
    
    const userId = authUser.uid
    const userRole = authUser.role
    
    // Get the ticket document
    const ticketRef = db.collection("supportTickets").doc(ticketId)
    const ticketDoc = await ticketRef.get()
    
    if (!ticketDoc.exists) {
      return { success: false, error: "Ticket not found" }
    }
    
    const ticket = convertTimestamps(ticketDoc.data()) as Ticket
    
    // Check if user is authorized to view this ticket
    if (ticket.userId !== userId && userRole !== "admin") {
      return { success: false, error: "You are not authorized to view this ticket" }
    }
    
    return { success: true, data: ticket }
  } catch (error) {
    console.error("Failed to get ticket:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to get ticket" 
    }
  }
}