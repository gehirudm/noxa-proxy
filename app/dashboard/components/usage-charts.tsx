import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UsageCharts() {
  const timeRanges = ["1D", "7D", "1M"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Rotating Usage</CardTitle>
          <div className="flex space-x-1">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={range === "1D" ? "secondary" : "ghost"}
                size="sm"
                className={range === "1D" ? "bg-muted" : "text-muted-foreground"}
              >
                {range}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground mb-4">0.00 GB</div>
          <div className="h-32 bg-muted rounded flex items-end justify-center">
            <div className="text-muted-foreground text-sm">No data available</div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>11:00</span>
            <span>15:00</span>
            <span>19:00</span>
            <span>23:00</span>
            <span>03:00</span>
            <span>07:00</span>
            <span>11:00</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Budget Usage</CardTitle>
          <div className="flex space-x-1">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={range === "1D" ? "secondary" : "ghost"}
                size="sm"
                className={range === "1D" ? "bg-muted" : "text-muted-foreground"}
              >
                {range}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground mb-4">0.00 GB</div>
          <div className="h-32 bg-muted rounded flex items-end justify-center">
            <div className="text-muted-foreground text-sm">No data available</div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>11:37</span>
            <span>15:37</span>
            <span>19:37</span>
            <span>23:37</span>
            <span>03:37</span>
            <span>07:37</span>
            <span>11:37</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
