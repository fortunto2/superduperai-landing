"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Youtube } from "lucide-react"
import type { PromptData } from "../veo3-prompt-wizard"
import wizardStepsConfig from "@/data/veo3/wizard-steps.json"

interface StepTrendProps {
  data: PromptData
  updateField: (field: keyof PromptData, value: string | boolean | number) => void
}

interface VideoTrend {
  id: string
  name: string
  description: string
  thumbnail: string
  videoUrl: string
}

export function StepTrend({ data, updateField }: StepTrendProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [customUrl, setCustomUrl] = useState("")
  const [videoTrends, setVideoTrends] = useState<VideoTrend[]>([])

  useEffect(() => {
    // Load video trends from JSON config
    const trendConfig = wizardStepsConfig.steps["1"]?.config?.videoTrends || []
    setVideoTrends(trendConfig)
  }, [])

  const filteredTrends = videoTrends.filter(
    (trend) =>
      trend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trend.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleTrendSelect = (trend: VideoTrend) => {
    updateField("trend", trend.name)
    updateField("trendVideoUrl", trend.videoUrl)
  }

  const handleCustomUrlSubmit = () => {
    if (customUrl) {
      updateField("trend", "Custom Video Reference")
      updateField("trendVideoUrl", customUrl)
    }
  }

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    const videoId = match && match[2].length === 11 ? match[2] : null
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search Video Trends</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search for video trends..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTrends.map((trend) => (
            <Card
              key={trend.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.trend === trend.name ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleTrendSelect(trend)}
            >
              <div className="aspect-video relative">
                <img
                  src={trend.thumbnail || "/placeholder.svg"}
                  alt={trend.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Youtube className="w-12 h-12 text-red-500 opacity-80" />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">{trend.name}</h3>
                <p className="text-sm text-muted-foreground">{trend.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Or paste your own YouTube URL</Label>
        <div className="flex gap-2">
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={customUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomUrl(e.target.value)}
          />
          <Button onClick={handleCustomUrlSubmit} disabled={!customUrl}>
            Use This
          </Button>
        </div>
      </div>

      {data.trendVideoUrl && (
        <div className="space-y-3">
          <Label>Selected Reference Video</Label>
          <div className="aspect-video w-full">
            {getYouTubeEmbedUrl(data.trendVideoUrl) ? (
              <iframe
                src={getYouTubeEmbedUrl(data.trendVideoUrl) || ""}
                className="w-full h-full"
                allowFullScreen
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p>Invalid YouTube URL</p>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Selected trend: <Badge>{data.trend}</Badge>
          </p>
        </div>
      )}
    </div>
  )
}
