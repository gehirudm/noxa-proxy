"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, User, Tag, Share2, Bookmark, ThumbsUp } from "lucide-react"
import { ProxyUrlGenerator } from "@/app/dashboard/proxies/components/proxy-url-generator"

export default function HowToSetupFirstProxyArticle() {
    return (
        <article className="prose prose-gray dark:prose-invert max-w-none">
            {/* Article Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">How to Setup Your First Proxy</h1>

                <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 mb-6">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>5 min read</span>
                    </div>
                    <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>By NoxaProxy Team</span>
                    </div>
                    <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        <span>Beginner, Setup Guide</span>
                    </div>
                </div>

                <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
                    <Image
                        src="/articles/proxy-setup-banner.png"
                        alt="Proxy Setup Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Article Content */}
            <section className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Understanding Proxies</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        A proxy server acts as an intermediary between your device and the internet. When you use a proxy,
                        your requests are routed through the proxy server before reaching the destination website. This
                        process masks your original IP address and can provide benefits like enhanced privacy, security,
                        and access to geo-restricted content.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Types of Proxies</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Before setting up your first proxy, it's important to understand the different types available
                        and choose the one that best suits your needs:
                    </p>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="overflow-hidden border-border">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">Residential Proxies</h3>
                                <p className="text-sm text-muted-foreground">
                                    These use IP addresses assigned by Internet Service Providers
                                    to homeowners. They appear as regular users, making them ideal for accessing websites that block
                                    datacenter IPs.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden border-border">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">Datacenter Proxies</h3>
                                <p className="text-sm text-muted-foreground">
                                    Hosted in data centers, these proxies offer high speeds but
                                    are more easily detected as proxies. They're perfect for tasks where speed is more important than
                                    anonymity.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden border-border">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">Mobile Proxies</h3>
                                <p className="text-sm text-muted-foreground">
                                    These use mobile network IP addresses, making them excellent for
                                    mobile app testing and accessing platforms that require mobile verification.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Step 1: Choose Your Proxy Type</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        For beginners, we recommend starting with residential proxies as they offer a good balance between
                        performance and anonymity. If you're primarily concerned with speed and cost, datacenter proxies
                        might be a better choice.
                    </p>

                    <div className="bg-accent/20 border border-accent/30 p-6 rounded-lg my-6">
                        <p className="text-sm italic">
                            <strong className="font-semibold">Pro Tip:</strong> Consider your specific use case when selecting a proxy type. For web scraping
                            and accessing geo-restricted content, residential proxies work best. For high-speed operations where
                            anonymity is less critical, datacenter proxies are ideal.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Step 2: Generate Your Proxy URL</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Once you've selected your proxy type, you'll need to generate a proxy URL. This URL contains all the
                        information needed to connect to the proxy server, including authentication details and server address.
                    </p>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                        You can use our proxy URL generator tool to create the correct format for your chosen proxy type:
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Step 3: Configure Your Browser or Application</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        Now that you have your proxy URL, you need to configure your browser or application to use it.
                        Here's how to set up a proxy in popular browsers:
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="overflow-hidden border-border">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                    <Image src="/sites/google.com.png" width={24} height={24} alt="Chrome" className="mr-2" />
                                    Google Chrome
                                </h3>
                                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                                    <li>Click the three dots in the top-right corner and select "Settings"</li>
                                    <li>Scroll down and click on "Advanced"</li>
                                    <li>Under "System," click on "Open your computer's proxy settings"</li>
                                    <li>In the proxy settings window, enable "Manual proxy setup"</li>
                                    <li>Enter the proxy server address and port</li>
                                    <li>If authentication is required, you'll be prompted to enter your username and password when you access a website</li>
                                </ol>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden border-border">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                    <Image src="/sites/firefox.com.png" width={24} height={24} alt="Firefox" className="mr-2" />
                                    Firefox
                                </h3>
                                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                                    <li>Click the three lines in the top-right corner and select "Settings"</li>
                                    <li>Scroll down to "Network Settings" and click "Settings..."</li>
                                    <li>Select "Manual proxy configuration"</li>
                                    <li>Enter the HTTP Proxy server address and port</li>
                                    <li>Check "Also use this proxy for HTTPS" if you want to use the same proxy for secure connections</li>
                                    <li>Click "OK" to save your settings</li>
                                </ol>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Step 4: Test Your Proxy Connection</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        After setting up your proxy, it's important to verify that it's working correctly:
                    </p>

                    <Card className="overflow-hidden border-border">
                        <CardContent className="p-6">
                            <ol className="space-y-3 text-muted-foreground">
                                <li className="flex items-start">
                                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 mr-3 shrink-0">1</span>
                                    <span>Visit an IP checking website like <a href="https://whatismyipaddress.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">whatismyipaddress.com</a></span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 mr-3 shrink-0">2</span>
                                    <span>Verify that the displayed IP address is different from your actual IP address</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 mr-3 shrink-0">3</span>
                                    <span>Check that the location shown matches the expected location of your proxy server</span>
                                </li>
                            </ol>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Troubleshooting Common Issues</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        If you encounter problems with your proxy connection, try these solutions:
                    </p>

                    <div className="space-y-4">
                        <Card className="overflow-hidden border-border">
                            <CardContent className="p-4 flex items-start">
                                <div className="bg-destructive/10 text-destructive p-2 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Connection Errors</h4>
                                    <p className="text-sm text-muted-foreground">Double-check your proxy URL format and ensure you've entered the correct server address and port.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden border-border">
                            <CardContent className="p-4 flex items-start">
                                <div className="bg-destructive/10 text-destructive p-2 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M8 11h8" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Authentication Issues</h4>
                                    <p className="text-sm text-muted-foreground">Verify that your username and password are correct and properly formatted in the proxy URL.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden border-border">
                            <CardContent className="p-4 flex items-start">
                                <div className="bg-destructive/10 text-destructive p-2 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" /><path d="M13 2v7h7" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Slow Connection</h4>
                                    <p className="text-sm text-muted-foreground">Try switching to a different server location or proxy type. Datacenter proxies generally offer faster speeds than residential proxies.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Conclusion</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Setting up your first proxy might seem daunting, but with the right guidance, it's a straightforward process.
                        Remember to choose the appropriate proxy type for your needs, generate the correct proxy URL, and configure
                        your applications properly. With your proxy set up, you can enjoy enhanced privacy, security, and access to
                        geo-restricted content.
                    </p>

                    <p className="text-muted-foreground leading-relaxed">
                        For more advanced proxy usage and configuration tips, check out our other articles or contact our support team.
                    </p>
                </div>
            </section>

            {/* Article Footer */}
            <div className="mt-12 pt-6 border-t border-border">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <Button variant="ghost" size="sm" className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            <span>Helpful</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center">
                            <Bookmark className="h-4 w-4 mr-2" />
                            <span>Save</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center">
                            <Share2 className="h-4 w-4 mr-2" />
                            <span>Share</span>
                        </Button>
                    </div>
                    <div>
                        <Link href="/support">
                            <Button variant="outline" size="sm">
                                Need Help?
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}