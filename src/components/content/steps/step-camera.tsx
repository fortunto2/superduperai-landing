"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import type { PromptData } from "../veo3-prompt-wizard"
import wizardStepsConfig from "@/data/veo3/wizard-steps.json"

interface StepCameraProps {
  data: PromptData
  updateField: (field: keyof PromptData, value: string | boolean | number) => void
}

interface ShotType {
  value: string
  label: string
  description: string
  image: string
}

interface PovType {
  value: string
  label: string
  description: string
  image: string
}

export function StepCamera({ data, updateField }: StepCameraProps) {
  const [shotTypes, setShotTypes] = useState<ShotType[]>([])
  const [povTypes, setPovTypes] = useState<PovType[]>([])

  useEffect(() => {
    // Load camera config from JSON
    const cameraConfig = wizardStepsConfig.steps["3"]?.config
    if (cameraConfig) {
      setShotTypes(cameraConfig.shotTypes || [])
      setPovTypes(cameraConfig.povTypes || [])
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Shot Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
          {shotTypes.map((shot) => (
            <Card
              key={shot.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.shotType === shot.value ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => updateField("shotType", shot.value)}
            >
              <div className="aspect-video">
                <img src={shot.image || "/placeholder.svg"} alt={shot.label} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-3">
                <div className="space-y-1">
                  <h4 className="font-medium">{shot.label}</h4>
                  <p className="text-xs text-muted-foreground">{shot.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Point of View</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
          {povTypes.map((pov) => (
            <Card
              key={pov.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.povType === pov.value ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => updateField("povType", pov.value)}
            >
              <div className="aspect-video">
                <img src={pov.image || "/placeholder.svg"} alt={pov.label} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-3">
                <div className="space-y-1">
                  <h4 className="font-medium">{pov.label}</h4>
                  <p className="text-xs text-muted-foreground">{pov.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {(data.shotType || data.povType) && (
        <div className="p-4 bg-zinc-900 rounded-lg">
          <p className="text-sm">
            <strong>Selected Camera Setup:</strong>
            {data.shotType && ` ${shotTypes.find((s) => s.value === data.shotType)?.label}`}
            {data.povType && ` with ${povTypes.find((p) => p.value === data.povType)?.label} perspective`}
          </p>
        </div>
      )}
    </div>
  )
}
