"use client"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, User } from "lucide-react"
import type { PromptData, Character } from "../veo3-prompt-wizard"

interface StepSpeechProps {
  data: PromptData
  updateCharacter: (characterId: string, field: keyof Character, value: string | boolean) => void
  addCharacter: () => void
  removeCharacter: (characterId: string) => void
}

const languages = [
  "English",
  "Russian",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Chinese",
  "Portuguese",
  "Arabic",
  "Hindi",
  "Korean",
]

const voiceEmotions = [
  "Neutral",
  "Happy",
  "Sad",
  "Angry",
  "Excited",
  "Calm",
  "Mysterious",
  "Dramatic",
  "Whispered",
  "Shouting",
  "Confident",
  "Nervous",
  "Seductive",
  "Authoritative",
  "Pleading",
  "Mocking",
  "Tender",
  "Harsh",
  "Breathless",
  "Trembling",
]

const characterTypes = [
  "Young man",
  "Young woman",
  "Middle-aged man",
  "Middle-aged woman",
  "Elderly man",
  "Elderly woman",
  "Teenager",
  "Child",
  "Professional",
  "Artist",
  "Worker",
  "Student",
  "Businessman",
  "Casual person",
]

const facialExpressions = [
  "Eyes scanning the ground",
  "Looking off into distance",
  "Direct eye contact with camera",
  "Eyes darting nervously",
  "Squinting",
  "Wide-eyed",
  "Half-closed eyes",
  "Rolling eyes",
  "Lips tremble",
  "Slight smile",
  "Frown",
  "Pursed lips",
  "Open mouth",
  "Biting lip",
  "Raised eyebrows",
  "Furrowed brow",
  "Tilted head",
  "Nodding",
  "Shaking head",
]

const bodyLanguage = [
  "Spreads both arms wide",
  "Hands to chest",
  "Points outward",
  "Arms crossed",
  "Hands in pockets",
  "Fidgeting with hands",
  "Gesturing emphatically",
  "Still and composed",
  "Leaning forward",
  "Leaning back",
  "Shoulders slumped",
  "Straight posture",
  "Pacing",
  "Standing still",
  "Sitting relaxed",
  "Tense body position",
]

const emotionalStates = [
  "Swallowing emotion",
  "Controlled theatricality",
  "Barely contained anger",
  "Overwhelming joy",
  "Deep contemplation",
  "Nervous energy",
  "Quiet confidence",
  "Hidden vulnerability",
  "Suppressed laughter",
  "Fighting back tears",
  "Internal struggle",
  "Peaceful acceptance",
  "Mounting tension",
  "Relief washing over",
  "Anticipation building",
  "Disappointment settling in",
]

const sequenceExamples = [
  "First looks down, then makes eye contact",
  "Starts speaking confidently, then voice breaks",
  "Begins with small gestures, then becomes more animated",
  "Initially calm, then emotion builds",
  "Tries to speak but just inhales instead",
  "Opens mouth to speak, then closes it and looks away",
]

const speechExamples = [
  "Hello, my name is...",
  "I can't believe this is happening",
  "Wait, let me explain",
  "This is exactly what I was talking about",
  "You don't understand",
  "I've been waiting for this moment",
  "Something's not right here",
  "Listen to me carefully",
  "I have something important to tell you",
  "This changes everything",
]

