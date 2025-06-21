"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Lightbulb, AlertTriangle } from "lucide-react"

export function VEO3Guidelines() {
  return (
    <div className="space-y-4">
      <Card className="border-blue-800 bg-blue-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            VEO 3 Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <Badge variant="secondary" className="mb-2">Scene Description</Badge>
            <p className="text-muted-foreground">
              Be specific and detailed. Include lighting, setting, mood, and visual elements.
            </p>
          </div>
          <div>
            <Badge variant="secondary" className="mb-2">Camera Work</Badge>
            <p className="text-muted-foreground">
              Specify shot types, angles, and movements for cinematic results.
            </p>
          </div>
          <div>
            <Badge variant="secondary" className="mb-2">Character Details</Badge>
            <p className="text-muted-foreground">
              Include age, appearance, clothing, and emotional state for better consistency.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-800 bg-yellow-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            • Use genre-specific vocabulary for better style matching
          </p>
          <p className="text-muted-foreground">
            • Combine multiple elements: lighting + camera + mood
          </p>
          <p className="text-muted-foreground">
            • Reference popular trends for viral potential
          </p>
        </CardContent>
      </Card>

      <Card className="border-red-800 bg-red-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Avoid These
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            • Overly complex scenes with too many elements
          </p>
          <p className="text-muted-foreground">
            • Vague descriptions like &quot;nice&quot; or &quot;beautiful&quot;
          </p>
          <p className="text-muted-foreground">
            • Conflicting styles or contradictory instructions
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 