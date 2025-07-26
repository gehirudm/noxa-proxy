import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Zap,
  Star,
  ChevronDown,
  MessageCircle,
  Send,
  Mail,
  HelpCircle,
  Database,
  Smartphone,
  Home,
  Settings,
  Globe,
  Activity,
  Server,
  Shield,
  Target,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { LiveStats } from "@/components/landing/live-stats"
import React from "react"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"

// Define a type for company data
interface Company {
  name: string;
  domain: string;
}

// Create a 2D array of companies (8 rows x 4 columns)
const companiesGrid: Company[][] = [
  // Row 1
  [
    { name: "YouTube", domain: "youtube.com" },
    { name: "Walmart", domain: "walmart.com" },
    { name: "Twitter", domain: "twitter.com" },
    { name: "Twitch", domain: "twitch.tv" },
  ],
  // Row 2
  [
    { name: "Telegram", domain: "telegram.org" },
    { name: "Spotify", domain: "spotify.com" },
    { name: "Shopify", domain: "shopify.com" },
    { name: "Reddit", domain: "reddit.com" },
  ],
  // Row 3
  [
    { name: "reCAPTCHA", domain: "recaptcha.com" },
    { name: "Instagram", domain: "instagram.com" },
    { name: "Facebook", domain: "facebook.com" },
    { name: "Pokemon", domain: "pokemon.com" },
  ],
  // Row 4
  [
    { name: "Peace", domain: "peaceoneday.org" },
    { name: "eBay", domain: "ebay.com" },
    { name: "Kijiji", domain: "kijiji.ca" },
    { name: "Target", domain: "target.com" },
  ],
  // Row 5
  [
    { name: "Apple", domain: "apple.com" },
    { name: "Amazon", domain: "amazon.com" },
    { name: "TikTok", domain: "tiktok.com" },
    { name: "LinkedIn", domain: "linkedin.com" },
  ],
  // Row 6
  [
    { name: "OnlyFans", domain: "onlyfans.com" },
    { name: "Multilogin", domain: "multilogin.com" },
    { name: "Incogniton", domain: "incogniton.com" },
    { name: "Kameleo", domain: "kameleo.io" },
  ],
  // Row 7
  [
    { name: "Linken Sphere", domain: "linkensphere.com" },
    { name: "Selenium", domain: "selenium.dev" },
    { name: "Puppeteer", domain: "pptr.dev" },
    { name: "Playwright", domain: "playwright.dev" },
  ],
  // Row 8
  [
    { name: "Google", domain: "google.com" },
    { name: "GoLogin", domain: "gologin.com" },
    { name: "Dolphin Anty", domain: "dolphin-anty.com" },
    { name: "Ads Power", domain: "adspower.com" },
  ],
];