export function StepSpeech({ data, updateCharacter, addCharacter, removeCharacter }: StepSpeechProps) {
  const [activeCharacter, setActiveCharacter] = useState(data.characters[0]?.id || "")

  const currentCharacter = data.characters.find((char) => char.id === activeCharacter) || data.characters[0]

  if (!currentCharacter) return null

  return (
    <div className="space-y-6">
      {/* Character Selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <Label className="text-lg font-medium">Characters ({data.characters.length}/3)</Label>
        </div>
        <Button
          onClick={addCharacter}
          disabled={data.characters.length >= 3}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Character
        </Button>
      </div>

      {/* Character Tabs */}
      <div className="flex flex-wrap gap-2">
        {data.characters.map((character) => (
          <div key={character.id} className="flex items-center gap-1">
            <Button
              variant={activeCharacter === character.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCharacter(character.id)}
              className="flex items-center gap-1"
            >
              <User className="w-3 h-3" />
              {character.name}
            </Button>
            {data.characters.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  removeCharacter(character.id)
                  if (activeCharacter === character.id) {
                    setActiveCharacter(data.characters[0]?.id || "")
                  }
                }}
                className="p-1 h-8 w-8 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Character Configuration */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            {currentCharacter.name} Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="character" className="w-full">
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="character">Character</TabsTrigger>
              <TabsTrigger value="speech">Speech</TabsTrigger>
              <TabsTrigger value="facial">Facial</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="emotion">Emotion</TabsTrigger>
              <TabsTrigger value="sequence">Sequence</TabsTrigger>
            </TabsList>

            <TabsContent value="character" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Character Name</Label>
                  <Input
                    placeholder="Character 1"
                    value={currentCharacter.name}
                    onChange={(e) => updateCharacter(currentCharacter.id, "name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Character Type</Label>
                  <Select
                    value={currentCharacter.characterType}
                    onValueChange={(value) => updateCharacter(currentCharacter.id, "characterType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select character type" />
                    </SelectTrigger>
                    <SelectContent>
                      {characterTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Character Description</Label>
                <Input
                  placeholder="e.g., wearing a leather jacket, tired eyes, holding a coffee cup"
                  value={currentCharacter.characterDescription}
                  onChange={(e) => updateCharacter(currentCharacter.id, "characterDescription", e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="speech" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`enable-speech-${currentCharacter.id}`}
                  checked={currentCharacter.enableSpeech}
                  onCheckedChange={(checked) => updateCharacter(currentCharacter.id, "enableSpeech", checked)}
                />
                <Label htmlFor={`enable-speech-${currentCharacter.id}`}>
                  Enable Speech for {currentCharacter.name}
                </Label>
              </div>

              {currentCharacter.enableSpeech && (
                <div className="space-y-4 pl-6 border-l-2 border-zinc-800">
                  <div className="space-y-2">
                    <Label>Speech Text</Label>
                    <Textarea
                      placeholder="What does the character say? e.g., 'Hello, my name is John and I can't believe this is happening'"
                      value={currentCharacter.speechText}
                      onChange={(e) => updateCharacter(currentCharacter.id, "speechText", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Speech Examples</Label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                      {speechExamples.map((example) => (
                        <Badge
                          key={example}
                          variant="outline"
                          className="cursor-pointer hover:bg-zinc-800"
                          onClick={() => updateCharacter(currentCharacter.id, "speechText", example)}
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={currentCharacter.language}
                        onValueChange={(value) => updateCharacter(currentCharacter.id, "language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Voice Quality</Label>
                      <Select
                        value={currentCharacter.voiceEmotion}
                        onValueChange={(value) => updateCharacter(currentCharacter.id, "voiceEmotion", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select voice emotion" />
                        </SelectTrigger>
                        <SelectContent>
                          {voiceEmotions.map((emotion) => (
                            <SelectItem key={emotion} value={emotion}>
                              {emotion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {currentCharacter.speechText && (
                    <div className="p-3 bg-blue-950/20 border border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-300">
                        <strong>Preview:</strong> {currentCharacter.name} says "{currentCharacter.speechText}"
                        {currentCharacter.language !== "English" && ` in ${currentCharacter.language}`}
                        {currentCharacter.voiceEmotion !== "Neutral" &&
                          ` with ${currentCharacter.voiceEmotion.toLowerCase()} voice`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="facial" className="space-y-4">
              <div className="space-y-2">
                <Label>Facial Expression & Eye Direction</Label>
                <Textarea
                  placeholder="e.g., He looks off, eyes scanning the ground. His lips tremble."
                  value={currentCharacter.facialExpression}
                  onChange={(e) => updateCharacter(currentCharacter.id, "facialExpression", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Quick Examples</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                  {facialExpressions.map((expression) => (
                    <Badge
                      key={expression}
                      variant="outline"
                      className="cursor-pointer hover:bg-zinc-800"
                      onClick={() => updateCharacter(currentCharacter.id, "facialExpression", expression)}
                    >
                      {expression}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="body" className="space-y-4">
              <div className="space-y-2">
                <Label>Body Language & Gestures</Label>
                <Textarea
                  placeholder="e.g., He spreads both arms wide like delivering a dramatic speech. Big gesture, then brings hands to his chest."
                  value={currentCharacter.bodyLanguage}
                  onChange={(e) => updateCharacter(currentCharacter.id, "bodyLanguage", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Quick Examples</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                  {bodyLanguage.map((gesture) => (
                    <Badge
                      key={gesture}
                      variant="outline"
                      className="cursor-pointer hover:bg-zinc-800"
                      onClick={() => updateCharacter(currentCharacter.id, "bodyLanguage", gesture)}
                    >
                      {gesture}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emotion" className="space-y-4">
              <div className="space-y-2">
                <Label>Deep Emotional State</Label>
                <Textarea
                  placeholder="e.g., Controlled theatricality. He's swallowing emotion. His throat tightens."
                  value={currentCharacter.deepEmotion}
                  onChange={(e) => updateCharacter(currentCharacter.id, "deepEmotion", e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Go deeper than surface level - describe the internal emotional struggle
                </p>
              </div>

              <div className="space-y-2">
                <Label>Emotional Examples</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                  {emotionalStates.map((state) => (
                    <Badge
                      key={state}
                      variant="outline"
                      className="cursor-pointer hover:bg-zinc-800"
                      onClick={() => updateCharacter(currentCharacter.id, "deepEmotion", state)}
                    >
                      {state}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sequence" className="space-y-4">
              <div className="space-y-2">
                <Label>Action Sequence ("This then That")</Label>
                <Textarea
                  placeholder="e.g., He tries to speak but just inhales instead. First looks down, then makes eye contact."
                  value={currentCharacter.actionSequence}
                  onChange={(e) => updateCharacter(currentCharacter.id, "actionSequence", e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Describe a sequence of actions - what happens first, then what happens next
                </p>
              </div>

              <div className="space-y-2">
                <Label>Sequence Examples</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                  {sequenceExamples.map((sequence) => (
                    <Badge
                      key={sequence}
                      variant="outline"
                      className="cursor-pointer hover:bg-zinc-800"
                      onClick={() => updateCharacter(currentCharacter.id, "actionSequence", sequence)}
                    >
                      {sequence}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* All Characters Preview */}
      {data.characters.some((char) => char.characterType || char.facialExpression || char.speechText) && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-sm">All Characters Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.characters.map((character) => {
              const hasContent =
                character.characterType ||
                character.facialExpression ||
                character.bodyLanguage ||
                character.deepEmotion ||
                character.speechText
              if (!hasContent) return null

              return (
                <div key={character.id} className="p-3 border border-zinc-700 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">{character.name}</h4>
                  <div className="space-y-1 text-xs">
                    {character.characterType && (
                      <p>
                        <strong>Type:</strong> {character.characterType}
                        {character.characterDescription && ` (${character.characterDescription})`}
                      </p>
                    )}
                    {character.facialExpression && (
                      <p>
                        <strong>Facial:</strong> {character.facialExpression}
                      </p>
                    )}
                    {character.bodyLanguage && (
                      <p>
                        <strong>Body:</strong> {character.bodyLanguage}
                      </p>
                    )}
                    {character.deepEmotion && (
                      <p>
                        <strong>Emotion:</strong> {character.deepEmotion}
                      </p>
                    )}
                    {character.actionSequence && (
                      <p>
                        <strong>Sequence:</strong> {character.actionSequence}
                      </p>
                    )}
                    {character.enableSpeech && character.speechText && (
                      <p>
                        <strong>Speech:</strong> "{character.speechText}"
                        {character.language !== "English" && ` (${character.language})`}
                        {character.voiceEmotion !== "Neutral" && ` - ${character.voiceEmotion} voice`}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Director Tips */}
      <Card className="border-blue-800 bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-sm text-blue-300">🎬 Director Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-blue-200 space-y-1">
          <p>• Each character can have unique speech, appearance, and emotions</p>
          <p>• Write actual dialogue text for more realistic speech generation</p>
          <p>• Use different languages for multilingual scenes</p>
          <p>• Guide each character's performance like directing actors</p>
          <p>• Create character interactions and relationships</p>
          <p>• VEO3 can handle multiple characters with individual characteristics</p>
        </CardContent>
      </Card>
    </div>
  )
}
