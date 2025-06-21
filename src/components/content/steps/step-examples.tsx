"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Play } from "lucide-react"
import type { PromptData } from "../veo3-prompt-wizard"
import wizardStepsConfig from "@/data/veo3/wizard-steps.json"

interface StepExamplesProps {
  data: PromptData
  loadExample: (data: Partial<PromptData>) => void
}

interface ExamplePrompt {
  id: string
  title: string
  genre: string
  thumbnail: string
  promptSnippet: string
  fullData: Partial<PromptData>
}

export function StepExamples({ loadExample }: StepExamplesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [examplePrompts, setExamplePrompts] = useState<ExamplePrompt[]>([])
  const [filteredExamples, setFilteredExamples] = useState<ExamplePrompt[]>([])

  useEffect(() => {
    // Load example prompts from JSON config
    const examplesConfig = wizardStepsConfig.steps["7"]?.config?.examplePrompts || []
    setExamplePrompts(examplesConfig)
    setFilteredExamples(examplesConfig)
  }, [])

  useEffect(() => {
    const filtered = examplePrompts.filter(
      (example) =>
        example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        example.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        example.promptSnippet.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredExamples(filtered)
  }, [searchTerm, examplePrompts])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="example-search">Search Examples</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="example-search"
            placeholder="Search by title, genre, or description..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExamples.map((example) => (
          <Card key={example.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={example.thumbnail || "/placeholder.svg"}
                alt={example.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <h4 className="font-medium">{example.title}</h4>
                <Badge variant="secondary" className="text-xs">
                  {example.genre}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{example.promptSnippet}</p>
              <Button size="sm" className="w-full" onClick={() => loadExample(example.fullData)}>
                Use This Example
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExamples.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No examples found matching your search.</p>
        </div>
      )}
    </div>
  )
}
