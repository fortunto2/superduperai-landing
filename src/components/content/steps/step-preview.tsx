"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Save, Download, Check, RefreshCw } from "lucide-react"
import type { PromptData } from "../veo3-prompt-wizard"

interface StepPreviewProps {
  data: PromptData
  generatePrompt: () => string
  updateField?: (field: keyof PromptData, value: string | boolean | number) => void
}

export function StepPreview({ data, generatePrompt }: StepPreviewProps) {
  const [prompt, setPrompt] = useState(generatePrompt())
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setPrompt(generatePrompt())
  }, [data, generatePrompt])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleSave = () => {
    // Simulate saving to templates
    const template = {
      name: `${data.genre || data.trend || "Custom"} Template`,
      data: data,
      prompt: prompt,
      createdAt: new Date().toISOString(),
    }

    const savedTemplates = JSON.parse(localStorage.getItem("veo3-templates") || "[]")
    savedTemplates.push(template)
    localStorage.setItem("veo3-templates", JSON.stringify(savedTemplates))

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `veo3-prompt-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleRegeneratePrompt = () => {
    setPrompt(generatePrompt())
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="border-zinc-800 bg-zinc-950">
        <CardHeader>
          <CardTitle>Prompt Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.trend && (
              <div>
                <Label className="text-xs text-muted-foreground">Trend</Label>
                <Badge variant="secondary">{data.trend}</Badge>
              </div>
            )}
            {data.genre && (
              <div>
                <Label className="text-xs text-muted-foreground">Genre</Label>
                <Badge variant="secondary">{data.genre}</Badge>
              </div>
            )}
            {data.shotType && (
              <div>
                <Label className="text-xs text-muted-foreground">Shot Type</Label>
                <Badge variant="outline">{data.shotType}</Badge>
              </div>
            )}
            {data.povType && (
              <div>
                <Label className="text-xs text-muted-foreground">POV</Label>
                <Badge variant="outline">{data.povType}</Badge>
              </div>
            )}
          </div>

          {data.sceneDescription && (
            <div className="mt-2">
              <Label className="text-xs text-muted-foreground">Scene</Label>
              <p className="text-sm mt-1 line-clamp-2">{data.sceneDescription}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Prompt */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="generated-prompt">Generated VEO 3 Prompt</Label>
          <Button variant="ghost" size="sm" onClick={handleRegeneratePrompt}>
            <RefreshCw className="w-4 h-4 mr-1" /> Regenerate
          </Button>
        </div>
        <Textarea
          id="generated-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={8}
          className="font-mono text-sm bg-zinc-900 border-zinc-800"
        />
        <p className="text-xs text-muted-foreground">You can edit the prompt above before copying or saving.</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleCopy} className="flex-1 min-w-[120px]">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? "Copied!" : "Copy to Clipboard"}
        </Button>

        <Button variant="outline" onClick={handleSave} className="flex-1 min-w-[120px]">
          {saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saved ? "Saved!" : "Save Template"}
        </Button>

        <Button variant="outline" onClick={handleDownload} className="flex-1 min-w-[120px]">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Validation */}
      <Card className="border-zinc-800 bg-zinc-950">
        <CardHeader>
          <CardTitle className="text-sm">Prompt Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${data.sceneDescription ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm">Scene description provided</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${data.shotType ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className="text-sm">Camera setup configured</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${data.genre || data.trend ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className="text-sm">Genre or trend selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${prompt.length > 50 ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className="text-sm">Prompt length adequate ({prompt.length} characters)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reference Video */}
      {data.trendVideoUrl && (
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-sm">Reference Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full">
              <iframe
                src={getYouTubeEmbedUrl(data.trendVideoUrl) || ""}
                className="w-full h-full"
                allowFullScreen
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Your prompt is inspired by: {data.trend}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Extract YouTube video ID from URL
function getYouTubeEmbedUrl(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = match && match[2].length === 11 ? match[2] : null
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}
