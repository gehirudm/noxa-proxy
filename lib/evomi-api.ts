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
 * Base EvomiAPI class with shared methods
 */
class BaseEvomiAPI {
  getProductDisplayName(productType: string): string {
    const displayNames: { [key: string]: string } = {
      residential: "Residential",
      sharedDataCenter: "Shared Data Center",
      dataCenter: "Data Center",
      dataCenterIPV6: "Data Center IPv6",
      mobile: "Mobile",
      residentialIPV6: "Residential IPv6",
    }
    return displayNames[productType] || productType
  }

  isProductExpired(product: ProductWithExpiry): boolean {
    if (!product.expiresAt || product.expiresAt === "0001-01-01T00:00:00Z") {
      return false // No expiry set
    }
    return new Date(product.expiresAt) < new Date()
  }

  generateProxyLinks(
    proxyKey: string,
    username: string,
    product: 'residential' | 'sharedDataCenter' | 'dataCenter' | 'dataCenterIPV6' | 'mobile',
    options?: {
      countryCode?: string
      regionId?: string
      cityId?: string
      sessionId?: string
      lifetime?: number
      ispValue?: string
    }
  ): { http: string; socks5: string } {
    const endpoints: Record<string, { host: string; httpPort: number; socksPort: number }> = {
      residential: { host: 'rp.evomi.com', httpPort: 1000, socksPort: 1002 },
      sharedDataCenter: { host: 'shared-datacenter.evomi.com', httpPort: 2000, socksPort: 2002 },
      dataCenter: { host: 'dcp.evomi.com', httpPort: 2000, socksPort: 2002 },
      dataCenterIPV6: { host: 'datacenter-ipv6.evomi.com', httpPort: 2000, socksPort: 2002 },
      mobile: { host: 'mp.evomi.com', httpPort: 3000, socksPort: 3002 },
    }
    const cfg = endpoints[product]
    let pwd = proxyKey

    if (options) {
      if (options.countryCode) pwd += `_country-${options.countryCode}`
      if (options.regionId) pwd += `_region-${options.regionId}`
      if (options.cityId) pwd += `_city-${options.cityId}`
      if (options.ispValue) pwd += `_isp-${options.ispValue}`
      if (options.sessionId) pwd += `_session-${options.sessionId}`
      if (options.lifetime) pwd += `_lifetime-${options.lifetime}`
    }

    const creds = encodeURIComponent(username) + ':' + encodeURIComponent(pwd)
    return {
      http: `http://${creds}@${cfg.host}:${cfg.httpPort}`,
      socks5: `socks5://${creds}@${cfg.host}:${cfg.socksPort}`,
    }
  }
}

/**
 * Real implementation of EvomiAPI that makes actual API calls
 */
class RealEvomiAPI extends BaseEvomiAPI {
  private headers = {
    "X-API-KEY": API_KEY!,
    "Content-Type": "application/json",
  }

  async createSubUser(username: string, email: string): Promise<SubUser> {
    const response = await fetch(`${EVOMI_API_BASE}/reseller/sub_users/create`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify({ username, email }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create subuser: ${response.statusText}`)
    }

    const apiResponse: ApiResponse<SubUser> = await response.json()
    return apiResponse.data
  }

  async getSubUsers(): Promise<SubUser[]> {
    const response = await fetch(`${EVOMI_API_BASE}/reseller/sub_users/view_all`, {
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch subusers: ${response.statusText}`)
    }

    const apiResponse: ApiResponse<SubUser[]> = await response.json()
    return apiResponse.data
  }

  async getSubUser(username: string): Promise<SubUser> {
    const response = await fetch(
      `${EVOMI_API_BASE}/reseller/sub_users/view_single?username=${encodeURIComponent(username)}`,
      {
        headers: this.headers,
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch subuser: ${response.statusText}`)
    }

    const apiResponse: ApiResponse<SubUser> = await response.json()
    return apiResponse.data
  }

  async getUsageHistory(username: string, duration = "24h", granularity = "hour"): Promise<UsageHistory> {
    const params = new URLSearchParams({
      username,
      duration,
      granularity,
    })

    const response = await fetch(`${EVOMI_API_BASE}/reseller/sub_users/view_txs?${params}`, {
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch usage history: ${response.statusText}`)
    }

    const apiResponse: ApiResponse<UsageHistory> = await response.json()
    return apiResponse.data
  }

