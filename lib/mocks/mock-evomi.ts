import { BaseEvomiAPI } from "../evomi-api"

const EVOMI_API_BASE = "https://reseller.evomi.com/v2"
const API_KEY = process.env.EVOMI_API_KEY

export interface ProductBalance {
  balance: number
  proxy_key: string
}

export interface ProductWithExpiry {
  proxy_key: string
  threadCap: number
  expiresAt: string
  expiresInHours: number
  balance: number
}

export interface SubUser {
  username: string
  email: string
  created_at: string
  updated_at: string
  products: {
    residential?: ProductBalance
    sharedDataCenter?: ProductBalance
    dataCenterIPV6?: ProductWithExpiry
    mobile?: ProductBalance
    dataCenter?: ProductWithExpiry
    residentialIPV6?: ProductWithExpiry
  }
}

export interface UsageStats {
  [timestamp: string]: number
}

export interface ProductUsage {
  name: string
  totalBandwidth: number
  stats: UsageStats
}

export interface UsageHistory {
  products: ProductUsage[]
}

export interface ProxySettingsData {
  residential: ProxySettingCategory
  residentialIPV6: ProxySettingCategory
  mobile: ProxySettingCategory
  dataCenter: ProxySettingCategory
  dataCenterIPV6: ProxySettingCategory
  sharedDataCenter: ProxySettingCategory
}

export interface ProxySettingCategory {
  countries: Record<string, string>      // ISO code → Country name
  regions: { data: { id: string; name: string }[] }
  cities: { data: { id: string; name: string; country_code: string }[] }
  isp: Record<string, { value: string; countryCode: string }>
  continents: unknown | null
}

export interface ApiResponse<T> {
  data: T
  message: string
  status: number
  timestamp: number
}

/**
 * Mock implementation of EvomiAPI that returns dummy data
 */
