import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { 
  createSupportTicket, 
  replyToTicket, 
  updateTicketStatus, 
  getUserTickets, 
  getTicketById,
  Ticket,
  TicketPriority,
  TicketStatus
} from '@/app/actions/ticket-actions'

export function useTickets() {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch all tickets for the current user
  const fetchTickets = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getUserTickets()
      if (response.success && response.data) {
        setTickets(response.data)
      } else {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Load tickets on initial mount
  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  // Create a new ticket
  const createTicket = async (subject: string, description: string, priority: TicketPriority) => {
    if (!subject.trim() || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return { success: false }
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await createSupportTicket(subject, description, priority)
      
      if (response.success) {
        toast({
          title: "Ticket created",
          description: "Your support ticket has been submitted successfully"
        })
        
        // Refresh tickets list
        await fetchTickets()
        return response
      } else {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        })
        return response
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reply to an existing ticket
  const replyToActiveTicket = async (content: string, attachments?: string[]) => {
    if (!activeTicket) {
      toast({
        title: "Error",
        description: "No active ticket selected",
        variant: "destructive"
      })
      return { success: false }
    }

    if (!content.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a message",
        variant: "destructive"
      })
      return { success: false }
    }
    
    try {
      const response = await replyToTicket(activeTicket.id, content, attachments)
      
      if (response.success) {
        toast({
          title: "Reply sent",
          description: "Your reply has been added to the ticket"
        })
        
        // Refresh ticket details
        await viewTicket(activeTicket.id)
        return response
      } else {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        })
        return response
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Update ticket status
  const updateStatus = async (ticketId: string, status: TicketStatus) => {
    try {
      const response = await updateTicketStatus(ticketId, status)
      
      if (response.success) {
        toast({
          title: "Status updated",
          description: `Ticket status changed to ${status}`
        })
        
        // Refresh ticket details
        if (activeTicket && activeTicket.id === ticketId) {
          await viewTicket(ticketId)
        }
        
        // Also refresh the tickets list
        await fetchTickets()
        return response
      } else {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        })
        return response
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // View ticket details
  const viewTicket = async (ticketId: string) => {
    try {
      const response = await getTicketById(ticketId)
      
      if (response.success && response.data) {
        setActiveTicket(response.data)
        return response
      } else {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        })
        return response
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Clear active ticket
  const clearActiveTicket = () => {
    setActiveTicket(null)
  }

  return {
    tickets,
    activeTicket,
    isLoading,
    isSubmitting,
    fetchTickets,
    createTicket,
    replyToActiveTicket,
    updateStatus,
    viewTicket,
    clearActiveTicket
  }
}