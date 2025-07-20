import Link from "next/link"
import { Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
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
                href="#products"
                className="text-sm font-medium text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
              >
                Products
              </Link>
            </div>
            <div className="flex items-center space-x-1">
              <Link
                href="#products"
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
  )
}