  async giveBalance(
    username: string,
    product: 'residential' | 'sharedDataCenter' | 'mobile',
    mbAmount: number,
  ): Promise<SubUser> {
    const pathMap = {
      residential: 'give_rp_balance',
      sharedDataCenter: 'give_sdc_balance',
      mobile: 'give_mobile_balance',
    }
    const endpoint = pathMap[product]
    const resp = await fetch(`${EVOMI_API_BASE}/reseller/sub_users/${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ username, balance: mbAmount }),
    })
    if (!resp.ok) throw new Error(`Failed to add ${product} balance: ${resp.statusText}`)
    const apiRes: ApiResponse<SubUser> = await resp.json()
    return apiRes.data
  }

  /** Deduct MB balance from a subuser for specific product type */
  async takeBalance(
    username: string,
    product: 'residential' | 'sharedDataCenter' | 'mobile',
    mbAmount: number,
  ): Promise<SubUser> {
    const pathMap = {
      residential: 'take_rp_balance',
      sharedDataCenter: 'take_sdc_balance',
      mobile: 'take_mobile_balance',
    }
    const endpoint = pathMap[product]
    const resp = await fetch(`${EVOMI_API_BASE}/reseller/sub_users/${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ username, balance: mbAmount }),
    })
    if (!resp.ok) throw new Error(`Failed to remove ${product} balance: ${resp.statusText}`)
    const apiRes: ApiResponse<SubUser> = await resp.json()
    return apiRes.data
  }

  /** Reset a subuser's proxy key (auth key) */
  async resetProxyKey(
    username: string,
    product: 'residential' | 'sharedDataCenter' | 'dataCenter' | 'dataCenterIPV6' | 'mobile',
  ): Promise<SubUser> {
    const endpointMap: Record<string, string> = {
      residential: 'reset_rp_auth_key',
      sharedDataCenter: 'reset_sdc_auth_key',
      mobile: 'reset_mp_auth_key',
    }

    const endpoint = endpointMap[product]
    if (!endpoint) throw new Error(`Unsupported product type: ${product}`)

    const resp = await fetch(`${EVOMI_API_BASE}/reseller/sub_users/${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ username }),
    })

    if (!resp.ok) {
      throw new Error(`Failed to reset ${product} proxy key: ${resp.statusText}`)
    }

    const apiRes: ApiResponse<SubUser> = await resp.json()
    return apiRes.data
  }

  async checkStatus(): Promise<{ status: string; message: string }> {
    try {
      // Since there's no specific status endpoint in the docs, we'll use the view_all endpoint as a health check
      const response = await fetch(`${EVOMI_API_BASE}/reseller/sub_users/view_all`, {
        headers: this.headers,
      })

      if (response.ok) {
        return { status: "online", message: "API is operational" }
      } else {
        return { status: "offline", message: `API returned ${response.status}` }
      }
    } catch (error) {
      return { status: "offline", message: "API is unreachable" }
    }
  }

  async getProxySettings(): Promise<ProxySettingsData> {
    const resp = await fetch(`${EVOMI_API_BASE}/reseller/proxy_settings`, {
      headers: this.headers,
    })
    if (!resp.ok) throw new Error(`Failed to fetch proxy settings: ${resp.statusText}`)
    const apiResponse: ApiResponse<ProxySettingsData> = await resp.json()
    return apiResponse.data
  }
}

/**
 * Mock implementation of EvomiAPI that returns dummy data
 */
class MockEvomiAPI extends BaseEvomiAPI {
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

// Export the appropriate implementation based on whether API_KEY is available
export const evomiAPI = API_KEY 
  ? new RealEvomiAPI() 
  : new MockEvomiAPI();