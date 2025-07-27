"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getUserProxyUsage, getUserSubscriptions } from "@/app/actions/user-actions";
import { ChevronRight, Link } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { PurchaseTrafficDialog } from "./purchase-traffic-dialog";

interface UsageDataPoint {
  timestamp: string;
  download: number;
  upload: number;
}

interface ProxyUsageProps {
  proxyType: 'residential' | 'datacenter' | 'mobile' | 'static_residential' | 'premium-residential';
}

export function ProxyUsage({ proxyType }: ProxyUsageProps) {
  const [activeTimeRange, setActiveTimeRange] = useState("1D");
  const [isLoading, setIsLoading] = useState(true);
  const [usageData, setUsageData] = useState<UsageDataPoint[]>([]);
  const [totalUsage, setTotalUsage] = useState(0);
  const [availableTraffic, setAvailableTraffic] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const timeRanges = ["1D", "7D", "1M"];

  // Map time ranges to API duration parameters
  const timeRangeToDuration: Record<string, string> = {
    "1D": "24h",
    "7D": "7d",
    "1M": "30d"
  };

  // Map time ranges to API granularity parameters
  const timeRangeToGranularity: Record<string, string> = {
    "1D": "hour",
    "7D": "day",
    "1M": "day"
  };

  // Map proxyType to the API's expected type
  const mapProxyType = (type: string): string => {
    const typeMap: Record<string, string> = {
      'premium-residential': 'residential',
      'static_residential': 'residential',
      'datacenter': 'sharedDataCenter'
    };
    return typeMap[type] || type;
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch usage history
        const duration = timeRangeToDuration[activeTimeRange];
        const granularity = timeRangeToGranularity[activeTimeRange];

        const usageResponse = await getUserProxyUsage(duration, granularity);

        if (!usageResponse.success) {
          throw new Error(usageResponse.error || "Failed to fetch usage data");
        }

        // Transform the API response to match our component's expected format
        // The UsageHistory interface shows that data.products is an array of ProductUsage objects
        const apiProductType = mapProxyType(proxyType);

        // Find the product that matches our proxy type
        const productData = usageResponse.data?.products.find(
          (product) => product.name.toLowerCase() === apiProductType.toLowerCase()
        );

        if (!productData) {
          setUsageData([]);
          setTotalUsage(0);
        } else {
          // Convert the stats object to an array of data points
          const mappedData: UsageDataPoint[] = Object.entries(productData.stats).map(([timestamp, value]) => ({
            timestamp,
            // Since the API doesn't differentiate between download and upload,
            // we'll assign the total value to download for visualization purposes
            download: value,
            upload: 0
          }));

          setUsageData(mappedData);

          // Set total usage from the API response
          setTotalUsage(productData.totalBandwidth);
        }

        // Fetch subscription data to get available traffic
        const subscriptionsResponse = await getUserSubscriptions();

        if (subscriptionsResponse.success) {
          const mappedType = mapProxyType(proxyType);
          const subscription = subscriptionsResponse.data?.find(
            (sub: any) => sub.type === mappedType
          );

          if (subscription) {
            setAvailableTraffic(subscription.availableBalance * 1024 * 1024 * 1024); // Convert GB to bytes
          }
        }
      } catch (err) {
        console.error("Error fetching proxy usage:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [proxyType, activeTimeRange]);

  // Format bytes to readable format
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0.00 GB";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format data for the chart
  const chartData = usageData.map(item => ({
    timestamp: item.timestamp,
    download: item.download || 0,
    upload: item.upload || 0,
    total: (item.download || 0) + (item.upload || 0)
  }));

  // Generate time labels based on the active time range
  const getTimeLabels = () => {
    if (activeTimeRange === "1D") {
      return ["11:00", "15:00", "19:00", "23:00", "03:00", "07:00", "11:00"];
    } else if (activeTimeRange === "7D") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    } else {
      return ["Week 1", "Week 2", "Week 3", "Week 4"];
    }
  };

  const timeLabels = getTimeLabels();

  // Handle purchase traffic button click
  const handlePurchaseTraffic = () => {
    setIsPurchaseDialogOpen(true);
  };

  // Get a display name for the proxy type
  const getProxyDisplayName = () => {
    const displayNames: Record<string, string> = {
      'residential': 'Residential Proxy',
      'datacenter': 'Datacenter Proxy',
      'mobile': 'Mobile Proxy',
      'static_residential': 'Static Residential Proxy',
      'premium-residential': 'Premium Residential Proxy'
    };
    return displayNames[proxyType] || 'Proxy';
  };

  return (
    <div className="space-y-4">
      {/* Traffic Left Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-sm font-medium">Traffic left</CardTitle>
          <div className="text-3xl font-bold text-foreground">
            {isLoading ? (
              <div className="h-8 w-24 bg-muted/50 animate-pulse rounded"></div>
            ) : (
              formatBytes(availableTraffic)
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <div className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80">
            <span className="text-foreground">Auto Topup</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div> */}
          <Button 
            className="w-full bg-muted hover:bg-muted/80 text-foreground" 
            variant="secondary"
            onClick={handlePurchaseTraffic}
          >
            Purchase Traffic
          </Button>
          
          {/* Purchase Traffic Dialog */}
          <PurchaseTrafficDialog
            open={isPurchaseDialogOpen}
            onOpenChange={setIsPurchaseDialogOpen}
            proxyType={proxyType}
            proxyDisplayName={getProxyDisplayName()}
          />
        </CardContent>
      </Card>

      {/* Traffic Usage Card */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground text-sm font-medium">Traffic usage</CardTitle>
            <div className="text-3xl font-bold text-foreground mt-2">
              {isLoading ? (
                <div className="h-8 w-24 bg-muted/50 animate-pulse rounded"></div>
              ) : (
                formatBytes(totalUsage)
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={activeTimeRange === range ? "secondary" : "ghost"}
                size="sm"
                className={
                  activeTimeRange === range
                    ? "bg-pink-600 text-white hover:bg-pink-700"
                    : "text-muted-foreground hover:text-foreground"
                }
                onClick={() => setActiveTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-32 bg-muted/50 animate-pulse rounded"></div>
          ) : error ? (
            <div className="h-32 bg-muted rounded flex items-center justify-center">
              <div className="text-red-500 text-sm">{error}</div>
            </div>
          ) : chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timestamp" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                                        contentStyle={{
                      backgroundColor: '#1f2937',
                      borderColor: '#374151',
                      color: '#f9fafb'
                    }}
                    labelStyle={{ color: '#f9fafb' }}
                    formatter={(value) => [`${formatBytes(value as number)}`, undefined]}
                  />
                  <Area
                    type="monotone"
                    dataKey="download"
                    name="Download"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorDownload)"
                  />
                  <Area
                    type="monotone"
                    dataKey="upload"
                    name="Upload"
                    stroke="#ec4899"
                    fillOpacity={1}
                    fill="url(#colorUpload)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-32 bg-muted rounded flex items-center justify-center">
              <div className="text-muted-foreground text-sm">No usage data available</div>
            </div>
          )}

          {!isLoading && !error && chartData.length === 0 && (
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              {timeLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}