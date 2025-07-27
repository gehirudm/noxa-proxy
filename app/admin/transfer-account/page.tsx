"use client"

import { useState } from "react"
import { exportUser, importUser } from "@/app/actions/transfer-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Download, Upload } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function TransferAccountPage() {
    const [sourceUid, setSourceUid] = useState("")
    const [targetUid, setTargetUid] = useState("")
    const [loading, setLoading] = useState(false)
    const [exportResult, setExportResult] = useState<string | null>(null)
    const [importResult, setImportResult] = useState<string | null>(null)
    const [exportedJson, setExportedJson] = useState<string>("")
    const [importJson, setImportJson] = useState<string>("")
    const [copied, setCopied] = useState(false)

    const handleExport = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!sourceUid.trim()) {
            setExportResult("Please enter a user ID")
            return
        }

        try {
            setLoading(true)
            setExportResult(null)
            const jsonData = await exportUser(sourceUid)
            setExportedJson(jsonData)
            setExportResult("Export successful")
        } catch (error: any) {
            setExportResult(`Error: ${error.message || "Failed to export user data"}`)
        } finally {
            setLoading(false)
        }
    }

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!importJson.trim()) {
            setImportResult("Please paste JSON data to import")
            return
        }

        if (!targetUid.trim()) {
            setImportResult("Please enter a target user ID")
            return
        }

        try {
            setLoading(true)
            setImportResult(null)
            
            // Parse the JSON to modify the target ID
            let dataToImport;
            try {
                const parsedData = JSON.parse(importJson);
                dataToImport = {
                    ...parsedData,
                    id: targetUid
                };
            } catch (parseError) {
                throw new Error("Invalid JSON format");
            }
            
            const response = await importUser(JSON.stringify(dataToImport));
            const parsedResponse = JSON.parse(response);
            
            if (parsedResponse.success) {
                setImportResult("Import successful");
            } else {
                throw new Error(parsedResponse.message || "Import failed");
            }
        } catch (error: any) {
            setImportResult(`Error: ${error.message || "Failed to import user data"}`);
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = () => {
        if (exportedJson) {
            navigator.clipboard.writeText(exportedJson);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Transfer User Account Data</h1>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Account Transfer Tool</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                        <Tabs defaultValue="export">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="export">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Data
                                </TabsTrigger>
                                <TabsTrigger value="import">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Import Data
                                </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="export">
                                <form onSubmit={handleExport} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sourceUid">User ID to Export</Label>
                                        <Input
                                            id="sourceUid"
                                            value={sourceUid}
                                            onChange={(e) => setSourceUid(e.target.value)}
                                            placeholder="Enter user ID"
                                            disabled={loading}
                                        />
                                    </div>
                                    
                                    <Button
                                        type="submit"
                                        disabled={loading || !sourceUid.trim()}
                                        className="w-full"
                                    >
                                        {loading ? "Exporting..." : "Export User Data"}
                                    </Button>
                                    
                                    {exportResult && (
                                        <Alert className={exportResult.startsWith("Error") ? "bg-red-500/10" : "bg-green-500/10"}>
                                            <AlertDescription>{exportResult}</AlertDescription>
                                        </Alert>
                                    )}
                                    
                                    {exportedJson && (
                                        <div className="space-y-2 mt-4">
                                            <div className="flex items-center justify-between">
                                                <Label>Exported JSON Data</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={copyToClipboard}
                                                    className="h-8"
                                                >
                                                    <Copy className="h-3.5 w-3.5 mr-1" />
                                                    {copied ? "Copied!" : "Copy"}
                                                </Button>
                                            </div>
                                            <Textarea
                                                value={exportedJson}
                                                readOnly
                                                className="font-mono text-xs h-60"
                                            />
                                        </div>
                                    )}
                                </form>
                            </TabsContent>
                            
                            <TabsContent value="import">
                                <form onSubmit={handleImport} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="importJson">JSON Data to Import</Label>
                                        <Textarea
                                            id="importJson"
                                            value={importJson}
                                            onChange={(e) => setImportJson(e.target.value)}
                                            placeholder="Paste exported JSON data here"
                                            className="font-mono text-xs h-60"
                                            disabled={loading}
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="targetUid">Target User ID</Label>
                                        <Input
                                            id="targetUid"
                                            value={targetUid}
                                            onChange={(e) => setTargetUid(e.target.value)}
                                            placeholder="Enter target user ID"
                                            disabled={loading}
                                        />
                                    </div>
                                    
                                    <Button
                                        type="submit"
                                        disabled={loading || !importJson.trim() || !targetUid.trim()}
                                        className="w-full"
                                    >
                                        {loading ? "Importing..." : "Import User Data"}
                                    </Button>
                                    
                                    {importResult && (
                                        <Alert className={importResult.startsWith("Error") ? "bg-red-500/10" : "bg-green-500/10"}>
                                            <AlertDescription>{importResult}</AlertDescription>
                                        </Alert>
                                    )}
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}