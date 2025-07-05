import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function ApiSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Integrate natively in any programming language
            </h2>
            <p className="text-lg text-muted-foreground">
              StreamLine proxies are fully compatible with any programming environment or custom stack.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-foreground">Complete Proxy Documentation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-foreground">
                  Supported Natively by Hundreds of Programming Languages & Frameworks
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-foreground">Built-in IP Rotation Options</span>
              </div>
            </div>

            <Button className="flame-gradient hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              See Documentation →
            </Button>

            <div className="flex items-center space-x-4 pt-4">
              <div className="w-10 h-10 glass-effect rounded-lg flex items-center justify-center hover:scale-110 transition-transform border border-orange-200/30 dark:border-orange-500/30">
                <span className="text-xs font-mono font-bold text-foreground">JS</span>
              </div>
              <div className="w-10 h-10 glass-effect rounded-lg flex items-center justify-center hover:scale-110 transition-transform border border-green-200/30 dark:border-green-500/30">
                <span className="text-xs font-mono font-bold text-foreground">PY</span>
              </div>
              <div className="w-10 h-10 glass-effect rounded-lg flex items-center justify-center hover:scale-110 transition-transform border border-yellow-200/30 dark:border-yellow-500/30">
                <span className="text-xs font-mono font-bold text-foreground">PHP</span>
              </div>
              <div className="w-10 h-10 glass-effect rounded-lg flex items-center justify-center hover:scale-110 transition-transform border border-red-200/30 dark:border-red-500/30">
                <span className="text-xs font-mono font-bold text-foreground">GO</span>
              </div>
              <div className="w-10 h-10 glass-effect rounded-lg flex items-center justify-center hover:scale-110 transition-transform border border-orange-200/30 dark:border-orange-500/30">
                <span className="text-xs font-mono font-bold text-foreground">C#</span>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 text-green-400 font-mono text-sm overflow-x-auto border border-green-200/30 dark:border-green-500/30">
            <div className="flex space-x-4 mb-4 text-xs">
              <span className="text-orange-400">🐍 Python</span>
              <span className="text-green-400">⬢ Node.js</span>
              <span className="text-yellow-400">🐘 PHP</span>
              <span className="text-red-400">🔷 Go</span>
              <span className="text-orange-400">☕ Java</span>
              <span className="text-yellow-400">🔷 C#</span>
              <button className="text-muted-foreground ml-auto hover:text-foreground transition-colors">📋 Copy</button>
            </div>
            <pre className="text-sm">
              {`import requests

username = "USER-zone-ZONE"
password = "PASS"
proxy = "gw.streamline.co:8888"

proxies = {
    'http': f'http://{username}:{password}@{proxy}',
    'https': f'http://{username}:{password}@{proxy}'
}

response = requests.request(
    'GET',
    'https://streamline.com/cdn-cgi/trace',
    proxies=proxies,
)`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
