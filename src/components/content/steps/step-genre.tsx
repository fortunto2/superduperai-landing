"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import type { PromptData } from "../veo3-prompt-wizard"
import wizardStepsConfig from "@/data/veo3/wizard-steps.json"

interface StepGenreProps {
  data: PromptData
  updateField: (field: keyof PromptData, value: string | boolean | number) => void
}

interface Genre {
  name: string
  description: string
  image: string
}

export function StepGenre({ data, updateField }: StepGenreProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [genres, setGenres] = useState<Genre[]>([])
  const [styleTags, setStyleTags] = useState<string[]>([])

  useEffect(() => {
    // Load genres and style tags from JSON config
    const genreConfig = wizardStepsConfig.steps["2"]?.config
    if (genreConfig) {
      setGenres(genreConfig.genres || [])
      setStyleTags(genreConfig.styleTags || [])
    }
  }, [])

  const filteredGenres = genres.filter(
    (genre) =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genre.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search Genres</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search for genres..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Select Genre</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredGenres.map((genre) => (
              <Card
                key={genre.name}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  data.genre === genre.name ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => updateField("genre", genre.name)}
              >
                <div className="aspect-video">
                  <img
                    src={genre.image || "/placeholder.svg"}
                    alt={genre.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">{genre.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{genre.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Visual Style Tags</Label>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
          {styleTags.map((tag) => (
            <Badge
              key={tag}
              variant={data.styleTag === tag ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => updateField("styleTag", tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {(data.genre || data.styleTag) && (
        <div className="p-4 bg-zinc-900 rounded-lg">
          <p className="text-sm">
            <strong>Selected:</strong> {data.genre}
            {data.styleTag && ` • ${data.styleTag}`}
          </p>
        </div>
      )}
    </div>
  )
}
