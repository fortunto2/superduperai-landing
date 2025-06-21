"use client"

import { useState, useReducer, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { StepTrend } from "./steps/step-trend"
import { StepGenre } from "./steps/step-genre"
import { StepSpeech } from "./steps/step-speech"
import { StepCamera } from "./steps/step-camera"
import { StepMotion } from "./steps/step-motion"
import { StepScene } from "./steps/step-scene"
import { StepPreview } from "./steps/step-preview"

export interface Character {
  id: string
  name: string
  characterType: string
  characterDescription: string
  facialExpression: string
  bodyLanguage: string
  deepEmotion: string
  actionSequence: string
  speechText: string
  language: string
  voiceEmotion: string
  enableSpeech: boolean
}

export interface PromptData {
  trend: string
  trendVideoUrl: string
  genre: string
  styleTag: string
  characters: Character[]
  shotType: string
  povType: string
  cameraMovement: boolean
  movementType: string
  movementSpeed: number
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
  selectedExample?: string
  // Legacy fields for backward compatibility
  enableSpeech: boolean
  language: string
  voiceEmotion: string
  characterType?: string
  characterDescription?: string
  facialExpression?: string
  bodyLanguage?: string
  deepEmotion?: string
  actionSequence?: string
}

interface PromptWizardProps {
  initialValues?: Partial<PromptData>
  onComplete?: (prompt: string) => void
  className?: string
}

const createDefaultCharacter = (id: string, name: string): Character => ({
  id,
  name,
  characterType: "",
  characterDescription: "",
  facialExpression: "",
  bodyLanguage: "",
  deepEmotion: "",
  actionSequence: "",
  speechText: "",
  language: "English",
  voiceEmotion: "Neutral",
  enableSpeech: false,
})

const initialState: PromptData = {
  trend: "",
  trendVideoUrl: "",
  genre: "",
  styleTag: "",
  characters: [createDefaultCharacter("char1", "Character 1")],
  shotType: "",
  povType: "",
  cameraMovement: false,
  movementType: "",
  movementSpeed: 50,
  sceneDescription: "",
  expression: "",
  emotion: "",
  audioDesign: "",
  lighting: "",
  // Legacy fields
  enableSpeech: false,
  language: "English",
  voiceEmotion: "Neutral",
}

type Action =
  | { type: "UPDATE_FIELD"; field: keyof PromptData; value: string | boolean | number | Character[] }
  | { type: "UPDATE_CHARACTER"; characterId: string; field: keyof Character; value: string | boolean }
  | { type: "ADD_CHARACTER" }
  | { type: "REMOVE_CHARACTER"; characterId: string }
  | { type: "RESET" }
  | { type: "LOAD_EXAMPLE"; data: Partial<PromptData> }

function promptReducer(state: PromptData, action: Action): PromptData {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value }
    case "UPDATE_CHARACTER":
      return {
        ...state,
        characters: state.characters.map((char) =>
          char.id === action.characterId ? { ...char, [action.field]: action.value } : char,
        ),
      }
    case "ADD_CHARACTER": {
      if (state.characters.length >= 3) return state
      const newId = `char${state.characters.length + 1}`
      const newName = `Character ${state.characters.length + 1}`
      return {
        ...state,
        characters: [...state.characters, createDefaultCharacter(newId, newName)],
      }
    }
    case "REMOVE_CHARACTER":
      return {
        ...state,
        characters: state.characters.filter((char) => char.id !== action.characterId),
      }
    case "RESET":
      return initialState
    case "LOAD_EXAMPLE":
      return { ...state, ...action.data }
    default:
      return state
  }
}

const steps = [
  { id: "trend", title: "Video Trend", component: StepTrend },
  { id: "genre", title: "Genre & Style", component: StepGenre },
  { id: "speech", title: "Characters & Speech", component: StepSpeech },
  { id: "camera", title: "Camera Setup", component: StepCamera },
  { id: "motion", title: "Motion & Dynamics", component: StepMotion },
  { id: "scene", title: "Scene & Style", component: StepScene },
  { id: "preview", title: "Preview & Export", component: StepPreview },
]

