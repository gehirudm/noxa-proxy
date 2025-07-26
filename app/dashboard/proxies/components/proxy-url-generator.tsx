import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardCopyIcon, Globe, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getProxySettings } from "@/app/actions/evomi-actions"

type ProxyType = 'residential' | 'sharedDataCenter' | 'dataCenter' | 'dataCenterIPV6' | 'dataCenterIPV4' | 'mobile';

interface ProxyUrlGeneratorProps {
    title?: string;
    defaultProxyType?: ProxyType;
}

export function ProxyUrlGenerator({
    title = "Proxy Generator",
    defaultProxyType = "residential"
}: ProxyUrlGeneratorProps) {
    const [proxyType, setProxyType] = useState<ProxyType>(defaultProxyType);
    const [country, setCountry] = useState<string>("");
    const [region, setRegion] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [isp, setIsp] = useState<string>("");
    const [sessionId, setSessionId] = useState<string>("");
    const [lifetime, setLifetime] = useState<string>("");
    const [httpProxy, setHttpProxy] = useState<string>("");
    const [socksProxy, setSocksProxy] = useState<string>("");
    
    // State for proxy settings
    const [proxySettings, setProxySettings] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Available options from proxy settings
    const [countries, setCountries] = useState<{value: string, label: string}[]>([]);
    const [regions, setRegions] = useState<{value: string, label: string}[]>([]);
    const [cities, setCities] = useState<{value: string, label: string}[]>([]);
    const [isps, setIsps] = useState<{value: string, label: string}[]>([]);

    const { userData } = useAuth();

    // Fetch proxy settings when proxy type changes
        useEffect(() => {
        async function fetchProxySettings() {
            setLoading(true);
            setError(null);
            
            try {
                const result = await getProxySettings();
                
                if (result.success) {
                    setProxySettings(result.data);
                    
                    // Reset selections when proxy type changes
                    setCountry("");
                    setRegion("");
                    setCity("");
                    setIsp("");
                    
                    // Get the settings for the current proxy type
                    // @ts-ignore
                    const typeSettings = result.data[proxyType];
                    
                    // Process countries if available
                    if (typeSettings?.countries) {
                        const countryOptions = Object.entries(typeSettings.countries).map(([code, name]) => ({
                            value: code,
                            label: name as string
                        }));
                        setCountries(countryOptions);
                    } else {
                        setCountries([]);
                    }
                    
                    // Reset other options
                    setRegions([]);
                    setCities([]);
                    setIsps([]);
                } else {
                    setError(result.error || "Failed to fetch proxy settings");
                    setCountries([]);
                    setRegions([]);
                    setCities([]);
                    setIsps([]);
                }
            } catch (err) {
                setError("Failed to fetch proxy settings");
                console.error(err);
                setCountries([]);
                setRegions([]);
                setCities([]);
                setIsps([]);
            } finally {
                setLoading(false);
            }
        }
        
        fetchProxySettings();
    }, [proxyType]);
    
    // Update regions when country changes
    useEffect(() => {
        if (!country || !proxySettings?.regions?.data) {
            setRegions([]);
            return;
        }
        
        const filteredRegions = proxySettings.regions.data
            .filter((r: any) => r.country_code === country)
            .map((r: any) => ({
                value: r.id,
                label: r.name
            }));
            
        setRegions(filteredRegions);
        setRegion(""); // Reset region selection
    }, [country, proxySettings]);
    
    // Update cities when region changes
    useEffect(() => {
        if (!country || !proxySettings?.cities?.data) {
            setCities([]);
            return;
        }
        
        const filteredCities = proxySettings.cities.data
            .filter((c: any) => c.country_code === country && (!region || c.region_id === region))
            .map((c: any) => ({
                value: c.id,
                label: c.name
            }));
            
        setCities(filteredCities);
        setCity(""); // Reset city selection
    }, [country, region, proxySettings]);
    
    // Update ISPs when country changes
    useEffect(() => {
        if (!country || !proxySettings?.isp) {
            setIsps([]);
            return;
        }
        
        const filteredIsps = Object.entries(proxySettings.isp)
            .filter(([_, data]: [string, any]) => data.countryCode === country)
            .map(([key, data]: [string, any]) => ({
                value: key,
                label: data.value
            }));
            
        setIsps(filteredIsps);
        setIsp(""); // Reset ISP selection
    }, [country, proxySettings]);

    const handleGenerateProxyLinks = () => {
        // This would typically call an API to generate the links
        // For now, we'll just set some example values
        const username = userData?.evomi?.username || "username";
        const password = userData?.evomi?.products?.[proxyType]?.proxy_key || "password";

        const endpoints: Record<ProxyType, { host: string; httpPort: number; socksPort: number }> = {
            residential: { host: 'proxies.noxaproxy.com', httpPort: 1000, socksPort: 1002 },
            sharedDataCenter: { host: 'shared-datacenter.evomi.com', httpPort: 2000, socksPort: 2002 },
            dataCenter: { host: 'dcp.evomi.com', httpPort: 2000, socksPort: 2002 },
            dataCenterIPV6: { host: 'datacenter-ipv6.evomi.com', httpPort: 2000, socksPort: 2002 },
            dataCenterIPV4: { host: 'datacenter-ipv6.evomi.com', httpPort: 2000, socksPort: 2002 },
            mobile: { host: 'mp.evomi.com', httpPort: 3000, socksPort: 3002 },
        };

        const cfg = endpoints[proxyType];
        let pwd = password;

        if (country) pwd += `_country-${country}`;
        if (region) pwd += `_region-${region}`;
        if (city) pwd += `_city-${city}`;
        if (isp) pwd += `_isp-${isp}`;
        if (sessionId) pwd += `_session-${sessionId}`;
        if (lifetime) pwd += `_lifetime-${lifetime}`;

        const creds = encodeURIComponent(username) + ':' + encodeURIComponent(pwd);

        setHttpProxy(`http://${creds}@${cfg.host}:${cfg.httpPort}`);
        setSocksProxy(`socks5://${creds}@${cfg.host}:${cfg.socksPort}`);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Generator Form */}
            <div className="lg:col-span-2">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center">
                            <Globe className="w-5 h-5 mr-2" />
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Product Type</label>
                                <Select
                                    defaultValue={proxyType}
                                    onValueChange={(value) => setProxyType(value as ProxyType)}
                                >
                                    <SelectTrigger className="bg-background border-border text-foreground">
                                        <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="residential">Residential</SelectItem>
                                        <SelectItem value="sharedDataCenter">Shared Data Center</SelectItem>
                                        <SelectItem value="dataCenter">Data Center</SelectItem>
                                        <SelectItem value="dataCenterIPV6">Data Center IPv6</SelectItem>
                                        <SelectItem value="mobile">Mobile</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Country</label>
                                <Select 
                                    value={country} 
                                    onValueChange={setCountry}
                                    disabled={loading || countries.length === 0}
                                >
                                    <SelectTrigger className="bg-background border-border text-foreground">
                                        {loading ? (
                                            <div className="flex items-center">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Loading...
                                            </div>
                                        ) : (
                                            <SelectValue placeholder="Select country" />
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Region/State</label>
                                <Select 
                                    value={region} 
                                    onValueChange={setRegion}
                                    disabled={!country || regions.length === 0}
                                >
                                    <SelectTrigger className="bg-background border-border text-foreground">
                                        <SelectValue placeholder="Select region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map((region) => (
                                            <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">City</label>
                                <Select 
                                    value={city} 
                                    onValueChange={setCity}
                                    disabled={!country || cities.length === 0}
                                >
                                    <SelectTrigger className="bg-background border-border text-foreground">
                                        <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((city) => (
                                                                                        <SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">ISP</label>
                                <Select 
                                    value={isp} 
                                    onValueChange={setIsp}
                                    disabled={!country || isps.length === 0}
                                >
                                    <SelectTrigger className="bg-background border-border text-foreground">
                                        <SelectValue placeholder="Select ISP" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isps.map((isp) => (
                                            <SelectItem key={isp.value} value={isp.value}>{isp.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Session ID (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Enter session ID"
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                                    value={sessionId}
                                    onChange={(e) => setSessionId(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Lifetime (Minutes)</label>
                                <input
                                    type="number"
                                    placeholder="0 (no limit)"
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                                    value={lifetime}
                                    onChange={(e) => setLifetime(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="pt-4">
                            <Button
                                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                                onClick={handleGenerateProxyLinks}
                                disabled={loading || !userData?.evomi?.username}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    "Generate Proxy Links"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column - Generated Links */}
            <div className="lg:col-span-1">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Generated Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground block">HTTP Proxy</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    readOnly
                                    value={httpProxy || "http://username:password@proxies.noxaproxy.com:1000"}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-l-md text-foreground"
                                />
                                <Button
                                    variant="secondary"
                                    className="rounded-l-none bg-muted hover:bg-muted/80"
                                    onClick={() => copyToClipboard(httpProxy || "http://username:password@proxies.noxaproxy.com:1000")}
                                >
                                    <ClipboardCopyIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground block">SOCKS5 Proxy</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    readOnly
                                    value={socksProxy || "socks5://username:password@proxies.noxaproxy.com:1002"}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-l-md text-foreground"
                                />
                                <Button
                                    variant="secondary"
                                    className="rounded-l-none bg-muted hover:bg-muted/80"
                                    onClick={() => copyToClipboard(socksProxy || "socks5://username:password@proxies.noxaproxy.com:1002")}
                                >
                                    <ClipboardCopyIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <h4 className="text-sm font-medium text-foreground mb-1">Usage Instructions</h4>
                                <p className="text-xs text-muted-foreground">
                                    Use these proxy links in your applications or tools that support HTTP or SOCKS5 proxies.
                                    The generated links include your authentication credentials.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}