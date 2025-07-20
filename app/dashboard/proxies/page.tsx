import { Shield, Wifi, Smartphone, Server, Globe } from "lucide-react"
import { Sidebar } from "../components/sidebar"
import { Header } from "../components/header"
import Link from "next/link"

export default function ProxiesPage() {
  // Define all proxy types with their details
  const proxyTypes = [
    {
      id: "premium-residential",
      name: "Premium Residential Proxies",
      description: "High-quality residential proxies with premium features",
      icon: Shield,
      gradient: "from-purple-500 to-indigo-500",
      path: "/dashboard/proxies/premium-residential"
    },
    {
      id: "static-residential",
      name: "Static Residential Proxies",
      description: "Dedicated static residential IPs with consistent performance",
      icon: Wifi,
      gradient: "from-blue-500 to-cyan-500",
      path: "/dashboard/proxies/static-residential"
    },
    {
      id: "datacenter-ipv4",
      name: "Datacenter IPv4 Proxies",
      description: "High-speed datacenter proxies with IPv4 addresses",
      icon: Server,
      gradient: "from-green-500 to-teal-500",
      path: "/dashboard/proxies/datacenter-ipv4"
    },
    {
      id: "datacenter-ipv6",
      name: "Datacenter IPv6 Proxies",
      description: "High-speed datacenter proxies with IPv6 addresses",
      icon: Server,
      gradient: "from-emerald-500 to-green-500",
      path: "/dashboard/proxies/datacenter-ipv6"
    },
    {
      id: "mobile-proxy",
      name: "Mobile Proxies",
      description: "High-speed mobile network proxies for advanced use cases",
      icon: Smartphone,
      gradient: "from-orange-500 to-red-500",
      path: "/dashboard/proxies/mobile-proxy"
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Proxy Services</h1>
              <p className="text-muted-foreground">
                Browse our range of high-quality proxy solutions for all your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proxyTypes.map((proxyType) => (
                <Link 
                  href={proxyType.path} 
                  key={proxyType.id}
                  className="block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-lg"
                >
                  <div className="h-full bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className={`h-2 bg-gradient-to-r ${proxyType.gradient}`}></div>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${proxyType.gradient} text-white`}>
                          <proxyType.icon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold ml-3 text-foreground">{proxyType.name}</h2>
                      </div>
                      <p className="text-muted-foreground mb-4">{proxyType.description}</p>
                      
                      <div className="flex items-center text-sm text-pink-600 font-medium">
                        <span>View details</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="ml-1"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Additional card for custom proxy solutions */}
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-600"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold ml-3 text-foreground">Custom Proxy Solutions</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Need a specialized proxy solution? Contact our team for custom configurations and enterprise plans.
                  </p>
                  <Link 
                    href="/dashboard/support" 
                    className="inline-flex items-center text-sm text-pink-600 font-medium"
                  >
                    <span>Contact support</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="ml-1"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature comparison section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Proxy Types Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Feature</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Premium Residential</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Static Residential</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Datacenter IPv4</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Datacenter IPv6</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Mobile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">Speed</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Medium-High</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Medium</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Very High</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Very High</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Medium</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">Anonymity</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">High</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">High</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Medium</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">High</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Very High</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">IP Rotation</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Customizable</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Static</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Optional</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Optional</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Automatic</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">Geo-targeting</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Extensive</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Limited</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Limited</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Limited</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">By carrier</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">Best for</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Web scraping, Social media</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Account management</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">High-volume tasks</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Avoiding IP bans</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">App testing, Verification</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-lg font-medium text-foreground mb-2">What's the difference between residential and datacenter proxies?</h3>
                  <p className="text-muted-foreground">
                    Residential proxies use IP addresses assigned by ISPs to homeowners, making them appear as regular users. 
                    Datacenter proxies are hosted in data centers and offer higher speeds but are more easily detected as proxies.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-lg font-medium text-foreground mb-2">How do I choose the right proxy type?</h3>
                  <p className="text-muted-foreground">
                    Consider your specific use case: for web scraping and accessing geo-restricted content, residential proxies work best. 
                    For high-speed operations where anonymity is less critical, datacenter proxies are ideal. Mobile proxies are best for 
                    mobile app testing and verification processes.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-lg font-medium text-foreground mb-2">Can I try before I buy?</h3>
                  <p className="text-muted-foreground">
                    Yes, we offer trial packages for all our proxy types. Contact our support team to set up a trial that meets your specific needs.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}