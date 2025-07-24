"use client"

import { Badge } from "@/components/ui/badge"
import {
  Users,
  Activity,
  Server,
  DollarSign,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminOverview() {
  // Mock data
  const stats = {
    totalUsers: 1247,
    activeProxies: 156,
    dailyBandwidth: "2.4 TB",
    monthlyRevenue: "$45,230",
  }

  return (
    <>
      {/* Overview Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            <p className="text-sm bg-green-500/20 text-green-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Daily Bandwidth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{stats.dailyBandwidth}</p>
            <p className="text-sm text-yellow-400">Peak: 3.2 TB</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{stats.monthlyRevenue}</p>
            <p className="text-sm bg-green-500/20 text-green-400">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Country-based Connections Chart */}
      {/* <Card className="bg-slate-800/50 border-blue-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Country-based Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">🇺🇸 United States</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <span className="text-white text-sm">75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">🇬🇧 United Kingdom</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
                <span className="text-white text-sm">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">🇩🇪 Germany</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                </div>
                <span className="text-white text-sm">30%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </>
  )
}