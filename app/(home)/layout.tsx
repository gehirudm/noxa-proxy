import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    Zap,
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
import { ReactNode } from "react"

interface RootLayoutProps {
    children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 w-full">
            {/* Header */}
            <header className="w-full glass-effect border-b border-cyan-500/20 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex h-16 items-center justify-between px-4 md:px-6">
                        <Link href={"/"}>
                            <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 shadow-lg shadow-cyan-500/25">
                                    <Zap className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                                    NoxaProxy
                                </span>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8">
                            <div className="flex items-center space-x-1">
                                <Link
                                    href="/#products"
                                    className="text-sm font-medium text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
                                >
                                    Products
                                </Link>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Link
                                    href="/#products"
                                    className="text-sm font-medium text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
                                >
                                    Pricing
                                </Link>
                            </div>
                            <Link
                                href="locations"
                                className="text-sm font-medium text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
                            >
                                Location
                            </Link>
                            <Link
                                href="use-cases"
                                className="text-sm font-medium text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
                            >
                                Use case
                            </Link>
                            <Link
                                href="help"
                                className="text-sm font-medium text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
                            >
                                Help center
                            </Link>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <Link
                                href="auth"
                                className="text-sm font-medium text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
                            >
                                <Button
                                    variant="ghost"
                                    className="hidden md:inline-flex text-slate-600 hover:text-cyan-600 hover:bg-cyan-500/10 dark:text-slate-300 dark:hover:text-cyan-400 dark:hover:bg-cyan-500/10"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link
                                href="auth?mode=register"
                                className="text-sm font-medium text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
                            >
                                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300">
                                    Create account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        <div className="col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 shadow-lg shadow-cyan-500/25">
                                    <Zap className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                                    NoxaProxy
                                </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Premium proxy solutions for businesses of all sizes. Access our global network of residential and datacenter proxies.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                    <span className="sr-only">Twitter</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                    <span className="sr-only">GitHub</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                    <span className="sr-only">Discord</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M9 12h6"></path>
                                        <path d="M9 16h6"></path>
                                        <path d="M7.5 4h9c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5h-9c-.83 0-1.5-.67-1.5-1.5v-13c0-.83.67-1.5 1.5-1.5Z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Products</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Residential Proxies
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Datacenter Proxies
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Mobile Proxies
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Static Residential
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Documentation
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        API Reference
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Tutorials
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Press Kit
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        Cookie Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400">
                                        GDPR
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            © {new Date().getFullYear()} NoxaProxy. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 text-sm">
                                Privacy
                            </Link>
                            <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 text-sm">
                                Terms
                            </Link>
                            <Link href="#" className="text-slate-600 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 text-sm">
                                Sitemap
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}