export class MockEvomiAPI extends BaseEvomiAPI {
  private generateRandomProxyKey(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateTimestamps(count: number, interval: number = 3600000): Record<string, number> {
    const now = Date.now();
    const stats: Record<string, number> = {};
    
    for (let i = 0; i < count; i++) {
      const timestamp = new Date(now - (i * interval)).toISOString();
      stats[timestamp] = Math.floor(Math.random() * 500) + 10; // Random MB between 10 and 510
    }
    
    return stats;
  }

  private createMockSubUser(username: string, email: string): SubUser {
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
    
    return {
      username,
      email,
      created_at: now,
      updated_at: now,
      products: {
        residential: {
          balance: 5000, // 5 GB
          proxy_key: this.generateRandomProxyKey()
        },
        sharedDataCenter: {
          balance: 10000, // 10 GB
          proxy_key: this.generateRandomProxyKey()
        },
        mobile: {
          balance: 2000, // 2 GB
          proxy_key: this.generateRandomProxyKey()
        },
        dataCenter: {
          proxy_key: this.generateRandomProxyKey(),
          threadCap: 10,
          expiresAt,
          expiresInHours: 720, // 30 days
          balance: 15000 // 15 GB
        },
        dataCenterIPV6: {
          proxy_key: this.generateRandomProxyKey(),
          threadCap: 5,
          expiresAt,
          expiresInHours: 720,
          balance: 8000 // 8 GB
        }
      }
    };
  }

  async createSubUser(username: string, email: string): Promise<SubUser> {
    console.log("[MOCK] Creating subuser:", username, email);
    return this.createMockSubUser(username, email);
  }

  async getSubUsers(): Promise<SubUser[]> {
    console.log("[MOCK] Getting all subusers");
    return [
      this.createMockSubUser("user1", "user1@example.com"),
      this.createMockSubUser("user2", "user2@example.com"),
      this.createMockSubUser("user3", "user3@example.com")
    ];
  }

  async getSubUser(username: string): Promise<SubUser> {
    console.log("[MOCK] Getting subuser:", username);
    return this.createMockSubUser(username, `${username}@example.com`);
  }

  async getUsageHistory(username: string, duration = "24h", granularity = "hour"): Promise<UsageHistory> {
    console.log("[MOCK] Getting usage history for:", username, duration, granularity);
    
    // Determine number of data points based on duration and granularity
    let dataPoints = 24;
    let interval = 3600000; // 1 hour in ms
    
    if (duration === "7d") {
      dataPoints = granularity === "day" ? 7 : 7 * 24;
    } else if (duration === "30d") {
      dataPoints = granularity === "day" ? 30 : 30 * 24;
    }
    
    if (granularity === "day") {
      interval = 86400000; // 1 day in ms
    }
    
    return {
      products: [
        {
          name: "residential",
          totalBandwidth: 5000,
          stats: this.generateTimestamps(dataPoints, interval)
        },
        {
          name: "sharedDataCenter",
          totalBandwidth: 10000,
          stats: this.generateTimestamps(dataPoints, interval)
        },
        {
          name: "mobile",
          totalBandwidth: 2000,
          stats: this.generateTimestamps(dataPoints, interval)
        }
      ]
    };
  }

  async giveBalance(
    username: string,
    product: 'residential' | 'sharedDataCenter' | 'mobile',
    mbAmount: number,
  ): Promise<SubUser> {
    console.log(`[MOCK] Adding ${mbAmount}MB to ${username}'s ${product} balance`);
    const user = await this.getSubUser(username);
    
    if (user.products[product]) {
      user.products[product]!.balance += mbAmount;
    } else {
      user.products[product] = {
        balance: mbAmount,
        proxy_key: this.generateRandomProxyKey()
      };
    }
    
    return user;
  }

  async takeBalance(
    username: string,
    product: 'residential' | 'sharedDataCenter' | 'mobile',
    mbAmount: number,
  ): Promise<SubUser> {
    console.log(`[MOCK] Removing ${mbAmount}MB from ${username}'s ${product} balance`);
    const user = await this.getSubUser(username);
    
    if (user.products[product]) {
      user.products[product]!.balance = Math.max(0, user.products[product]!.balance - mbAmount);
    }
    
    return user;
  }

  async resetProxyKey(
    username: string,
    product: 'residential' | 'sharedDataCenter' | 'dataCenter' | 'dataCenterIPV6' | 'mobile',
  ): Promise<SubUser> {
    console.log(`[MOCK] Resetting ${username}'s ${product} proxy key`);
    const user = await this.getSubUser(username);
    
    if (user.products[product]) {
      user.products[product]!.proxy_key = this.generateRandomProxyKey();
    }
    
    return user;
  }

  async checkStatus(): Promise<{ status: string; message: string }> {
    console.log("[MOCK] Checking API status");
    return { status: "online", message: "Mock API is operational" };
  }

  async getProxySettings(): Promise<ProxySettingsData> {
    console.log("[MOCK] Getting proxy settings");
    
    const mockCountries: Record<string, string> = {
      "US": "United States",
      "GB": "United Kingdom",
      "DE": "Germany",
      "FR": "France",
      "JP": "Japan",
      "AU": "Australia",
      "CA": "Canada",
      "IN": "India",
      "BR": "Brazil",
      "RU": "Russia"
    };
    
    const mockRegions = {
      data: [
        { id: "CA", name: "California" },
        { id: "TX", name: "Texas" },
        { id: "NY", name: "New York" },
        { id: "FL", name: "Florida" },
        { id: "IL", name: "Illinois" }
      ]
    };
    
    const mockCities = {
      data: [
        { id: "LA", name: "Los Angeles", country_code: "US" },
        { id: "NY", name: "New York", country_code: "US" },
        { id: "CH", name: "Chicago", country_code: "US" },
        { id: "LO", name: "London", country_code: "GB" },
        { id: "BE", name: "Berlin", country_code: "DE" }
      ]
    };
    
    const mockISP: Record<string, { value: string; countryCode: string }> = {
      "ATT": { value: "AT&T", countryCode: "US" },
      "VER": { value: "Verizon", countryCode: "US" },
      "COM": { value: "Comcast", countryCode: "US" },
      "BT": { value: "British Telecom", countryCode: "GB" },
      "DT": { value: "Deutsche Telekom", countryCode: "DE" }
    };
    
    const mockCategory: ProxySettingCategory = {
      countries: mockCountries,
      regions: mockRegions,
      cities: mockCities,
      isp: mockISP,
      continents: null
    };
    
    return {
      residential: mockCategory,
      residentialIPV6: mockCategory,
      mobile: mockCategory,
      dataCenter: mockCategory,
      dataCenterIPV6: mockCategory,
      sharedDataCenter: mockCategory
    };
  }
}