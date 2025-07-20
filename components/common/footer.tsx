import Link from "next/link"
import { Zap, MessageCircle, Send, HelpCircle, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer
            id="contact"
            className="bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-900 dark:to-blue-900 text-slate-900 dark:text-white py-16 border-t border-cyan-500/20"
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-5 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 shadow-lg">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                                NoxaProxy
                            </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Premium proxy services for data collection, web scraping, and online privacy.
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                href="#"
                                className="text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                            >
                                <MessageCircle className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-slate-500 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                            >
                                <Send className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            >
                                <HelpCircle className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                            >
                                <Mail className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-cyan-500">Products</h3>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                            <li>
                                <Link href="/#products" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                                    Premium Residential
                                </Link>
                            </li>
                            <li>
                                <Link href="/#products" className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                                    Static Residential
                                </Link>
                            </li>
                            <li>
                                <Link href="/#products" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                                    Mobile Proxy
                                </Link>
                            </li>
                            <li>
                                <Link href="/#products" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                                    Datacenter Proxy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-teal-500">Sites We Support</h3>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                            <li>
                                <Link href="#" className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                                    YouTube & Social Media
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                                    E-commerce Platforms
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                                    Search Engines
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                                    Streaming Services
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                                    View All Sites →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-blue-500">Top Proxy Locations</h3>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                            <li>
                                <Link href="/locations" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                                    🇺🇸 United States
                                </Link>
                            </li>
                            <li>
                                <Link href="/locations" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                                    🇬🇧 United Kingdom
                                </Link>
                            </li>
                            <li>
                                <Link href="/locations" className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                                    🇩🇪 Germany
                                </Link>
                            </li>
                            <li>
                                <Link href="/locations" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                                    🇨🇦 Canada
                                </Link>
                            </li>
                            <li>
                                <Link href="/locations" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                                    🇫🇷 France
                                </Link>
                            </li>
                            <li>
                                <Link href="/locations" className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                                    🇧🇷 Brazil
                                </Link>
                            </li>
                            <li>
                                <Link href="/locations" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                                    🇮🇳 India
                                </Link>
                            </li>
                            <li>
                                <Link href="/locations" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                                    View All Locations →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-green-500">Support</h3>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                            <li>
                                <Link href="/help" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="https://discord.gg/8tR6RBNgUW" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                                    Discord Support
                                </Link>
                            </li>
                            <li>
                                <Link href="https://t.me/datasnow" className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                                    Telegram Chat
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
                                    Live Chat (Crisp)
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                                    Email Support
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-300 dark:border-slate-700 mt-12 pt-8 text-center text-slate-500 dark:text-slate-400">
                    <p>
                        &copy; {new Date().getFullYear()} NoxaProxy. All rights reserved. Built with care for developers
                        worldwide.
                    </p>
                </div>
            </div>
        </footer>
    )
}