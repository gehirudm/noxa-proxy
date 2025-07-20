import { Footer } from "@/components/common/footer"
import { Header } from "@/components/common/header"
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
            <Header></Header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <Footer></Footer>
        </div>
    )
}