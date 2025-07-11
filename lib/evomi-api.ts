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

export class EvomiAPI {
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
}

export const evomiAPI = new EvomiAPI()