// Component for rendering a single company card
const CompanyCard = ({ company }: { company: Company }) => {
  const logoSrc = `/sites/${company.domain}.png`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center justify-center hover:scale-110 transition-transform border border-slate-200 dark:border-slate-700 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-400/20 backdrop-blur-xl">
      <div className="h-8 w-8 mb-2 relative">
        <Image
          src={logoSrc}
          alt={company.name}
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      <span className="text-xs font-bold text-slate-700 dark:text-white">{company.name}</span>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 w-full">
      <Header />

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-teal-500/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex justify-center">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Trustpilot</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Lightning-Fast
                </span>
                <br />
                <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Proxy Network
                </span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Access premium residential and datacenter proxies with{" "}
                <span className="text-green-500 font-semibold">99.9% uptime</span>. Scale your business with our
                reliable proxy network spanning <span className="text-cyan-500 font-semibold">150+ locations</span>{" "}
                worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href={"/auth"}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105"
                  >
                    Start Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Live Statistics Bar */}
          <LiveStats />
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Dashboard Screenshot */}
          <div className="relative max-w-7xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
            <div className="relative glass-effect rounded-2xl p-2 border border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50">
              <div className="rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                <Image
                  src="/images/noxaproxy-dashboard.png"
                  alt="NoxaProxy Dashboard"
                  width={1400}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <p className="text-cyan-500 text-sm font-semibold mb-4 tracking-wider uppercase">OUR PRODUCTS</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              The perfect fit for companies
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                large and small
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Left Column - Service Cards */}
            <div className="space-y-6">
              <Card className="glass-effect border-cyan-500/30 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-900/80 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-cyan-500" />
                    Proxy Solutions
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    Enterprise-grade proxy solutions, adapting to your data collection needs with military-grade
                    security.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass-effect border-teal-500/30 bg-gradient-to-br from-teal-50/80 to-white/80 dark:from-teal-900/80 dark:to-slate-800/80 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Target className="mr-2 h-5 w-5 text-teal-500" />
                    Scraper APIs
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    Advanced scraping APIs for automated data collection and processing at enterprise scale.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Right Column - Product Cards */}
            <div className="lg:col-span-2 space-y-4">
              {/* Residential Proxies */}
              <Card className="glass-effect border-cyan-500/30 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-900/80 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                        <Home className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Residential Proxies</h3>
                        <p className="text-cyan-600 dark:text-cyan-300 text-sm">
                          High-quality residential IPs • 99.9% success rate
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-sm text-slate-500 dark:text-slate-400">from </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">$2.75</span>
                        <span className="text-slate-500 dark:text-slate-400">/GB</span>
                      </div>
                      <Link href={"/dashboard/proxies/static-residential"}>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                        >
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Proxies */}
              <Card className="glass-effect border-teal-500/30 bg-gradient-to-r from-teal-50/80 to-white/80 dark:from-teal-900/80 dark:to-slate-800/80 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mobile Proxies</h3>
                        <p className="text-teal-600 dark:text-teal-300 text-sm">
                          Real mobile device connections • 4G/5G networks
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* <div className="text-right">
                        <span className="text-sm text-slate-500 dark:text-slate-400">from </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">$1</span>
                        <span className="text-slate-500 dark:text-slate-400">/GB</span>
                      </div> */}
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                      >
                        Soon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Datacenter Proxies */}
              <Card className="glass-effect border-blue-500/30 bg-gradient-to-r from-blue-50/80 to-white/80 dark:from-blue-900/80 dark:to-slate-800/80 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <Database className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Datacenter Proxies</h3>
                        <p className="text-blue-600 dark:text-blue-300 text-sm">
                          High-speed datacenter connections • Ultra-low latency
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* <div className="text-right">
                        <span className="text-sm text-slate-500 dark:text-slate-400">from </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">$1</span>
                        <span className="text-slate-500 dark:text-slate-400">/GB</span>
                      </div> */}
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                      >
                        Soon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Static Residential Proxies */}
              <Card className="glass-effect border-emerald-500/30 bg-gradient-to-r from-emerald-50/80 to-white/80 dark:from-emerald-900/80 dark:to-slate-800/80 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <Settings className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Static Residential Proxies</h3>
                        <p className="text-emerald-600 dark:text-emerald-300 text-sm">
                          Dedicated static residential IPs • Premium quality
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* <div className="text-right">
                        <span className="text-sm text-slate-500 dark:text-slate-400">from </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">$1</span>
                        <span className="text-slate-500 dark:text-slate-400">/IP</span>
                      </div> */}
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                      >
                        Soon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12">
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border border-cyan-500/50 shadow-lg shadow-cyan-500/25">
              Pay as you go Pricing available
            </Button>
            <span className="text-slate-600 dark:text-slate-300">Looking for any custom plans?</span>
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white border border-teal-500/50 shadow-lg shadow-teal-500/25">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Sites We Support Section */}
      <section className="py-20 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Sites We Support */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Sites We Support - Ready to supercharge your proxy experience?
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Our proxies work seamlessly with all major platforms and services
                </p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {companiesGrid.map((row, rowIndex) => (
                  // We use the row index as the key for the fragment
                  <React.Fragment key={`row-${rowIndex}`}>
                    {row.map((company) => (
                      <CompanyCard key={company.name} company={company} />
                    ))}
                  </React.Fragment>
                ))}
              </div>

              <div className="text-center mt-8">
                <p className="text-slate-500 dark:text-slate-400">And 500+ more platforms and services</p>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                  FAQs
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Get answers to common questions about our proxy services
                </p>
              </div>

              <div className="space-y-4">
                <div className="glass-effect border border-cyan-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:border-green-400/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-cyan-500/10 transition-colors">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        What is the Difference Between ISP and Residential Proxies?
                      </span>
                      <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
                      <p className="pt-4">
                        ISP proxies are hosted in data centers but use residential IP ranges, while residential proxies
                        use real residential connections from ISPs.
                      </p>
                    </div>
                  </details>
                </div>

                <div className="glass-effect border border-cyan-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:border-green-400/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-cyan-500/10 transition-colors">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        What type of Authentication Do My Proxies come in?
                      </span>
                      <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
                      <p className="pt-4">
                        Our proxies support both username:password authentication and IP whitelist authentication for
                        maximum flexibility.
                      </p>
                    </div>
                  </details>
                </div>

                <div className="glass-effect border border-cyan-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:border-green-400/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-cyan-500/10 transition-colors">
                      <span className="font-semibold text-slate-900 dark:text-white">Can I Renew My Proxies?</span>
                      <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
                      <p className="pt-4">
                        Yes, you can easily renew your proxy subscription through your dashboard before expiration to
                        maintain uninterrupted service.
                      </p>
                    </div>
                  </details>
                </div>

                <div className="glass-effect border border-cyan-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:border-green-400/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-cyan-500/10 transition-colors">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        When Will My Proxies Be Delivered?
                      </span>
                      <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
                      <p className="pt-4">
                        Proxies are delivered instantly after payment confirmation. You'll receive your credentials
                        within 1-2 minutes.
                      </p>
                    </div>
                  </details>
                </div>

                <div className="glass-effect border border-cyan-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:border-green-400/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-cyan-500/10 transition-colors">
                      <span className="font-semibold text-slate-900 dark:text-white">Do you offer 24/7 Support?</span>
                      <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
                      <p className="pt-4">
                        Yes, our support team is available 24/7 via Discord, Telegram, and Crisp Chat to assist you with
                        any questions or issues.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proxy Locations Section */}
      <section className="py-20 bg-white/50 dark:bg-blue-900/50 backdrop-blur-sm">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className="text-cyan-500 font-medium mb-2">Locations</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              Top Proxy Locations
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We offer thousands of proxies in the most in-demand regions for data access. Our proxy pools span:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {[
              { country: "United States of America", ips: "45,260 IPs", flag: "🇺🇸" },
              { country: "Brazil", ips: "32,650 IPs", flag: "🇧🇷" },
              { country: "Indonesia", ips: "28,266 IPs", flag: "🇮🇩" },
              { country: "India", ips: "24,770 IPs", flag: "🇮🇳" },
              { country: "Mexico", ips: "18,176 IPs", flag: "🇲🇽" },
              { country: "Italy", ips: "15,332 IPs", flag: "🇮🇹" },
              { country: "Spain", ips: "12,366 IPs", flag: "🇪🇸" },
              { country: "Argentina", ips: "11,416 IPs", flag: "🇦🇷" },
              { country: "United Kingdom", ips: "9,720 IPs", flag: "🇬🇧" },
              { country: "Vietnam", ips: "8,094 IPs", flag: "🇻🇳" },
              { country: "Germany", ips: "7,564 IPs", flag: "🇩🇪" },
            ].map((location, index) => (
              <div
                key={index}
                className="glass-effect hover:bg-white/70 dark:hover:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer group hover:scale-105 border border-cyan-500/30 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-400/20 backdrop-blur-xl bg-white/30 dark:bg-slate-800/30"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{location.flag}</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">{location.country}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{location.ips}</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-green-400 transition-colors" />
              </div>
            ))}
            <div className="glass-effect hover:bg-white/70 dark:hover:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer group hover:scale-105 border border-green-500/50 bg-gradient-to-r from-green-50/30 to-emerald-50/30 dark:from-green-900/30 dark:to-emerald-900/30 hover:shadow-lg hover:shadow-green-400/20 backdrop-blur-xl">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🌍</div>
                <div>
                  <div className="font-medium bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    +150 More Countries
                  </div>
                  <div className="text-sm text-green-500">+ 125,330 IPs</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-green-400 group-hover:text-green-300 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="text-cyan-500 font-medium mb-2 tracking-wider uppercase text-sm">FEATURES</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              Why choose NoxaProxy?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              NoxaProxy has been built from the ground up by a team of proxy experts with over 6 years of experience, to
              deliver the quality, performance and security, that is expected by industry leaders.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Guaranteed Low Latency Card */}
            <Card className="glass-effect border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 p-8 group hover:border-green-400/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50">
              <CardContent className="text-center space-y-8">
                <div className="relative">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Guaranteed Low Latency
                  </h3>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full"></div>
                </div>

                {/* Modern Network Visualization */}
                <div className="relative py-12">
                  <div className="flex items-center justify-center space-x-6">
                    {/* Source Node */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-cyan-500/25">
                        <Server className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-cyan-500">
                        Source
                      </div>
                    </div>

                    {/* Connection Lines with Animation */}
                    <div className="flex items-center space-x-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-3 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                      ))}
                    </div>

                    {/* Speed Indicator */}
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-green-400/25 relative overflow-hidden">
                        <Activity className="h-10 w-10 text-white z-10" />
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-500">
                        {"<5ms"}
                      </div>
                    </div>

                    {/* Connection Lines */}
                    <div className="flex items-center space-x-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-3 h-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"></div>
                      ))}
                    </div>

                    {/* Destination Node */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl shadow-teal-500/25">
                        <Globe className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-teal-500">
                        Target
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">99.9%</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-500">{"<5ms"}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Latency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-500">10Gb/s</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Speed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Global Presence Card */}
            <Card className="glass-effect border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-500 p-8 group hover:border-green-400/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50">
              <CardContent className="text-center space-y-8">
                <div className="relative">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Global Presence
                  </h3>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full"></div>
                </div>

                {/* Enhanced World Map */}
                <div className="relative py-8">
                  <div className="w-full h-64 bg-gradient-to-br from-white/80 via-blue-50/80 to-teal-50/80 dark:from-slate-800/80 dark:via-blue-900/80 dark:to-teal-900/80 rounded-2xl relative overflow-hidden border border-cyan-500/30 backdrop-blur-xl">
                    {/* Animated Background Grid */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="grid grid-cols-24 gap-1 h-full p-4">
                        {[...Array(288)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full opacity-30"
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Country Markers with Enhanced Styling */}
                    <div className="absolute top-6 left-12 flex items-center space-x-2 group/marker">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg"></div>
                      <div className="text-xs font-bold text-cyan-500 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-full shadow-sm border border-cyan-500/30">
                        🇬🇧 UK
                      </div>
                    </div>

                    <div className="absolute top-4 right-16 flex items-center space-x-2 group/marker">
                      <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-lg"></div>
                      <div className="text-xs font-bold text-teal-500 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-full shadow-sm border border-teal-500/30">
                        🇷🇺 Russia
                      </div>
                    </div>

                    <div className="absolute top-16 left-20 flex items-center space-x-2 group/marker">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg"></div>
                      <div className="text-xs font-bold text-blue-500 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-full shadow-sm border border-blue-500/30">
                        🇮🇹 Italy
                      </div>
                    </div>

                    <div className="absolute top-20 right-12 flex items-center space-x-2 group/marker">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full shadow-lg"></div>
                      <div className="text-xs font-bold text-green-500 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-full shadow-sm border border-green-500/30">
                        🇮🇳 India
                      </div>
                    </div>

                    <div className="absolute bottom-16 right-8 flex items-center space-x-2 group/marker">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg"></div>
                      <div className="text-xs font-bold text-orange-500 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-full shadow-sm border border-orange-500/30">
                        🇦🇪 UAE
                      </div>
                    </div>

                    <div className="absolute bottom-12 left-10 flex items-center space-x-2 group/marker">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg"></div>
                      <div className="text-xs font-bold text-yellow-500 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-full shadow-sm border border-yellow-500/30">
                        🇸🇳 Senegal
                      </div>
                    </div>

                    {/* Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
                          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.6" />
                        </linearGradient>
                      </defs>
                      <path d="M60 40 Q150 20 280 80" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" />
                      <path d="M80 80 Q200 60 320 120" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" />
                      <path
                        d="M40 180 Q180 140 300 160"
                        stroke="url(#connectionGradient)"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>

                    {/* Central Hub */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
                        <Globe className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Global Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-500">150+</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-500">500+</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Cities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">10M+</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">IPs</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white/50 dark:bg-blue-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              Loved by teams worldwide
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Join thousands of companies already using NoxaProxy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-effect border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:border-green-400/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  "NoxaProxy transformed our data collection process. We've increased our success rates by 40% and our
                  proxy reliability has never been better."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Sarah Johnson"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Sarah Johnson</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">CTO, DataCorp</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 hover:scale-105 hover:border-green-400/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  "The proxy quality is incredible. Our scraping operations that used to fail now run smoothly 24/7.
                  It's like having a dedicated infrastructure team."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Michael Chen"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Michael Chen</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Lead Developer, ScrapeTech</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-green-400/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  "Finally, a proxy service that actually delivers on its promises. The uptime is excellent and the
                  support team is incredibly responsive."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Emily Rodriguez"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Emily Rodriguez</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Operations Director, WebCrawl</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/80 dark:to-emerald-900/80 backdrop-blur-sm relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">Still don't have an account?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={"/auth"}
              >
                <Button
                  variant="outline"
                  className="border-green-400/50 text-green-500 hover:text-white hover:bg-green-500/20 transition-colors text-lg px-8 py-4 rounded-xl"
                >
                  Login
                </Button>
              </Link>
              <Link
                href={"/auth?mode=register"}
              >
                <Button
                  variant="outline"
                  className="border-green-400/50 text-green-500 hover:text-white hover:bg-green-500/20 transition-colors text-lg px-8 py-4 rounded-xl"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer></Footer>
    </div>
  )
}
