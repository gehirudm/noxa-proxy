import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, MoreHorizontal, RefreshCw } from "lucide-react"

interface Order {
  id: string;
  date: string;
  product: string;
  amount: string;
  status: "active" | "expired" | "pending";
  renewalDate?: string;
}

interface ProxyOrdersProps {
  proxyType?: string;
}

export function ProxyOrders({ proxyType = "residential" }: ProxyOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        // This would be an API call in a real application
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data based on proxy type
        const mockOrders: Order[] = [
          {
            id: "ORD-12345",
            date: "2023-10-15",
            product: `${proxyType.charAt(0).toUpperCase() + proxyType.slice(1)} Proxy - Pro`,
            amount: "$49.99",
            status: "active",
            renewalDate: "2023-11-15"
          },
          {
            id: "ORD-12346",
            date: "2023-09-01",
            product: `${proxyType.charAt(0).toUpperCase() + proxyType.slice(1)} Proxy - Basic`,
            amount: "$29.99",
            status: "expired"
          }
        ];
        
        setOrders(mockOrders);
        setError(null);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [proxyType]);

  const refreshOrders = () => {
    setLoading(true);
    // This would be an API call in a real application
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Package className="w-5 h-5 mr-2" />
          <CardTitle className="text-foreground">Orders</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshOrders}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">ID</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Date</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Product</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Amount</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">Status</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-red-500">{error}</td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-2 text-foreground">{order.id}</td>
                    <td className="py-3 px-2 text-foreground">{order.date}</td>
                    <td className="py-3 px-2 text-foreground">{order.product}</td>
                    <td className="py-3 px-2 text-foreground">{order.amount}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-foreground font-medium">No orders yet</div>
                      <div className="text-muted-foreground text-sm">
                        Your order history will appear here once you make your first purchase
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
  )
}