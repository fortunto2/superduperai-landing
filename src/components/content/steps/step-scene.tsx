"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Palette, Camera, Sparkles } from "lucide-react"
import { VEO3Guidelines } from "../veo3-guidelines"
import { PromptData } from "../veo3-prompt-wizard"


interface StepData {
  sceneDescription: string
  visualStyle?: string
  mainSubject?: string
  backgroundSetting?: string
  customSetting?: string
  colorPalette?: string
  includeSubtitles?: boolean
  subtitleLanguage?: string
  expression: string
  emotion: string
  audioDesign: string
  lighting: string
}

interface StepSceneProps {
  data: PromptData
  onUpdate: (field: keyof PromptData, value: string | boolean) => void
}

const emotionExamples = [
  "Panic",
  "Joy",
  "Sorrow",
  "Anger",
  "Surprise",
  "Disgust",
  "Fear",
  "Anticipation",
  "Trust",
  "Controlled theatricality",
  "Subtle tension",
  "Overwhelming happiness",
  "Quiet contemplation",
  "Nervous excitement",
  "Stoic determination",
  "Playful mischief",
  "Deep melancholy",
]

const expressionExamples = [
  "Lips tremble",
  "Arms spread wide",
  "Eyes widen in shock",
  "Furrowed brow",
  "Gentle smile",
  "Clenched fists",
  "Shoulders slumped",
  "Head tilted curiously",
  "Pacing nervously",
  "Hands gesturing emphatically",
  "Tears welling up",
  "Confident stance",
]

const lightingExamples = [
  "Cinematic lighting",
  "Harsh shadows",
  "Soft diffused light",
  "Greenish tint",
  "Golden hour glow",
  "Blue moonlight",
  "Neon reflections",
  "Dramatic backlighting",
  "High-key lighting",
  "Low-key lighting with deep shadows",
  "Split lighting on face",
  "Rim lighting with silhouette effect",
  "Moody and soft with candlelight reflections",
  "Natural sunlight through windows",
  "Fluorescent office lighting",
  "Warm tungsten lighting",
]

const audioExamples = [
  "Distant thunder",
  "Soft rain patter",
  "Heartbeat",
  "Muffled voices",
  "City ambience",
  "Wind through trees",
  "Electronic hum",
  "Vinyl record crackle",
  "Ticking clock",
  "Children laughing in distance",
  "Footsteps on wet pavement",
  "Synthesizer drone",
  "Orchestral swells",
  "Slow ambient electronic music",
  "Water ripple sounds",
  "Traffic noise",
  "Birds chirping",
  "Crowd murmur",
]

const colorPalettes = [
  "Bold and bright",
  "Pastel tones",
  "Muted earth tones",
  "Monochrome",
  "Deep slate gray and ocean blue",
  "Warm gold tones",
  "Cool blue and silver",
  "Vintage sepia",
  "High contrast black and white",
  "Neon colors",
  "Desaturated",
  "Vibrant rainbow",
  "Sunset oranges and reds",
  "Forest greens",
  "Purple and pink gradient",
]

const backgroundSettings = [
  "City street at night",
  "Forest during sunrise",
  "Futuristic laboratory",
  "Traditional village",
  "Luxurious outdoor pool area",
  "Modern office building",
  "Abandoned warehouse",
  "Cozy coffee shop",
  "Mountain peak",
  "Beach at sunset",
  "Underground tunnel",
  "Rooftop garden",
  "Library interior",
  "Hospital corridor",
  "Art gallery",
  "Concert hall",
  "Kitchen",
  "Bedroom",
]

const visualStyles = [
  "Cinematic",
  "Realistic",
  "Animated",
  "Stylized",
  "Surreal",
  "Documentary",
  "Film noir",
  "Vintage",
  "Modern",
  "Abstract",
  "Hyperrealistic",
  "Cartoon",
  "Anime",
  "Stop motion",
  "Time-lapse",
]

const lightingOptions = [
  "Natural daylight",
  "Golden hour",
  "Blue hour",
  "Cinematic lighting",
  "Moody and soft with candlelight reflections",
  "High contrast dramatic",
  "Neon lighting",
  "Studio lighting",
  "Backlit silhouette",
  "Warm indoor lighting"
]

const audioDesignOptions = [
  "Ambient soundscape",
  "Cinematic score",
  "Electronic music",
  "Acoustic guitar",
  "Piano melody",
  "Nature sounds",
  "Urban atmosphere",
  "Orchestral",
  "Jazz background",
  "Silence/minimal"
]

const visualStyleOptions = [
  "Photorealistic",
  "Cinematic",
  "Documentary style",
  "Fashion photography",
  "Street photography",
  "Portrait style",
  "Artistic/Creative",
  "Vintage film look",
  "Modern commercial",
  "Editorial style"
]

