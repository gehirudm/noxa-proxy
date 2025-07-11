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
    Trash2,
} from "lucide-react"

export default function AdminOverview() {
    // Mock data
    const proxies = [
        {
            id: 1,
            ip: "192.168.1.100",
            port: "8080",
            country: "🇺🇸 United States",
            protocol: "HTTP",
            status: "Active",
            tags: ["premium"],
        },
        {
            id: 2,
            ip: "10.0.0.50",
            port: "8081",
            country: "🇬🇧 United Kingdom",
            protocol: "HTTPS",
            status: "Active",
            tags: ["basic", "premium"],
        },
        {
            id: 3,
            ip: "172.16.0.25",
            port: "8082",
            country: "🇩🇪 Germany",
            protocol: "SOCKS5",
            status: "Maintenance",
            tags: ["premium"],
        },
    ]

    return (
        <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-white">Proxy Management</CardTitle>
                        <CardDescription className="text-gray-400">Manage proxy servers and configurations</CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Proxy
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                            <DialogHeader>
                                <DialogTitle className="text-white">Add New Proxy</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Add a new proxy server to the pool
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="ip" className="text-gray-300">
                                            IP Address
                                        </Label>
                                        <Input id="ip" className="bg-slate-700 border-slate-600 text-white" />
                                    </div>
                                    <div>
                                        <Label htmlFor="port" className="text-gray-300">
                                            Port
                                        </Label>
                                        <Input id="port" className="bg-slate-700 border-slate-600 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="country" className="text-gray-300">
                                        Country
                                    </Label>
                                    <Input id="country" className="bg-slate-700 border-slate-600 text-white" />
                                </div>
                                <div>
                                    <Label htmlFor="protocol" className="text-gray-300">
                                        Protocol
                                    </Label>
                                    <select className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                                        <option>HTTP</option>
                                        <option>HTTPS</option>
                                        <option>SOCKS5</option>
                                    </select>
                                </div>
                                <Button className="w-full bg-green-600 hover:bg-green-700">Add Proxy</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-700">
                            <TableHead className="text-gray-300">IP</TableHead>
                            <TableHead className="text-gray-300">Port</TableHead>
                            <TableHead className="text-gray-300">Country</TableHead>
                            <TableHead className="text-gray-300">Protocol</TableHead>
                            <TableHead className="text-gray-300">Status</TableHead>
                            <TableHead className="text-gray-300">Tags</TableHead>
                            <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {proxies.map((proxy) => (
                            <TableRow key={proxy.id} className="border-slate-700">
                                <TableCell className="text-white font-mono">{proxy.ip}</TableCell>
                                <TableCell className="text-white">{proxy.port}</TableCell>
                                <TableCell className="text-white">{proxy.country}</TableCell>
                                <TableCell className="text-white">{proxy.protocol}</TableCell>
                                <TableCell>
                                    {proxy.status === "Active" ? (
                                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                                    ) : (
                                        <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-1">
                                        {proxy.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
                                            <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
                                            <Trash2 className="h-3 w-3" />
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