import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, RotateCcw, Shield } from "lucide-react"
import Link from "next/link"

export function ServiceCards() {
  const services = [
    // {
    //   icon: RotateCcw,
    //   title: "Rotating",
    //   subtitle: "Residential",
    //   gradient: "from-blue-500 to-cyan-500",
    //   stats: [
    //     { label: "Traffic Left", value: "0.00 GB" },
    //     { label: "Orders", value: "0" },
    //     { label: "Traffic Used", value: "0.00 GB" },
    //   ],
    // },
    {
      icon: Shield,
      title: "Static Residential",
      subtitle: "",
      gradient: "from-purple-500 to-indigo-500",
      stats: [
        { label: "Total IPs", value: "0" },
        { label: "Orders", value: "0" },
        { label: "Active IPs", value: "0" },
      ],
      url: "/dashboard/proxies/static-residential",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <Card
          key={index}
          className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <service.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-foreground text-lg font-semibold">{service.title}</CardTitle>
                {service.subtitle && <p className="text-muted-foreground text-sm font-medium">{service.subtitle}</p>}
              </div>
            </div>
            <Link href={service.url} className="text-white">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {service.stats.map((stat, statIndex) => (
                <div key={statIndex} className="text-center">
                  <div className="text-foreground font-bold text-lg">{stat.value}</div>
                  <div className="text-muted-foreground text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="w-full bg-muted/50 rounded-full h-2">
              <div className={`bg-gradient-to-r ${service.gradient} h-2 rounded-full`} style={{ width: "0%" }}></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
