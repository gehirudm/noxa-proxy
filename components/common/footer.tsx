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
                                href="https://discord.gg/8tR6RBNgUW"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                                aria-label="Discord"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                </svg>
                            </Link>
                            <Link
                                href="https://t.me/noxaproxy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                aria-label="Telegram"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                </svg>
                            </Link>
                            <Link
                                href="/help"
                                className="text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                aria-label="Help Center"
                            >
                                <HelpCircle className="h-5 w-5" />
                            </Link>
                            <Link
                                href="mailto:support@noxaproxy.com"
                                className="text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                                aria-label="Email Support"
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