const randomData = {
  trends: ["Я — промпт", "Cinematic Portrait", "Neon Nightlife", "Vintage Film Look", "Slow Motion Emotion"],
  genres: [
    "Cyberpunk Noir",
    "80s Horror",
    "Surreal Dream",
    "Documentary Style",
    "Fashion Editorial",
    "Cinematic Drama",
  ],
  styleTags: ["Hyperrealistic", "Film Grain", "Neon Aesthetic", "Chiaroscuro", "Vintage Filter", "High Contrast"],
  shotTypes: ["close-up", "medium-shot", "wide-shot", "panoramic", "extreme-close-up"],
  povTypes: ["first-person", "third-person", "over-shoulder", "fixed-static", "bird-eye"],
  movementTypes: ["Pan Left", "Pan Right", "Dolly Forward", "Zoom In", "Handheld Style", "Smooth Tracking"],
  characterTypes: ["Young woman", "Young man", "Middle-aged woman", "Professional", "Artist", "Student"],
  emotions: ["Happy", "Mysterious", "Confident", "Nervous", "Dramatic", "Calm"],
  languages: ["English", "Russian", "Spanish", "French", "German", "Japanese"],
  speechTexts: [
    "Hello, this is exactly what I was looking for",
    "This place is absolutely incredible, I can't believe my eyes",
    "Let me tell you something that will change everything",
    "I've been waiting for this moment my entire life",
    "The future is here and it's more amazing than we imagined",
    "Sometimes the most beautiful things are found in unexpected places",
    "This is just the beginning of something extraordinary"
  ],
  sceneDescriptions: [
    "A glamorous woman with an afro hairstyle and gold jewellery shares a luxurious outdoor pool with a calm alligator at night",
    "A person walks through an incredible futuristic city commenting on what surprises them the most",
    "Neon-lit alley with rain-soaked streets and flickering holographic advertisements",
    "A cozy coffee shop scene with warm lighting and people having conversations",
    "An artist working in a sunlit studio surrounded by colorful paintings",
  ],
  lighting: [
    "Cinematic lighting",
    "Moody and soft with candlelight reflections",
    "Harsh shadows",
    "Golden hour glow",
    "Neon reflections",
  ],
  audioDesign: [
    "Slow ambient electronic music",
    "City ambience with distant traffic",
    "Soft rain patter",
    "Cafe atmosphere",
    "Wind through trees",
  ],
}

