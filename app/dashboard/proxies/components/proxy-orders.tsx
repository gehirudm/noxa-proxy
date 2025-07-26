import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, MoreHorizontal, RefreshCw } from "lucide-react"
import { collection, query, where, orderBy, getDocs, limit, DocumentData, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

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
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      
      setLoading(true);
      try {
        // Build query to fetch purchase transactions
        let transactionsQuery = query(
          collection(db, "users", user.uid, "transactions"),
          where("type", "==", "purchase"),
          orderBy("createdAt", "desc"),
          limit(20) // Fetch more to filter by proxy type
        );

        const querySnapshot = await getDocs(transactionsQuery);
        
        if (querySnapshot.empty) {
          setOrders([]);
          setError("No orders found");
        } else {
          // Process the fetched transactions
          const fetchedOrders: Order[] = [];
          
          for (const transactionDoc of querySnapshot.docs) {
            const transactionData = transactionDoc.data() as DocumentData;
            const paymentId = transactionData.paymentId;
            
            if (!paymentId) continue;
            
            // Get the corresponding payment document to check proxy type
            const paymentDocRef = doc(db, "users", user.uid, "payments", paymentId);
            const paymentDoc = await getDoc(paymentDocRef);
            
            if (!paymentDoc.exists()) continue;
            
            const paymentData = paymentDoc.data();
            
            // Format the date
            const createdAt = transactionData.createdAt?.toDate() || new Date();
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(createdAt);
            
            // Format the amount
            const formattedAmount = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: transactionData.currency || 'USD'
            }).format(transactionData.amount);
            
            // Determine the status based on payment data
            let status: "active" | "expired" | "pending";
            if (paymentData.status === "completed") {
              // Check if the subscription is still active based on createdAt + plan duration
              const now = new Date();
              const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
              
              // If it's a recurring subscription, check if it's still active
              if (paymentData.metadata?.isRecurring) {
                status = paymentData.metadata?.isActive !== false ? "active" : "expired";
              } else {
                // For one-time purchases, check if it's within the 30-day period
                status = (now.getTime() - createdAt.getTime() < thirtyDaysInMs) ? "active" : "expired";
              }
            } else if (paymentData.status === "pending") {
              status = "pending";
            } else {
              status = "expired";
            }
            
            // Calculate renewal date if active
            let renewalDate;
            if (status === "active") {
              if (paymentData.metadata?.nextRenewalAt) {
                // Use the next renewal date if available (for subscriptions)
                const nextRenewalDate = new Date(paymentData.metadata.nextRenewalAt);
                renewalDate = new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).format(nextRenewalDate);
              } else {
                // Calculate based on purchase date for one-time purchases
                const renewalDateObj = new Date(createdAt);
                renewalDateObj.setDate(renewalDateObj.getDate() + 30); // Assuming 30-day plans
                renewalDate = new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).format(renewalDateObj);
              }
            }
            
            // Get plan tier from payment metadata
            const planTier = paymentData.metadata?.tier || 'Standard';
            
            // Create the order object
            const order: Order = {
              id: paymentId,
              date: formattedDate,
              product: `${proxyType.charAt(0).toUpperCase() + proxyType.slice(1)} Proxy - ${planTier.charAt(0).toUpperCase() + planTier.slice(1)}`,
              amount: formattedAmount,
              status: status,
              renewalDate: renewalDate
            };
            
            fetchedOrders.push(order);
          }
          
          setOrders(fetchedOrders);
          if (fetchedOrders.length === 0) {
            setError("No orders found for this proxy type");
          } else {
            setError(null);
          }
        }
      } catch (err) {
        setError("Failed to fetch orders");
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load order history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [proxyType, user]);

  const refreshOrders = () => {
    setLoading(true);
    // Fetch orders again
    async function refetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Build query to fetch purchase transactions
        let transactionsQuery = query(
          collection(db, "users", user.uid, "transactions"),
          where("type", "==", "purchase"),
          orderBy("createdAt", "desc"),
          limit(20) // Fetch more to filter by proxy type
        );

        const querySnapshot = await getDocs(transactionsQuery);
        
        if (querySnapshot.empty) {
          setOrders([]);
          setError("No orders found");
        } else {
          // Process the fetched transactions
          const fetchedOrders: Order[] = [];
          
          for (const transactionDoc of querySnapshot.docs) {
            const transactionData = transactionDoc.data() as DocumentData;
            const paymentId = transactionData.paymentId;
            
            if (!paymentId) continue;
            
            // Get the corresponding payment document to check proxy type
            const paymentDocRef = doc(db, "users", user.uid, "payments", paymentId);
            const paymentDoc = await getDoc(paymentDocRef);
            
            if (!paymentDoc.exists()) continue;
            
            const paymentData = paymentDoc.data();
            
            // Check if this payment is for the requested proxy type
            if (paymentData.type !== "proxy_purchase" || 
                paymentData.metadata?.proxyType !== proxyType) {
              continue;
            }
            
            // Format the date
            const createdAt = transactionData.createdAt?.toDate() || new Date();
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(createdAt);
            
            // Format the amount
            const formattedAmount = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: transactionData.currency || 'USD'
            }).format(transactionData.amount);
            
            // Determine the status based on payment data
            let status: "active" | "expired" | "pending";
            if (paymentData.status === "completed") {
              // Check if the subscription is still active based on createdAt + plan duration
              const now = new Date();
              const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
              
              // If it's a recurring subscription, check if it's still active
              if (paymentData.metadata?.isRecurring) {
                status = paymentData.metadata?.isActive !== false ? "active" : "expired";
              } else {
                // For one-time purchases, check if it's within the 30-day period
                status = (now.getTime() - createdAt.getTime() < thirtyDaysInMs) ? "active" : "expired";
              }
            } else if (paymentData.status === "pending") {
              status = "pending";
            } else {
              status = "expired";
            }
            
            // Calculate renewal date if active
            let renewalDate;
            if (status === "active") {
              if (paymentData.metadata?.nextRenewalAt) {
                // Use the next renewal date if available (for subscriptions)
                const nextRenewalDate = new Date(paymentData.metadata.nextRenewalAt);
                renewalDate = new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).format(nextRenewalDate);
              } else {
                // Calculate based on purchase date for one-time purchases
                const renewalDateObj = new Date(createdAt);
                renewalDateObj.setDate(renewalDateObj.getDate() + 30); // Assuming 30-day plans
                renewalDate = new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).format(renewalDateObj);
              }
            }
            
            // Get plan tier from payment metadata
            const planTier = paymentData.metadata?.tier || 'Standard';
            
            // Create the order object
            const order: Order = {
              id: paymentId,
              date: formattedDate,
              product: `${proxyType.charAt(0).toUpperCase() + proxyType.slice(1)} Proxy - ${planTier.charAt(0).toUpperCase() + planTier.slice(1)}`,
              amount: formattedAmount,
              status: status,
              renewalDate: renewalDate
            };
            
            fetchedOrders.push(order);
          }
          
                    setOrders(fetchedOrders);
          if (fetchedOrders.length === 0) {
            setError("No orders found for this proxy type");
          } else {
            setError(null);
          }
        }
      } catch (err) {
        setError("Failed to refresh orders");
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to refresh order history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    refetchOrders();
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