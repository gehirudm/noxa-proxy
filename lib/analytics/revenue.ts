import { db } from "@/lib/firebase/firebase-admin";
import { Payment, PaymentStatus } from "@/lib/db/payments";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Revenue data structure by month
 */
export interface MonthlyRevenue {
  month: string; // Format: YYYY-MM
  totalRevenue: number;
  completedPayments: number;
  failedPayments: number;
  pendingPayments: number;
  byType: {
    proxy_purchase: number;
    wallet_deposit: number;
  };
  byProvider: Record<string, number>; // e.g., { "stripe": 1000, "cryptomus": 500 }
}

/**
 * Revenue data structure for a specific time range
 */
export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: MonthlyRevenue[];
  startDate: string;
  endDate: string;
}

/**
 * Options for calculating revenue
 */
export interface RevenueCalculationOptions {
  startDate?: Date;
  endDate?: Date;
  includeStatus?: PaymentStatus[];
  excludeTypes?: string[];
}

/**
 * Calculates monthly revenue from all payments in the system
 */
export async function calculateMonthlyRevenue(
  options: RevenueCalculationOptions = {}
): Promise<RevenueAnalytics> {
  const {
    startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1), // Default to last 12 months
    endDate = new Date(),
    includeStatus = ['completed'], // Default to only completed payments
    excludeTypes = []
  } = options;

  // Convert dates to Firestore timestamps
  const startTimestamp = Timestamp.fromDate(startDate);
  const endTimestamp = Timestamp.fromDate(endDate);

  try {
    // Query all payments across all users within the date range
    const paymentsRef = db.collectionGroup('payments')
      .where('createdAt', '>=', startTimestamp)
      .where('createdAt', '<=', endTimestamp);
    
    const paymentsSnapshot = await paymentsRef.get();
    const payments = paymentsSnapshot.docs.map(doc => doc.data() as Payment);

    // Initialize result object
    const result: RevenueAnalytics = {
      totalRevenue: 0,
      monthlyRevenue: [],
      startDate: startDate.toISOString().substring(0, 10),
      endDate: endDate.toISOString().substring(0, 10)
    };

    // Create a map to store monthly data
    const monthlyData: Record<string, MonthlyRevenue> = {};

    // Process each payment
    payments.forEach(payment => {
      // Skip payments with excluded types
      if (excludeTypes.includes(payment.type)) {
        return;
      }

      // Get payment date
      const paymentDate = payment.completedAt?.toDate() || payment.createdAt.toDate();
      const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;

      // Initialize month data if it doesn't exist
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          totalRevenue: 0,
          completedPayments: 0,
          failedPayments: 0,
          pendingPayments: 0,
          byType: {
            proxy_purchase: 0,
            wallet_deposit: 0
          },
          byProvider: {}
        };
      }

      // Update counts based on payment status
      if (payment.status === 'completed') {
        monthlyData[monthKey].completedPayments++;
        
        // Only add to revenue if status is included
        if (includeStatus.includes(payment.status)) {
          // Add to total revenue
          monthlyData[monthKey].totalRevenue += payment.amount;
          
          // Add to type-specific revenue
          monthlyData[monthKey].byType[payment.type] += payment.amount;
          
          // Add to provider-specific revenue
          if (!monthlyData[monthKey].byProvider[payment.provider]) {
            monthlyData[monthKey].byProvider[payment.provider] = 0;
          }
          monthlyData[monthKey].byProvider[payment.provider] += payment.amount;
          
          // Add to overall total
          result.totalRevenue += payment.amount;
        }
      } else if (payment.status === 'failed') {
        monthlyData[monthKey].failedPayments++;
      } else if (payment.status === 'pending') {
        monthlyData[monthKey].pendingPayments++;
      }
    });

    // Convert the map to an array and sort by month
    result.monthlyRevenue = Object.values(monthlyData).sort((a, b) => 
      a.month.localeCompare(b.month)
    );

    return result;
  } catch (error) {
    console.error("Error calculating monthly revenue:", error);
    throw new Error("Failed to calculate monthly revenue");
  }
}

