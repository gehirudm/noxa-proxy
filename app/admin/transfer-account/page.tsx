"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { transferUserData } from "@/app/actions/transfer-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react"

export default function TransferAccountPage() {
    const [sourceUid, setSourceUid] = useState("")
    const [targetUid, setTargetUid] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!sourceUid || !targetUid) {
            setResult({
                success: false,
                message: "Both source and target user IDs are required"
            })
            return
        }

        if (sourceUid === targetUid) {
            setResult({
                success: false,
                message: "Source and target user IDs cannot be the same"
            })
            return
        }

        try {
            setLoading(true)
            setResult(null)

            const transferResult = await transferUserData(sourceUid, targetUid)
            setResult(transferResult)
        } catch (error: any) {
            setResult({
                success: false,
                message: error.message || "An unexpected error occurred"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Transfer User Account Data</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    This tool allows administrators to transfer all data from one user account to another.
                    Use with caution as this operation cannot be undone.
                </p>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Transfer</CardTitle>
                        <CardDescription>
                            Transfer all data including subcollections from source to target user
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleTransfer} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sourceUid">Source User ID</Label>
                                    <Input
                                        id="sourceUid"
                                        value={sourceUid}
                                        onChange={(e) => setSourceUid(e.target.value)}
                                        placeholder="Enter source user ID"
                                        required
                                        disabled={loading}
                                    />
                                    <p className="text-sm text-gray-500">The user ID to transfer data from</p>
                                </div>

                                <div className="flex justify-center my-2">
                                    <ArrowRight className="text-gray-400" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="targetUid">Target User ID</Label>
                                    <Input
                                        id="targetUid"
                                        value={targetUid}
                                        onChange={(e) => setTargetUid(e.target.value)}
                                        placeholder="Enter target user ID"
                                        required
                                        disabled={loading}
                                    />
                                    <p className="text-sm text-gray-500">The user ID to transfer data to</p>
                                </div>
                            </div>

                            {result && (
                                <Alert variant={result.success ? "default" : "destructive"}>
                                    {result.success ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4" />
                                    )}
                                    <AlertTitle>
                                        {result.success ? "Success" : "Error"}
                                    </AlertTitle>
                                    <AlertDescription>
                                        {result.message}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={loading || !sourceUid || !targetUid}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {loading ? "Processing..." : "Transfer Account Data"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col items-start border-t pt-6">
                        <h3 className="font-medium mb-2">Important Notes:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-500">
                            <li>This operation will merge all data from the source user to the target user.</li>
                            <li>Existing data in the target account will not be overwritten if there are conflicts.</li>
                            <li>This process does not delete the source user account.</li>
                            <li>Consider deactivating the source account after successful transfer.</li>
                        </ul>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}