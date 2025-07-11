"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Edit,
  Ban,
} from "lucide-react"

export default function AdminPanel() {
  const users = [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      plan: "Premium",
      status: "Active",
      balance: "45.2 GB",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      username: "jane_smith",
      email: "jane@example.com",
      plan: "Basic",
      status: "Active",
      balance: "12.8 GB",
      joinDate: "2024-01-10",
    },
    {
      id: 3,
      username: "mike_wilson",
      email: "mike@example.com",
      plan: "Enterprise",
      status: "Banned",
      balance: "0 GB",
      joinDate: "2023-12-20",
    },
  ]

  return (
    <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">User Management</CardTitle>
            <CardDescription className="text-gray-400">Manage user accounts and subscriptions</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New User</DialogTitle>
                <DialogDescription className="text-gray-400">Create a new user account</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-gray-300">
                    Username
                  </Label>
                  <Input id="username" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input id="email" type="email" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="plan" className="text-gray-300">
                    Plan
                  </Label>
                  <select className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                    <option>Basic</option>
                    <option>Premium</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Create User</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Plan</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Balance</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-slate-700">
                <TableCell className="text-white">{user.username}</TableCell>
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-800">{user.plan}</Badge>
                </TableCell>
                <TableCell>
                  {user.status === "Active" ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Banned</Badge>
                  )}
                </TableCell>
                <TableCell className="text-white">{user.balance}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
                      <Ban className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
