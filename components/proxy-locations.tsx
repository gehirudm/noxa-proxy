import { ArrowRight } from "lucide-react"

export function ProxyLocations() {
  const locations = [
    { country: "🇺🇸 United States of America", ips: "45,260 IPs" },
    { country: "🇧🇷 Brazil", ips: "32,650 IPs" },
    { country: "🇮🇩 Indonesia", ips: "28,266 IPs" },
    { country: "🇮🇳 India", ips: "24,770 IPs" },
    { country: "🇲🇽 Mexico", ips: "18,176 IPs" },
    { country: "🇮🇹 Italy", ips: "15,332 IPs" },
    { country: "🇪🇸 Spain", ips: "12,366 IPs" },
    { country: "🇦🇷 Argentina", ips: "11,416 IPs" },
    { country: "🇬🇧 United Kingdom", ips: "9,720 IPs" },
    { country: "🇻🇳 Vietnam", ips: "8,094 IPs" },
    { country: "🇩🇪 Germany", ips: "7,564 IPs" },
    { country: "🌍 +150 More", ips: "+ 125,330 IPs" },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="text-blue-500 font-medium mb-2">Locations</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Top Proxy Locations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We offer thousands of proxies in the most in-demand regions for data access. Our proxy pools span:
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {locations.map((location, index) => (
            <div
              key={index}
              className="glass-effect hover:bg-muted/50 rounded-xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer group hover:scale-105 border border-blue-200/30 dark:border-blue-500/30 hover:border-purple-300 dark:hover:border-purple-500/50"
            >
              <div>
                <div className="font-medium text-foreground">{location.country}</div>
                <div className="text-sm text-muted-foreground">{location.ips}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