const colorPaletteOptions = [
  "Natural colors",
  "Warm tones",
  "Cool tones",
  "Monochrome",
  "High contrast",
  "Pastel colors",
  "Vibrant/Saturated",
  "Muted/Desaturated",
  "Golden hour palette",
  "Neon colors"
]

export function StepScene({ data, onUpdate }: StepSceneProps) {
  const [stepData, setStepData] = useState<StepData>({
    sceneDescription: "",
    visualStyle: "",
    mainSubject: "",
    backgroundSetting: "",
    customSetting: "",
    colorPalette: "",
    includeSubtitles: false,
    subtitleLanguage: "English",
    expression: "",
    emotion: "",
    audioDesign: "",
    lighting: "",
  })

  useEffect(() => {
    const config = {
      sceneExamples: [
        "A glamorous woman with an afro hairstyle and gold jewellery shares a luxurious outdoor pool with a calm alligator at night",
        "A person walks through an incredible futuristic city commenting on what surprises them the most",
        "Neon-lit alley with rain-soaked streets and flickering holographic advertisements",
        "A cozy coffee shop scene with warm lighting and people having conversations",
        "An artist working in a sunlit studio surrounded by colorful paintings",
      ],
      lightingExamples: [
        "Cinematic lighting",
        "Moody and soft with candlelight reflections",
        "Natural daylight streaming through windows",
        "Neon signs reflecting on wet pavement",
        "Golden hour warm glow"
      ],
      audioExamples: [
        "Ambient city sounds with distant music",
        "Soft piano melody in the background",
        "Nature sounds with birds chirping",
        "Electronic ambient soundscape",
        "Acoustic guitar with subtle reverb"
      ]
    }

    setStepData(prev => ({
      ...prev,
      sceneDescription: data.sceneDescription || "",
      visualStyle: data.visualStyle || "",
      mainSubject: data.mainSubject || "",
      backgroundSetting: data.backgroundSetting || "",
      customSetting: data.customSetting || "",
      colorPalette: data.colorPalette || "",
      includeSubtitles: data.includeSubtitles || false,
      subtitleLanguage: data.subtitleLanguage || "English",
      expression: data.expression || "",
      emotion: data.emotion || "",
      audioDesign: data.audioDesign || "",
      lighting: data.lighting || "",
    }))
  }, [data])

  const sceneExamples = [
    "A glamorous woman with an afro hairstyle and gold jewellery shares a luxurious outdoor pool with a calm alligator at night",
    "A person walks through an incredible futuristic city commenting on what surprises them the most",
    "Neon-lit alley with rain-soaked streets and flickering holographic advertisements",
    "A cozy coffee shop scene with warm lighting and people having conversations",
    "An artist working in a sunlit studio surrounded by colorful paintings",
    "A chef preparing an elaborate dish in a modern kitchen",
    "Two friends having an animated conversation on a rooftop overlooking the city",
    "A musician performing on stage with dramatic lighting and an engaged audience"
  ]

  const handleExampleClick = (example: string) => {
    setStepData(prev => ({ ...prev, sceneDescription: example }))
    onUpdate("sceneDescription", example)
  }

  return (
    <div className="space-y-6">
      {/* VEO 3 Guidelines */}
      <VEO3Guidelines />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Scene & Style</h2>
        <p className="text-muted-foreground">
          Describe your scene and set the visual style for your video
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Scene Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="scene-description">Main Scene</Label>
              <Textarea
                id="scene-description"
                placeholder="Describe the main scene, setting, and what&apos;s happening..."
                value={stepData.sceneDescription}
                onChange={(e) => {
                  setStepData(prev => ({ ...prev, sceneDescription: e.target.value }))
                  onUpdate("sceneDescription", e.target.value)
                }}
                rows={4}
              />
            </div>

            <div>
              <Label>Scene Examples</Label>
              <div className="grid gap-2 mt-2">
                {sceneExamples.slice(0, 3).map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-left h-auto p-3 whitespace-normal"
                    onClick={() => handleExampleClick(example)}
                  >
                    <div className="text-xs">{example}</div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Visual Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="visual-style">Style</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {visualStyleOptions.map((style) => (
                  <Button
                    key={style}
                    variant={stepData.visualStyle === style ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setStepData(prev => ({ ...prev, visualStyle: style }))
                      onUpdate("visualStyle", style)
                    }}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="color-palette">Color Palette</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {colorPaletteOptions.slice(0, 6).map((palette) => (
                  <Button
                    key={palette}
                    variant={stepData.colorPalette === palette ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setStepData(prev => ({ ...prev, colorPalette: palette }))
                      onUpdate("colorPalette", palette)
                    }}
                  >
                    {palette}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Lighting & Mood
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Lighting Style</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {lightingOptions.slice(0, 6).map((lighting) => (
                  <Button
                    key={lighting}
                    variant={stepData.lighting === lighting ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setStepData(prev => ({ ...prev, lighting: lighting }))
                      onUpdate("lighting", lighting)
                    }}
                  >
                    {lighting}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="emotion">Emotional Tone</Label>
              <Input
                id="emotion"
                placeholder="e.g., joyful, mysterious, dramatic..."
                value={stepData.emotion}
                onChange={(e) => {
                  setStepData(prev => ({ ...prev, emotion: e.target.value }))
                  onUpdate("emotion", e.target.value)
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Audio & Effects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Audio Design</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {audioDesignOptions.slice(0, 6).map((audio) => (
                  <Button
                    key={audio}
                    variant={stepData.audioDesign === audio ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setStepData(prev => ({ ...prev, audioDesign: audio }))
                      onUpdate("audioDesign", audio)
                    }}
                  >
                    {audio}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="subtitles"
                  checked={stepData.includeSubtitles}
                  onChange={(e) => {
                    setStepData(prev => ({ ...prev, includeSubtitles: e.target.checked }))
                    onUpdate("includeSubtitles", e.target.checked)
                  }}
                  className="rounded"
                />
                <Label htmlFor="subtitles">Include subtitles</Label>
              </div>

              {stepData.includeSubtitles && (
                <div>
                  <Label htmlFor="subtitle-language">Subtitle Language</Label>
                  <Input
                    id="subtitle-language"
                    value={stepData.subtitleLanguage}
                    onChange={(e) => {
                      setStepData(prev => ({ ...prev, subtitleLanguage: e.target.value }))
                      onUpdate("subtitleLanguage", e.target.value)
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Scene Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {[
              {
                title: "Urban Night Scene",
                description: "Neon-lit city street with rain reflections and moody lighting",
                scene: "A person walking down a neon-lit urban street at night, rain creating reflections on the wet pavement, with colorful signs and city lights in the background",
                lighting: "Neon lighting",
                audio: "Ambient city sounds with distant music",
                style: "Cinematic"
              },
              {
                title: "Cozy Interior",
                description: "Warm, intimate indoor setting with natural lighting",
                scene: "A person sitting by a large window in a cozy coffee shop, warm sunlight streaming in, with books and a steaming cup of coffee on the table",
                lighting: "Natural daylight",
                audio: "Soft piano melody in the background",
                style: "Documentary style"
              },
              {
                title: "Futuristic Tech",
                description: "High-tech environment with sleek, modern aesthetics",
                scene: "A person interacting with holographic displays in a futuristic control room, surrounded by glowing screens and advanced technology",
                lighting: "High contrast dramatic",
                audio: "Electronic ambient soundscape",
                style: "Modern commercial"
              }
            ].map((template, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => {
                  setStepData(prev => ({
                    ...prev,
                    sceneDescription: template.scene,
                    lighting: template.lighting,
                    audioDesign: template.audio,
                    visualStyle: template.style
                  }))
                  onUpdate("sceneDescription", template.scene)
                  onUpdate("lighting", template.lighting)
                  onUpdate("audioDesign", template.audio)
                  onUpdate("visualStyle", template.style)
                }}
              >
                <div>
                  <div className="font-semibold mb-1">{template.title}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {template.description}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.style}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.lighting}
                    </Badge>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scene Preview */}
      {stepData.sceneDescription && (
        <div className="p-4 bg-zinc-900 rounded-lg">
          <h4 className="font-medium mb-2">Scene Preview</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>Scene:</strong> {stepData.sceneDescription}
            </p>
            {stepData.visualStyle && (
              <p>
                <strong>Style:</strong> {stepData.visualStyle}
              </p>
            )}
            {stepData.mainSubject && (
              <p>
                <strong>Subject:</strong> {stepData.mainSubject}
              </p>
            )}
            {stepData.backgroundSetting && (
              <p>
                <strong>Setting:</strong> {stepData.backgroundSetting}
              </p>
            )}
            {stepData.customSetting && (
              <p>
                <strong>Custom Setting:</strong> {stepData.customSetting}
              </p>
            )}
            {stepData.lighting && (
              <p>
                <strong>Lighting:</strong> {stepData.lighting}
              </p>
            )}
            {stepData.colorPalette && (
              <p>
                <strong>Colors:</strong> {stepData.colorPalette}
              </p>
            )}
            {stepData.audioDesign && (
              <p>
                <strong>Audio:</strong> {stepData.audioDesign}
              </p>
            )}
            {stepData.includeSubtitles && (
              <p>
                <strong>Subtitles:</strong> {stepData.subtitleLanguage || "Yes"}
              </p>
            )}
            {stepData.includeSubtitles === false && (
              <p>
                <strong>Subtitles:</strong> No subtitles
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
