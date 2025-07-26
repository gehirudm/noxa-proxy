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
                        src="/images/proxy-setup-banner.jpg"
                        alt="Proxy Setup Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Article Content */}
            <section>
                <h2>Understanding Proxies</h2>
                <p>
                    A proxy server acts as an intermediary between your device and the internet. When you use a proxy,
                    your requests are routed through the proxy server before reaching the destination website. This
                    process masks your original IP address and can provide benefits like enhanced privacy, security,
                    and access to geo-restricted content.
                </p>

                <h2>Types of Proxies</h2>
                <p>
                    Before setting up your first proxy, it's important to understand the different types available
                    and choose the one that best suits your needs:
                </p>

                <ul>
                    <li>
                        <strong>Residential Proxies:</strong> These use IP addresses assigned by Internet Service Providers
                        to homeowners. They appear as regular users, making them ideal for accessing websites that block
                        datacenter IPs.
                    </li>
                    <li>
                        <strong>Datacenter Proxies:</strong> Hosted in data centers, these proxies offer high speeds but
                        are more easily detected as proxies. They're perfect for tasks where speed is more important than
                        anonymity.
                    </li>
                    <li>
                        <strong>Mobile Proxies:</strong> These use mobile network IP addresses, making them excellent for
                        mobile app testing and accessing platforms that require mobile verification.
                    </li>
                </ul>

                <h2>Step 1: Choose Your Proxy Type</h2>
                <p>
                    For beginners, we recommend starting with residential proxies as they offer a good balance between
                    performance and anonymity. If you're primarily concerned with speed and cost, datacenter proxies
                    might be a better choice.
                </p>

                <div className="bg-muted p-4 rounded-lg my-6">
                    <p className="text-sm italic">
                        <strong>Pro Tip:</strong> Consider your specific use case when selecting a proxy type. For web scraping
                        and accessing geo-restricted content, residential proxies work best. For high-speed operations where
                        anonymity is less critical, datacenter proxies are ideal.
                    </p>
                </div>

                <h2>Step 2: Generate Your Proxy URL</h2>
                <p>
                    Once you've selected your proxy type, you'll need to generate a proxy URL. This URL contains all the
                    information needed to connect to the proxy server, including authentication details and server address.
                </p>

                <p>
                    You can use our proxy URL generator tool to create the correct format for your chosen proxy type:
                </p>

                <h2>Step 3: Configure Your Browser or Application</h2>
                <p>
                    Now that you have your proxy URL, you need to configure your browser or application to use it.
                    Here's how to set up a proxy in popular browsers:
                </p>

                <h3>Google Chrome</h3>
                <ol>
                    <li>Click the three dots in the top-right corner and select "Settings"</li>
                    <li>Scroll down and click on "Advanced"</li>
                    <li>Under "System," click on "Open your computer's proxy settings"</li>
                    <li>In the proxy settings window, enable "Manual proxy setup"</li>
                    <li>Enter the proxy server address and port</li>
                    <li>If authentication is required, you'll be prompted to enter your username and password when you access a website</li>
                </ol>

                <h3>Firefox</h3>
                <ol>
                    <li>Click the three lines in the top-right corner and select "Settings"</li>
                    <li>Scroll down to "Network Settings" and click "Settings..."</li>
                    <li>Select "Manual proxy configuration"</li>
                    <li>Enter the HTTP Proxy server address and port</li>
                    <li>Check "Also use this proxy for HTTPS" if you want to use the same proxy for secure connections</li>
                    <li>Click "OK" to save your settings</li>
                </ol>

                <h2>Step 4: Test Your Proxy Connection</h2>
                <p>
                    After setting up your proxy, it's important to verify that it's working correctly:
                </p>

                <ol>
                    <li>
                        Visit an IP checking website like <a href="https://whatismyipaddress.com" target="_blank" rel="noopener noreferrer">whatismyipaddress.com</a>
                    </li>
                    <li>
                        Verify that the displayed IP address is different from your actual IP address
                    </li>
                    <li>
                        Check that the location shown matches the expected location of your proxy server
                    </li>
                </ol>

                <h2>Troubleshooting Common Issues</h2>
                <p>
                    If you encounter problems with your proxy connection, try these solutions:
                </p>

                <ul>
                    <li>
                        <strong>Connection Errors:</strong> Double-check your proxy URL format and ensure you've entered the correct server address and port.
                    </li>
                    <li>
                        <strong>Authentication Issues:</strong> Verify that your username and password are correct and properly formatted in the proxy URL.
                    </li>
                    <li>
                        <strong>Slow Connection:</strong> Try switching to a different server location or proxy type. Datacenter proxies generally offer faster speeds than residential proxies.
                    </li>
                </ul>

                <h2>Conclusion</h2>
                <p>
                    Setting up your first proxy might seem daunting, but with the right guidance, it's a straightforward process.
                    Remember to choose the appropriate proxy type for your needs, generate the correct proxy URL, and configure
                    your applications properly. With your proxy set up, you can enjoy enhanced privacy, security, and access to
                    geo-restricted content.
                </p>

                <p>
                    For more advanced proxy usage and configuration tips, check out our other articles or contact our support team.
                </p>
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