export function Veo3PromptWizard({ initialValues, onComplete, className }: PromptWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [promptData, dispatch] = useReducer(promptReducer, { ...initialState, ...initialValues })
  const [preserveFilledFields, setPreserveFilledFields] = useState(true)

  const generateRandomPrompt = useCallback(() => {
    try {
      console.log("🎲 Generating random prompt, preserveFilledFields:", preserveFilledFields)
      const getRandomItem = (array: string[]) => array[Math.floor(Math.random() * array.length)]

    // Helper function to check if a field is filled
    const isFieldFilled = (value: string | boolean | number | undefined): boolean => {
      if (typeof value === 'string') return value.trim() !== ''
      if (typeof value === 'boolean') return true // booleans are always considered "set"
      if (typeof value === 'number') return value > 0
      return false
    }

    // Helper function to check if character field is filled
    const isCharacterFieldFilled = (character: Character, field: keyof Character): boolean => {
      const value = character[field]
      if (field === 'enableSpeech') return true // always consider enableSpeech as set
      return isFieldFilled(value)
    }

    // Generate random character, preserving existing values if needed
    const existingCharacter = promptData.characters[0] || createDefaultCharacter("char1", "Character 1")
    const randomCharacter = createDefaultCharacter("char1", "Character 1")
    
    // Set character fields, preserving filled ones if preserve mode is on
    randomCharacter.characterType = (preserveFilledFields && isCharacterFieldFilled(existingCharacter, 'characterType')) 
      ? existingCharacter.characterType 
      : getRandomItem(randomData.characterTypes)
    
    randomCharacter.characterDescription = (preserveFilledFields && isCharacterFieldFilled(existingCharacter, 'characterDescription'))
      ? existingCharacter.characterDescription
      : "wearing stylish clothing with expressive eyes"
    
    randomCharacter.facialExpression = (preserveFilledFields && isCharacterFieldFilled(existingCharacter, 'facialExpression'))
      ? existingCharacter.facialExpression  
      : "Direct eye contact with camera, slight smile"
    
    randomCharacter.bodyLanguage = (preserveFilledFields && isCharacterFieldFilled(existingCharacter, 'bodyLanguage'))
      ? existingCharacter.bodyLanguage
      : "Confident posture, hands gesturing naturally"
    
    randomCharacter.deepEmotion = (preserveFilledFields && isCharacterFieldFilled(existingCharacter, 'deepEmotion'))
      ? existingCharacter.deepEmotion
      : "Controlled confidence with subtle vulnerability"
    
    randomCharacter.actionSequence = (preserveFilledFields && isCharacterFieldFilled(existingCharacter, 'actionSequence'))
      ? existingCharacter.actionSequence  
      : "performs expressive gestures while speaking"
    
    randomCharacter.enableSpeech = (preserveFilledFields && existingCharacter.enableSpeech !== undefined)
      ? existingCharacter.enableSpeech
      : true
    
    randomCharacter.speechText = (preserveFilledFields && isCharacterFieldFilled(existingCharacter, 'speechText'))
      ? existingCharacter.speechText
      : getRandomItem(randomData.speechTexts)
    
    randomCharacter.language = (preserveFilledFields && isCharacterFieldFilled(existingCharacter, 'language'))
      ? existingCharacter.language
      : getRandomItem(randomData.languages)
    
    randomCharacter.voiceEmotion = (preserveFilledFields && isCharacterFieldFilled(existingCharacter, 'voiceEmotion'))
      ? existingCharacter.voiceEmotion
      : getRandomItem(randomData.emotions)

    const randomPromptData: Partial<PromptData> = {
      trend: (preserveFilledFields && isFieldFilled(promptData.trend)) ? promptData.trend : getRandomItem(randomData.trends),
      genre: (preserveFilledFields && isFieldFilled(promptData.genre)) ? promptData.genre : getRandomItem(randomData.genres),
      styleTag: (preserveFilledFields && isFieldFilled(promptData.styleTag)) ? promptData.styleTag : getRandomItem(randomData.styleTags),
      characters: [randomCharacter],
      shotType: (preserveFilledFields && isFieldFilled(promptData.shotType)) ? promptData.shotType : getRandomItem(randomData.shotTypes),
      povType: (preserveFilledFields && isFieldFilled(promptData.povType)) ? promptData.povType : getRandomItem(randomData.povTypes),
      cameraMovement: (preserveFilledFields && promptData.cameraMovement !== undefined) ? promptData.cameraMovement : Math.random() > 0.5,
      movementType: (preserveFilledFields && isFieldFilled(promptData.movementType)) ? promptData.movementType : getRandomItem(randomData.movementTypes),
      movementSpeed: (preserveFilledFields && promptData.movementSpeed > 0) ? promptData.movementSpeed : Math.floor(Math.random() * 9 + 1) * 10,
      sceneDescription: (preserveFilledFields && isFieldFilled(promptData.sceneDescription)) ? promptData.sceneDescription : getRandomItem(randomData.sceneDescriptions),
      visualStyle: (preserveFilledFields && isFieldFilled(promptData.visualStyle)) ? promptData.visualStyle : "Cinematic",
      mainSubject: (preserveFilledFields && isFieldFilled(promptData.mainSubject)) ? promptData.mainSubject : "Person making intense eye contact with camera",
      lighting: (preserveFilledFields && isFieldFilled(promptData.lighting)) ? promptData.lighting : getRandomItem(randomData.lighting),
      audioDesign: (preserveFilledFields && isFieldFilled(promptData.audioDesign)) ? promptData.audioDesign : getRandomItem(randomData.audioDesign),
      includeSubtitles: (preserveFilledFields && promptData.includeSubtitles !== undefined) ? promptData.includeSubtitles : Math.random() > 0.7,
      colorPalette: (preserveFilledFields && isFieldFilled(promptData.colorPalette)) ? promptData.colorPalette : "Moody with warm tones",
    }

      dispatch({ type: "LOAD_EXAMPLE", data: randomPromptData })
      setCurrentStep(steps.length - 1) // Go to last step (Preview)
    } catch (error) {
      console.error("Error generating random prompt:", error)
      // Don't crash the app, just log the error
    }
  }, [promptData, preserveFilledFields])

  const updateField = useCallback((field: keyof PromptData, value: string | boolean | number | Character[]) => {
    dispatch({ type: "UPDATE_FIELD", field, value })
  }, [])

  const updateCharacter = useCallback((characterId: string, field: keyof Character, value: string | boolean) => {
    dispatch({ type: "UPDATE_CHARACTER", characterId, field, value })
  }, [])

  const addCharacter = useCallback(() => {
    dispatch({ type: "ADD_CHARACTER" })
  }, [])

  const removeCharacter = useCallback((characterId: string) => {
    dispatch({ type: "REMOVE_CHARACTER", characterId })
  }, [])

  const resetWizard = useCallback(() => {
    dispatch({ type: "RESET" })
    setCurrentStep(0)
  }, [])

  const generateFullRandomPrompt = useCallback(() => {
    console.log("🎲 Generating FULL random prompt (ignoring preserve)")
    const tempPreserve = preserveFilledFields
    setPreserveFilledFields(false)
    
    // Use setTimeout to ensure state update is processed
    setTimeout(() => {
      generateRandomPrompt()
      setPreserveFilledFields(tempPreserve)
    }, 10)
  }, [generateRandomPrompt, preserveFilledFields])

  const generatePrompt = useCallback(() => {
    const sections = []

    // Start with visual style if available
    if (promptData.visualStyle) {
      sections.push(`A ${promptData.visualStyle.toLowerCase()} scene`)
    }

    // Add scene description (most important)
    if (promptData.sceneDescription) {
      sections.push(promptData.sceneDescription)
    }

    // Add main subject
    if (promptData.mainSubject) {
      sections.push(`Main subject: ${promptData.mainSubject}`)
    }

    // Add background setting
    if (promptData.backgroundSetting || promptData.customSetting) {
      const setting = promptData.customSetting || promptData.backgroundSetting
      sections.push(`Setting: ${setting}`)
    }

    // Add characters
    const characterSections: string[] = []
    promptData.characters.forEach((character, _index) => {
      const shouldInclude = character.characterType || character.facialExpression || character.bodyLanguage || character.deepEmotion || character.actionSequence || (character.enableSpeech && character.speechText)
      
      if (shouldInclude) {
        const characterParts = []

        // Character description
        if (character.characterType) {
          let characterDesc = character.characterType
          if (character.characterDescription) {
            characterDesc += ` (${character.characterDescription})`
          }
          characterParts.push(characterDesc)
        }

        // Character performance
        if (character.facialExpression) characterParts.push(character.facialExpression)
        if (character.bodyLanguage) characterParts.push(character.bodyLanguage)
        if (character.deepEmotion) characterParts.push(character.deepEmotion)
        if (character.actionSequence) characterParts.push(character.actionSequence)

        // Character speech
        if (character.enableSpeech && character.speechText) {
          let speechPart = `speaking`
          if (character.language !== "English") {
            speechPart += ` in ${character.language.toLowerCase()}`
          }
          speechPart += `: "${character.speechText}"`
          if (character.voiceEmotion !== "Neutral") {
            speechPart += ` with ${character.voiceEmotion.toLowerCase()} voice`
          }
          characterParts.push(speechPart)
        }

        if (characterParts.length > 0) {
          const prefix = promptData.characters.length > 1 ? `${character.name}: ` : ""
          const characterSection = `${prefix}${characterParts.join(". ")}`
          characterSections.push(characterSection)
        }
      }
    })

    if (characterSections.length > 0) {
      sections.push(characterSections.join("\n"))
    }

    // Camera section
    const cameraParts = []
    if (promptData.shotType) cameraParts.push(`Camera shot: ${promptData.shotType}`)
    if (promptData.povType) cameraParts.push(`POV: ${promptData.povType}`)
    if (promptData.cameraMovement && promptData.movementType) {
      cameraParts.push(`Camera movement: ${promptData.movementType} at ${promptData.movementSpeed}% speed`)
    }
    if (cameraParts.length > 0) {
      sections.push(cameraParts.join("\n"))
    }

    // Visual elements section
    const visualParts = []
    if (promptData.lighting) visualParts.push(`Lighting: ${promptData.lighting}`)
    if (promptData.colorPalette) visualParts.push(`Color palette: ${promptData.colorPalette}`)
    if (visualParts.length > 0) {
      sections.push(visualParts.join("\n"))
    }

    // Audio and subtitles section
    const audioParts = []
    if (promptData.audioDesign) audioParts.push(`Audio: ${promptData.audioDesign}`)
    if (promptData.includeSubtitles === false) {
      audioParts.push("No subtitles")
    } else if (promptData.includeSubtitles && promptData.subtitleLanguage) {
      audioParts.push(`Include subtitles in ${promptData.subtitleLanguage}`)
    }
    if (audioParts.length > 0) {
      sections.push(audioParts.join("\n"))
    }

    // Legacy fields
    const legacyParts = []
    if (promptData.characters.length === 1 && !promptData.characters[0].facialExpression && promptData.expression) {
      legacyParts.push(`Expression: ${promptData.expression}`)
    }
    if (promptData.characters.length === 1 && !promptData.characters[0].deepEmotion && promptData.emotion) {
      legacyParts.push(`Emotion: ${promptData.emotion}`)
    }
    if (legacyParts.length > 0) {
      sections.push(legacyParts.join("\n"))
    }

    // Add trend if available
    if (promptData.trend) sections.push(`Inspired by trend: ${promptData.trend}`)

    return sections.join("\n\n")
  }, [promptData])

  const canGoNext = () => {
    switch (currentStep) {
      case 0: // Trend
        return true // Optional
      case 1: // Genre
        return promptData.genre !== ""
      case 2: // Speech
        return true // Optional
      case 3: // Camera
        return promptData.shotType !== ""
      case 4: // Motion
        return true // Optional
      case 5: // Scene
        return promptData.sceneDescription !== ""
      case 6: // Preview
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const finalPrompt = generatePrompt()
      onComplete?.(finalPrompt)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const CurrentStepComponent = steps[currentStep].component
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className={`max-w-4xl mx-auto p-4 space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">VEO 3 Prompt Wizard</h1>
        <p className="text-muted-foreground">Create professional video prompts step by step</p>
      </div>

      {/* Progress */}
      <Card className="border-zinc-800 bg-zinc-950">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="flex flex-wrap gap-2">
              {steps.map((step, index) => (
                <Badge
                  key={step.id}
                  variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
                  className={`text-xs cursor-pointer ${
                    index === currentStep
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : index < currentStep
                        ? "bg-green-900/50 hover:bg-green-900/70"
                        : ""
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  {step.title}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card className="border-zinc-800 bg-zinc-950">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {steps[currentStep].title}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="preserve-fields"
                  checked={preserveFilledFields}
                  onCheckedChange={setPreserveFilledFields}
                />
                <Label htmlFor="preserve-fields" className="text-xs text-muted-foreground">
                  Preserve filled fields
                </Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={generateRandomPrompt} className="text-xs">
                  <Shuffle className="w-3 h-3 mr-1" />
                  Random
                </Button>
                <Button variant="outline" size="sm" onClick={generateFullRandomPrompt} className="text-xs" title="Generate completely random prompt ignoring preserve setting">
                  <Shuffle className="w-3 h-3 mr-1" />
                  Full Random
                </Button>
                <Button variant="outline" size="sm" onClick={resetWizard} className="text-xs">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            data={promptData}
            updateField={updateField}
            onUpdate={updateField}
            updateCharacter={updateCharacter}
            addCharacter={addCharacter}
            removeCharacter={removeCharacter}
            generatePrompt={generatePrompt}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button onClick={handleNext} disabled={!canGoNext()}>
          {currentStep === steps.length - 1 ? "Complete" : "Next"}
          {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
      {/* Always visible preview */}
      <Card className="border-green-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-green-400">Generated VEO 3 Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-lg font-medium bg-zinc-950 p-4 rounded-md border border-zinc-800">
            {generatePrompt()}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
