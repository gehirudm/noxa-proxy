"use client"

import { useState, useEffect } from "react"
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
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
} from "lucide-react"
import { getUsers } from "@/app/actions/admin-actions"
import { User, UsersResponse } from "@/app/actions/admin-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminPanel() {
  // State for users data
  const [usersData, setUsersData] = useState<UsersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for pagination, filtering, and search
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Fetch users on component mount and when filters change
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        const response = await getUsers({
          page: currentPage,
          limit: 10,
          sortBy,
          sortOrder,
          searchQuery,
          filterRole,
          filterStatus
        })

        if (response.success && response.data) {
          setUsersData(response.data)
          setError(null)
        } else {
          setError(response.error || "Failed to fetch users")
          setUsersData(null)
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentPage, sortBy, sortOrder, filterRole, filterStatus])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1) // Reset to first page on new search
      fetchUsers()
    }, 500)

    return () => clearTimeout(timer)

    async function fetchUsers() {
      setLoading(true)
      try {
        const response = await getUsers({
          page: 1,
          limit: 10,
          sortBy,
          sortOrder,
          searchQuery,
          filterRole,
          filterStatus
        })

        if (response.success && response.data) {
          setUsersData(response.data)
          setError(null)
        } else {
          setError(response.error || "Failed to fetch users")
          setUsersData(null)
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }, [searchQuery])

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && (!usersData || newPage <= usersData.totalPages)) {
      setCurrentPage(newPage)
    }
  }

  // Format date string
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return "Invalid date"
    }
  }

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
        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              className="pl-10 bg-slate-700 border-slate-600 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-white p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* Users table */}
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Joined</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData && usersData.users.length > 0 ? (
                  usersData.users.map((user) => (
                    <TableRow key={user.uid} className="border-slate-700">
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.username}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-bold">
                                {user.username.substring(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-xs text-gray-400">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={user.role === "admin" ?
                          "bg-purple-100 text-purple-800" :
                          "bg-blue-100 text-blue-800"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.status === "active" ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : user.status === "suspended" ? (
                          <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Banned</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-white">{formatDate(user.createdAt)}</TableCell>
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
                  ))
                ) : (
                  <TableRow className="border-slate-700">
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      {searchQuery || filterRole || filterStatus ?
                        "No users match your search criteria" :
                        "No users found in the system"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination controls */}
            {usersData && usersData.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, usersData.totalUsers)} of {usersData.totalUsers} users
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-slate-600 hover:bg-slate-700 text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Page number display */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, usersData.totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageToShow: number;
                      if (usersData.totalPages <= 5) {
                        pageToShow = i + 1;
                      } else if (currentPage <= 3) {
                        pageToShow = i + 1;
                      } else if (currentPage >= usersData.totalPages - 2) {
                        pageToShow = usersData.totalPages - 4 + i;
                      } else {
                        pageToShow = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageToShow}
                          variant={currentPage === pageToShow ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageToShow)}
                          className={currentPage === pageToShow
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "border-slate-600 hover:bg-slate-700 text-white"}
                        >
                          {pageToShow}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === usersData.totalPages}
                    className="border-slate-600 hover:bg-slate-700 text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}