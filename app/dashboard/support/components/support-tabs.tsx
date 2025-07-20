"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageCircle, Mail, ChevronDown, ChevronUp, Clock, AlertCircle, CheckCircle, XCircle, Send, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    type Ticket,
    type TicketPriority,
    type TicketStatus
} from "@/app/actions/ticket-actions"
import { useTickets } from "@/hooks/use-ticket"

export function SupportTabs() {
    const {
        tickets,
        activeTicket,
        isLoading,
        isSubmitting,
        createTicket,
        replyToActiveTicket,
        updateStatus,
        viewTicket,
        clearActiveTicket
    } = useTickets()

    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState<TicketPriority>("Medium")
    const [replyContent, setReplyContent] = useState("")
    const [expandedTickets, setExpandedTickets] = useState<Record<string, boolean>>({})
    const [activeTab, setActiveTab] = useState("new")

    // Handle ticket submission
    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault()

        const response = await createTicket(subject, description, priority)

        if (response.success) {
            // Reset form
            setSubject("")
            setDescription("")
            setPriority("Medium")

            // Switch to tickets tab
            setActiveTab("tickets")
        }
    }

    // Handle ticket reply
    const handleReplyToTicket = async () => {
        const response = await replyToActiveTicket(replyContent)

        if (response.success) {
            // Reset reply field
            setReplyContent("")
        }
    }

    // Handle ticket status update
    const handleUpdateStatus = async (ticketId: string, status: TicketStatus) => {
        await updateStatus(ticketId, status)
    }

    // View ticket details
    const handleViewTicket = async (ticketId: string) => {
        const response = await viewTicket(ticketId)

        if (response.success) {
            setActiveTab("view")
        }
    }

    // Toggle ticket expansion in the list
    const toggleTicketExpansion = (ticketId: string) => {
        setExpandedTickets(prev => ({
            ...prev,
            [ticketId]: !prev[ticketId]
        }))
    }

    // Helper function to get status badge
    const getStatusBadge = (status: TicketStatus) => {
        switch (status) {
            case "Open":
                return <Badge className="bg-blue-500">{status}</Badge>
            case "In Progress":
                return <Badge className="bg-yellow-500">{status}</Badge>
            case "Resolved":
                return <Badge className="bg-green-500">{status}</Badge>
            case "Closed":
                return <Badge className="bg-gray-500">{status}</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    // Helper function to get priority badge
    const getPriorityBadge = (priority: TicketPriority) => {
        switch (priority) {
            case "Low":
                return <Badge className="bg-gray-500">{priority}</Badge>
            case "Medium":
                return <Badge className="bg-blue-500">{priority}</Badge>
            case "High":
                return <Badge className="bg-orange-500">{priority}</Badge>
            case "Critical":
                return <Badge className="bg-red-500">{priority}</Badge>
            default:
                return <Badge>{priority}</Badge>
        }
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="new">New Ticket</TabsTrigger>
                <TabsTrigger value="tickets">My Tickets</TabsTrigger>
                <TabsTrigger value="view" disabled={!activeTicket}>View Ticket</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
                <Card className="bg-gray-800 border-gray-700">
                    <form onSubmit={handleSubmitTicket}>
                        <CardHeader>
                            <CardTitle className="text-white">Submit a Ticket</CardTitle>
                            <CardDescription className="text-gray-400">
                                Fill out the form below to create a new support ticket
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    placeholder="Brief description of your issue"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="bg-gray-700 border-gray-600"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <select
                                    id="priority"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                                    className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Please provide as much detail as possible about your issue"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-gray-700 border-gray-600 min-h-[150px]"
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Ticket"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>

            <TabsContent value="tickets">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">My Support Tickets</CardTitle>
                        <CardDescription className="text-gray-400">
                            View and manage your support tickets
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Loading tickets...</p>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-400">You don't have any support tickets yet.</p>
                                <Button
                                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                                    onClick={() => setActiveTab("new")}
                                >
                                    Create a Ticket
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tickets.map((ticket) => (
                                    <Card key={ticket.id} className="bg-gray-700 border-gray-600">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-white text-lg">
                                                        {ticket.subject}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-400">
                                                            #{ticket.id.substring(0, 8)}
                                                        </span>
                                                        {getStatusBadge(ticket.status)}
                                                        {getPriorityBadge(ticket.priority)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-gray-500 text-gray-300"
                                                        onClick={() => handleViewTicket(ticket.id)}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleTicketExpansion(ticket.id)}
                                                    >
                                                        {expandedTickets[ticket.id] ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        {expandedTickets[ticket.id] && (
                                            <CardContent className="pt-0">
                                                <div className="text-sm text-gray-300 mt-2">
                                                    <p className="mb-2">
                                                        <span className="text-gray-400">Created:</span>{" "}
                                                        {new Date(ticket.createdAt).toLocaleString()}
                                                    </p>
                                                    <p className="mb-2">
                                                        <span className="text-gray-400">Last updated:</span>{" "}
                                                        {new Date(ticket.updatedAt).toLocaleString()}
                                                    </p>
                                                    <div className="mt-4">
                                                        <p className="text-gray-400 mb-2">Latest message:</p>
                                                        <div className="bg-gray-800 p-3 rounded-md">
                                                            {ticket.messages[ticket.messages.length - 1].content}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="view">
                {activeTicket && (
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-white">{activeTicket.subject}</CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Ticket #{activeTicket.id.substring(0, 8)} •
                                        Created {new Date(activeTicket.createdAt).toLocaleString()}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(activeTicket.status)}
                                    {getPriorityBadge(activeTicket.priority)}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-between items-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-500 text-gray-300"
                                    onClick={() => setActiveTab("tickets")}
                                >
                                    Back to Tickets
                                </Button>

                                <div className="flex gap-2">
                                    {activeTicket.status !== "Closed" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-500 text-gray-300"
                                            onClick={() => handleUpdateStatus(activeTicket.id, "Closed")}
                                        >
                                            Close Ticket
                                        </Button>
                                    )}
                                    {activeTicket.status === "Closed" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-500 text-gray-300"
                                            onClick={() => handleUpdateStatus(activeTicket.id, "Open")}
                                        >
                                            Reopen Ticket
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {activeTicket.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`p-4 rounded-lg ${message.authorRole === "user"
                                                ? "bg-blue-900/30 border border-blue-800"
                                                : message.authorRole === "admin"
                                                    ? "bg-purple-900/30 border border-purple-800"
                                                    : "bg-gray-700/50 border border-gray-600"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {message.authorName}
                                                </span>
                                                <Badge className={
                                                    message.authorRole === "user"
                                                        ? "bg-blue-600"
                                                        : message.authorRole === "admin"
                                                            ? "bg-purple-600"
                                                            : "bg-gray-600"
                                                }>
                                                    {message.authorRole === "system" ? "System" : message.authorRole}
                                                </Badge>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(message.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
                                        {message.attachments && message.attachments.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-700">
                                                <p className="text-sm text-gray-400 mb-2">Attachments:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {message.attachments.map((attachment, index) => (
                                                        <a
                                                            key={index}
                                                            href={attachment}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                                                        >
                                                            File #{index + 1}
                                                            <ExternalLink className="h-3 w-3 ml-1" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {activeTicket.status !== "Closed" && (
                                <div className="pt-4 border-t border-gray-700">
                                    <Label htmlFor="reply" className="mb-2 block">
                                        Reply to this ticket
                                    </Label>
                                    <div className="flex gap-2">
                                        <Textarea
                                            id="reply"
                                            placeholder="Type your reply here..."
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            className="bg-gray-700 border-gray-600 flex-1"
                                        />
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 self-end"
                                            onClick={() => handleReplyToTicket()}
                                            disabled={!replyContent.trim()}
                                        >
                                            <Send className="h-4 w-4 mr-2" />
                                            Send
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </TabsContent>
        </Tabs>
    )
}