"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { TransactionFilters, TransactionFilterValues } from "./transaction-filters"
import { db } from "@/lib/firebase/firebase"
import { collection, query, where, orderBy, getDocs, limit, DocumentData } from "firebase/firestore"

interface Transaction {
    id: string
    type: 'deposit' | 'purchase' | 'refund'
    amount: number
    currency: string
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
    createdAt: Date
    paymentProvider: string
    description: string
    proxyType?: string
    metadata?: Record<string, any>
}

interface TransactionHistoryProps {
    initialFilters?: Partial<TransactionFilterValues>
}

export function TransactionHistory({ initialFilters = {} }: TransactionHistoryProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [filters, setFilters] = useState<TransactionFilterValues>({
        dateRange: initialFilters.dateRange || "",
        status: initialFilters.status || "",
        transactionType: initialFilters.transactionType || "",
        proxyType: initialFilters.proxyType || ""
    })
    const { user } = useAuth()
    const { toast } = useToast()

    useEffect(() => {
        fetchTransactions()
    }, [user, filters])

    const handleApplyFilters = (newFilters: TransactionFilterValues) => {
        setIsLoading(true)
        setFilters(newFilters)
    }

    const handleClearFilters = () => {
        setFilters({
            dateRange: "",
            status: "",
            transactionType: "",
            proxyType: ""
        })
        setIsLoading(true)
    }


    const fetchTransactions = async () => {
        if (!user) return

        try {
            setIsLoading(true)

            // Build query based on filters
            let transactionsQuery = query(
                collection(db, "users", user.uid, "transactions"),
                orderBy("createdAt", "desc"),
                limit(50)
            )

            // Apply filters if they exist
            if (filters.transactionType && filters.transactionType !== "all") {
                transactionsQuery = query(
                    transactionsQuery,
                    where("type", "==", filters.transactionType)
                )
            }

            if (filters.status && filters.status !== "all") {
                transactionsQuery = query(
                    transactionsQuery,
                    where("status", "==", filters.status.toLowerCase())
                )
            }

            if (filters.proxyType && filters.proxyType !== "all") {
                transactionsQuery = query(
                    transactionsQuery,
                    where("proxyType", "==", filters.proxyType)
                )
            }

            // Date range filtering would typically be done with timestamps
            // This is a simplified example
            if (filters.dateRange) {
                // ... existing date range code
            }

            const querySnapshot = await getDocs(transactionsQuery)

            const fetchedTransactions: Transaction[] = []

            // Process each transaction and fetch related payment data if needed
            for (const doc of querySnapshot.docs) {
                const data = doc.data() as DocumentData
                const transaction: Transaction = {
                    id: doc.id,
                    type: data.type,
                    amount: data.amount,
                    currency: data.currency || 'USD',
                    status: data.metadata.rawData.status,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    paymentProvider: data.paymentProvider,
                    description: data.description,
                    proxyType: data.proxyType,
                    metadata: data.metadata
                }

                // For purchase transactions, try to get proxy type from payments subcollection
                if (transaction.type === 'purchase' && data.paymentId && !transaction.proxyType) {
                    try {
                        const paymentDoc = await getDocs(query(
                            collection(db, "users", user.uid, "payments"),
                            where("orderId", "==", data.paymentId)
                        ))

                        if (!paymentDoc.empty) {
                            const paymentData = paymentDoc.docs[0].data()
                            if (paymentData.metadata?.planName) {
                                transaction.proxyType = paymentData.metadata.planName
                            } else if (paymentData.metadata?.proxyType) {
                                transaction.proxyType = paymentData.metadata.proxyType
                            }
                        }
                    } catch (err) {
                        console.error("Error fetching payment details:", err)
                    }
                }

                fetchedTransactions.push(transaction)
            }

            setTransactions(fetchedTransactions)
        } catch (error) {
            console.error("Error fetching transactions:", error)
            toast({
                title: "Error",
                description: "Failed to load transaction history. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount)
    }

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'failed':
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Transaction History Table */}
            <div className="lg:col-span-3">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Transaction history</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">
                                            Proxy Type
                                        </th>
                                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">
                                            Transaction Type
                                        </th>
                                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Date</th>
                                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Status</th>
                                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-12">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <div className="animate-spin h-8 w-8 border-2 border-pink-500 rounded-full border-t-transparent"></div>
                                                    <div className="text-foreground font-medium">Loading transactions...</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : transactions.length > 0 ? (
                                        transactions.map((transaction) => (
                                            <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                                                <td className="py-3 px-2">
                                                    <span className="text-foreground">
                                                        {transaction.proxyType || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className="capitalize text-foreground">
                                                        {transaction.type}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className="text-foreground">
                                                        {formatDate(transaction.createdAt)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(transaction.status)}`}>
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className={`font-medium ${transaction.type === 'deposit' ? 'text-green-500' : 'text-foreground'}`}>
                                                        {transaction.type === 'deposit' ? '+' : ''}{formatAmount(transaction.amount, transaction.currency)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-12">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <CreditCard className="w-8 h-8 text-muted-foreground" />
                                                    <div className="text-foreground font-medium">No transactions yet</div>
                                                    <div className="text-muted-foreground text-sm">
                                                        Your transaction history will appear here once you make your first purchase
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="lg:col-span-1">
                <TransactionFilters
                    onApplyFilters={handleApplyFilters}
                    onClearFilters={handleClearFilters}
                    initialFilters={filters}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}