/**
 * Gets revenue data for the current month
 */
export async function getCurrentMonthRevenue(): Promise<MonthlyRevenue> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  const result = await calculateMonthlyRevenue({
    startDate: startOfMonth,
    endDate: endOfMonth
  });
  
  // Return the current month's data or a default empty object
  return result.monthlyRevenue[0] || {
    month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    totalRevenue: 0,
    completedPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    byType: {
      proxy_purchase: 0,
      wallet_deposit: 0
    },
    byProvider: {}
  };
}

/**
 * Gets revenue comparison between current month and previous month
 */
export async function getMonthlyRevenueComparison(): Promise<{
  currentMonth: MonthlyRevenue;
  previousMonth: MonthlyRevenue;
  percentageChange: number;
}> {
  const now = new Date();
  
  // Current month range
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  // Previous month range
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  
  // Get revenue data for both months
  const currentMonthData = await calculateMonthlyRevenue({
    startDate: startOfCurrentMonth,
    endDate: endOfCurrentMonth
  });
  
  const previousMonthData = await calculateMonthlyRevenue({
    startDate: startOfPreviousMonth,
    endDate: endOfPreviousMonth
  });
  
  // Extract the monthly revenue objects
  const currentMonth = currentMonthData.monthlyRevenue[0] || {
    month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    totalRevenue: 0,
    completedPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    byType: { proxy_purchase: 0, wallet_deposit: 0 },
    byProvider: {}
  };
  
  const previousMonth = previousMonthData.monthlyRevenue[0] || {
    month: `${startOfPreviousMonth.getFullYear()}-${String(startOfPreviousMonth.getMonth() + 1).padStart(2, '0')}`,
    totalRevenue: 0,
    completedPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    byType: { proxy_purchase: 0, wallet_deposit: 0 },
    byProvider: {}
  };
  
  // Calculate percentage change
  const percentageChange = previousMonth.totalRevenue === 0 
    ? (currentMonth.totalRevenue > 0 ? 100 : 0)
    : ((currentMonth.totalRevenue - previousMonth.totalRevenue) / previousMonth.totalRevenue) * 100;
  
  return {
    currentMonth,
    previousMonth,
    percentageChange
  };
}

/**
 * Gets annual revenue summary
 */
export async function getAnnualRevenueSummary(year: number = new Date().getFullYear()): Promise<{
  year: number;
  totalRevenue: number;
  monthlyBreakdown: MonthlyRevenue[];
}> {
  const startDate = new Date(year, 0, 1); // January 1st
  const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st
  
  const result = await calculateMonthlyRevenue({
    startDate,
    endDate
  });
  
  return {
    year,
    totalRevenue: result.totalRevenue,
    monthlyBreakdown: result.monthlyRevenue
  };
}

/**
 * Gets revenue by payment provider
 */
export async function getRevenueByProvider(
  startDate: Date = new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1),
  endDate: Date = new Date()
): Promise<Record<string, number>> {
  const result = await calculateMonthlyRevenue({
    startDate,
    endDate
  });
  
  // Aggregate provider revenue across all months
  const providerRevenue: Record<string, number> = {};
  
  result.monthlyRevenue.forEach(month => {
    Object.entries(month.byProvider).forEach(([provider, amount]) => {
      if (!providerRevenue[provider]) {
        providerRevenue[provider] = 0;
      }
      providerRevenue[provider] += amount;
    });
  });
  
  return providerRevenue;
}

/**
 * Gets revenue by payment type
 */
export async function getRevenueByType(
  startDate: Date = new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1),
  endDate: Date = new Date()
): Promise<Record<string, number>> {
  const result = await calculateMonthlyRevenue({
    startDate,
    endDate
  });
  
  // Aggregate type revenue across all months
  const typeRevenue: Record<string, number> = {
    proxy_purchase: 0,
    wallet_deposit: 0
  };
  
  result.monthlyRevenue.forEach(month => {
    typeRevenue.proxy_purchase += month.byType.proxy_purchase;
    typeRevenue.wallet_deposit += month.byType.wallet_deposit;
  });
  
  return typeRevenue;
}