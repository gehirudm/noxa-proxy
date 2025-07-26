"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  BookOpen,
  MessageCircle,
  Send,
  Mail,
  Zap,
  ChevronRight,
  Play,
  Settings,
  Shield,
  Globe,
  CreditCard,
  Users,
  Code,
  ExternalLink,
  ArrowLeft,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using NoxaProxy",
      articles: 12,
      color: "from-green-400 to-green-500",
      borderColor: "border-green-200/30 dark:border-green-500/30",
    },
    {
      icon: Settings,
      title: "Proxy Setup",
      description: "Configure proxies in your applications",
      articles: 18,
      color: "from-blue-400 to-blue-500",
      borderColor: "border-blue-200/30 dark:border-blue-500/30",
    },
    {
      icon: Code,
      title: "API Documentation",
      description: "Integrate with our REST API",
      articles: 24,
      color: "from-purple-400 to-purple-500",
      borderColor: "border-purple-200/30 dark:border-purple-500/30",
    },
    {
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Manage your subscription and payments",
      articles: 8,
      color: "from-yellow-400 to-yellow-500",
      borderColor: "border-yellow-200/30 dark:border-yellow-500/30",
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Keep your data safe and secure",
      articles: 15,
      color: "from-red-400 to-red-500",
      borderColor: "border-red-200/30 dark:border-red-500/30",
    },
    {
      icon: Globe,
      title: "Locations & IPs",
      description: "Understanding proxy locations",
      articles: 10,
      color: "from-orange-400 to-orange-500",
      borderColor: "border-orange-200/30 dark:border-orange-500/30",
    },
  ]

  const popularArticles = [
    {
      title: "How to Set Up Your First Proxy",
      category: "Getting Started",
      readTime: "5 min read",
      views: "2.1k views",
    },
    {
      title: "Configuring Proxies in Chrome Browser",
      category: "Proxy Setup",
      readTime: "3 min read",
      views: "1.8k views",
    },
    {
      title: "Understanding Residential vs Datacenter Proxies",
      category: "Getting Started",
      readTime: "7 min read",
      views: "1.5k views",
    },
    {
      title: "API Authentication Guide",
      category: "API Documentation",
      readTime: "4 min read",
      views: "1.2k views",
    },
    {
      title: "Troubleshooting Connection Issues",
      category: "Proxy Setup",
      readTime: "6 min read",
      views: "1.1k views",
    },
    {
      title: "Managing Your Subscription",
      category: "Billing & Payments",
      readTime: "3 min read",
      views: "980 views",
    },
  ]

  const quickLinks = [
    {
      title: "Status Page",
      description: "Check service status",
      icon: Globe,
      href: "#",
    },
    {
      title: "API Reference",
      description: "Complete API docs",
      icon: Code,
      href: "#",
    },
    {
      title: "Video Tutorials",
      description: "Watch and learn",
      icon: Play,
      href: "#",
    },
    {
      title: "Community Forum",
      description: "Join discussions",
      icon: Users,
      href: "#",
    },
  ]

  const faqs = [
    {
      question: "How quickly are proxies delivered after purchase?",
      answer:
        "Proxies are delivered instantly after payment confirmation. You'll receive your credentials within 1-2 minutes via email and in your dashboard.",
    },
    {
      question: "What authentication methods do you support?",
      answer:
        "We support both username:password authentication and IP whitelist authentication. You can configure your preferred method in the dashboard.",
    },
    {
      question: "Can I change my proxy locations after purchase?",
      answer:
        "Yes, you can change proxy locations through your dashboard. Some plans allow unlimited location changes, while others may have restrictions.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 24-hour money-back guarantee for new customers. Refunds are processed within 3-5 business days to your original payment method.",
    },
    {
      question: "What's the difference between sticky and rotating proxies?",
      answer:
        "Sticky proxies maintain the same IP for a set duration, while rotating proxies change IPs automatically. Choose based on your use case requirements.",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              How can we <span className="flame-text">help you</span>?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers, guides, and resources to get the most out of NoxaProxy
            </p>

            {/* Search Bar
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help articles, guides, or FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg glass-effect border-orange-200/30 dark:border-orange-500/30 rounded-xl focus:border-orange-500"
              />
            </div> */}

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {quickLinks.map((link, index) => {
                const IconComponent = link.icon
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className="glass-effect rounded-xl p-4 hover:scale-105 transition-all duration-300 border border-orange-200/30 dark:border-orange-500/30 group"
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{link.title}</p>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Browse by Category</h2>
            <p className="text-lg text-muted-foreground">
              Find detailed guides and documentation for every aspect of NoxaProxy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={index}
                  className={`glass-effect ${category.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
                >
                  <CardHeader className="pb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground flex items-center justify-between">
                      {category.title}
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      {category.articles} articles
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Popular Articles */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-foreground">Popular Articles</h2>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <Card
                    key={index}
                    className="glass-effect border-orange-200/30 dark:border-orange-500/30 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2 group-hover:text-orange-500 transition-colors">
                            {article.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            <span>{article.readTime}</span>
                            <span>{article.views}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 transition-colors ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-foreground">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card
                    key={index}
                    className="glass-effect border-green-200/30 dark:border-green-500/30 hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Still Need Help?</h2>
            <p className="text-lg text-muted-foreground">Our support team is available 24/7 to assist you</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="glass-effect border-blue-200/30 dark:border-blue-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">Chat with our support team via Crisp</p>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                  Start Chat
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-200/30 dark:border-purple-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Discord</h3>
                <p className="text-sm text-muted-foreground mb-4">Join our community server</p>
                <Link href={"https://discord.gg/8tR6RBNgUW"}>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                    Join Discord
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glass-effect border-cyan-200/30 dark:border-cyan-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Telegram</h3>
                <p className="text-sm text-muted-foreground mb-4">Message us on Telegram</p>
                <Link href={"https://t.me/noxaproxy"}>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white">
                    Open Telegram
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
