import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

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

    const { userData } = useAuth();

    // This would typically come from an API
    const countries = [
        { value: "us", label: "United States" },
        { value: "gb", label: "United Kingdom" },
        { value: "ca", label: "Canada" },
        { value: "au", label: "Australia" },
        { value: "de", label: "Germany" },
    ];

    // These would be populated based on selected country
    const regions = [
        { value: "ny", label: "New York" },
        { value: "ca", label: "California" },
        { value: "tx", label: "Texas" },
    ];

    // These would be populated based on selected region
    const cities = [
        { value: "nyc", label: "New York City" },
        { value: "la", label: "Los Angeles" },
        { value: "chi", label: "Chicago" },
    ];

    // These would be populated based on selected country
    const isps = [
        { value: "comcast", label: "Comcast" },
        { value: "att", label: "AT&T" },
        { value: "verizon", label: "Verizon" },
    ];

    const handleGenerateProxyLinks = () => {
        // This would typically call an API to generate the links
        // For now, we'll just set some example values
        const username = userData?.evomi?.username;
        const password = userData?.evomi?.products[proxyType].proxy_key;

        const endpoints: Record<ProxyType, { host: string; httpPort: number; socksPort: number }> = {
            residential: { host: 'rp.evomi.com', httpPort: 1000, socksPort: 1002 },
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
                                <Select onValueChange={setCountry}>
                                    <SelectTrigger className="bg-background border-border text-foreground">
                                        <SelectValue placeholder="Select country" />
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
                                <Select onValueChange={setRegion}>
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
                                <Select onValueChange={setCity}>
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
                                <Select onValueChange={setIsp}>
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

                        <div className="pt-4">
                            <Button
                                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                                onClick={handleGenerateProxyLinks}
                            >
                                Generate Proxy Links
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
                                    value={httpProxy || "http://username:password@rp.evomi.com:1000"}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-l-md text-foreground"
                                />
                                <Button
                                    variant="secondary"
                                    className="rounded-l-none bg-muted hover:bg-muted/80"
                                    onClick={() => copyToClipboard(httpProxy || "http://username:password@rp.evomi.com:1000")}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground block">SOCKS5 Proxy</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    readOnly
                                    value={socksProxy || "socks5://username:password@rp.evomi.com:1002"}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-l-md text-foreground"
                                />
                                <Button
                                    variant="secondary"
                                    className="rounded-l-none bg-muted hover:bg-muted/80"
                                    onClick={() => copyToClipboard(socksProxy || "socks5://username:password@rp.evomi.com:1002")}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
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
