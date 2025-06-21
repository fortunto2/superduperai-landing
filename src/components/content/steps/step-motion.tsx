"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import type { PromptData } from "../veo3-prompt-wizard"
import wizardStepsConfig from "@/data/veo3/wizard-steps.json"

interface StepMotionProps {
  data: PromptData
  updateField: (field: keyof PromptData, value: string | boolean | number) => void
}

interface MovementType {
  value: string
  description: string
  image: string
}

export function StepMotion({ data, updateField }: StepMotionProps) {
  const [movementTypes, setMovementTypes] = useState<MovementType[]>([])

  useEffect(() => {
    // Load movement types from JSON config
    const motionConfig = wizardStepsConfig.steps["4"]?.config
    if (motionConfig) {
      setMovementTypes(motionConfig.movementTypes || [])
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="camera-movement"
          checked={data.cameraMovement}
          onCheckedChange={(checked) => updateField("cameraMovement", checked)}
        />
        <Label htmlFor="camera-movement">Add Camera Movement</Label>
      </div>

      {data.cameraMovement && (
        <div className="space-y-6 pl-6 border-l-2 border-zinc-800">
          <div className="space-y-3">
            <Label>Movement Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
              {movementTypes.map((movement) => (
                <Card
                  key={movement.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    data.movementType === movement.value ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => updateField("movementType", movement.value)}
                >
                  <div className="aspect-video">
                    <img
                      src={movement.image || "/placeholder.svg"}
                      alt={movement.value}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-1">
                      <h4 className="font-medium">{movement.value}</h4>
                      <p className="text-xs text-muted-foreground">{movement.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Movement Speed: {data.movementSpeed}%</Label>
            <Slider
              value={[data.movementSpeed || 50]}
              onValueChange={(value: number[]) => updateField("movementSpeed", value[0])}
              max={100}
              min={10}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slow (10%)</span>
              <span>Medium (50%)</span>
              <span>Fast (100%)</span>
            </div>
          </div>

          <div className="p-3 bg-zinc-900 rounded-lg">
            <p className="text-sm text-zinc-300">
              🎬 Preview: {data.movementType} at {data.movementSpeed}% speed
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
