"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminPayments() {
    const payments = [
        {
            id: 1,
            user: "john_doe",
            amount: "$29.99",
            plan: "Premium",
            date: "2024-01-20",
            status: "Completed",
        },
        {
            id: 2,
            user: "jane_smith",
            amount: "$9.99",
            plan: "Basic",
            date: "2024-01-19",
            status: "Completed",
        },
        {
            id: 3,
            user: "alex_brown",
            amount: "$99.99",
            plan: "Enterprise",
            date: "2024-01-18",
            status: "Pending",
        },
    ]

    return (
        <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-white">Payment Management</CardTitle>
                <CardDescription className="text-gray-400">Monitor payments and handle refunds</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-700">
                            <TableHead className="text-gray-300">User</TableHead>
                            <TableHead className="text-gray-300">Amount</TableHead>
                            <TableHead className="text-gray-300">Plan</TableHead>
                            <TableHead className="text-gray-300">Date</TableHead>
                            <TableHead className="text-gray-300">Status</TableHead>
                            <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id} className="border-slate-700">
                                <TableCell className="text-white">{payment.user}</TableCell>
                                <TableCell className="text-white">{payment.amount}</TableCell>
                                <TableCell className="text-white">{payment.plan}</TableCell>
                                <TableCell className="text-white">{payment.date}</TableCell>
                                <TableCell>
                                    {payment.status === "Completed" ? (
                                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                                    ) : (
                                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
                                        Refund
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}