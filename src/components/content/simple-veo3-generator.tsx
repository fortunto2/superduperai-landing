"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Shuffle, Sparkles, Loader2, Trash2, Settings, ChevronDown, ChevronUp } from "lucide-react";

interface PromptData {
  scene: string;
  style: string;
  camera: string;
  duration: string;
  character: string;
  action: string;
  lighting: string;
  mood: string;
  speech: string;
  language: string;
}

const PRESET_OPTIONS = {
  styles: [
    "Cinematic", "Documentary", "Artistic", "Realistic", "Dramatic", 
    "Vintage", "Modern", "Minimalist", "Colorful", "Black & White"
  ],
  cameras: [
    "Close-up", "Medium shot", "Wide shot", "Bird's eye view", "Low angle",
    "High angle", "Over-the-shoulder", "Tracking shot", "Static shot", "Handheld"
  ],
  durations: ["5 seconds", "10 seconds", "15 seconds", "30 seconds", "1 minute"],
  lighting: [
    "Natural lighting", "Golden hour", "Blue hour", "Soft lighting", "Hard lighting",
    "Dramatic lighting", "Neon lighting", "Candlelight", "Studio lighting", "Backlit"
  ],
  moods: [
    "Happy", "Melancholic", "Energetic", "Peaceful", "Tense", 
    "Romantic", "Mysterious", "Inspiring", "Nostalgic", "Dramatic"
  ],
  languages: [
    "English", "Russian", "Spanish", "French", "German", "Italian", 
    "Portuguese", "Chinese", "Japanese", "Korean", "Arabic", "Hindi"
  ]
};

const EXAMPLE_PROMPTS = [
  {
    scene: "A cozy coffee shop in the morning",
    style: "Cinematic",
    camera: "Medium shot",
    duration: "10 seconds",
    character: "A young woman reading a book",
    action: "slowly sipping coffee while turning pages",
    lighting: "Golden hour",
    mood: "Peaceful",
    speech: "What a beautiful morning",
    language: "English"
  },
  {
    scene: "A busy city street at night",
    style: "Dramatic",
    camera: "Wide shot",
    duration: "15 seconds",
    character: "A businessman in a suit",
    action: "walking quickly through the crowd",
    lighting: "Neon lighting",
    mood: "Energetic",
    speech: "Я опаздываю на встречу",
    language: "Russian"
  },
  {
    scene: "A beach at sunset",
    style: "Romantic",
    camera: "Tracking shot",
    duration: "30 seconds",
    character: "A couple holding hands",
    action: "walking along the shoreline",
    lighting: "Golden hour",
    mood: "Romantic",
    speech: "Te amo para siempre",
    language: "Spanish"
  }
];

export function SimpleVeo3Generator() {
  const [promptData, setPromptData] = useState<PromptData>({
    scene: "",
    style: "",
    camera: "",
    duration: "",
    character: "",
    action: "",
    lighting: "",
    mood: "",
    speech: "",
    language: ""
  });

  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [enhancementInfo, setEnhancementInfo] = useState<{
    length: string;
    model?: string;
    modelName?: string;
    targetCharacters: number;
    actualCharacters: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState("");
  const [promptLength, setPromptLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [selectedModel] = useState<'gpt-4.1'>('gpt-4.1');
  const [promptHistory, setPromptHistory] = useState<Array<{
    id: string;
    timestamp: Date;
    basicPrompt: string;
    enhancedPrompt: string;
    length: string;
    model?: string;
    promptData: PromptData;
  }>>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('veo3-prompt-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsed.map((item: {
          id: string;
          timestamp: string;
          basicPrompt: string;
          enhancedPrompt: string;
          length: string;
          promptData: PromptData;
        }) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setPromptHistory(historyWithDates);
      } catch (error) {
        console.error('Failed to load prompt history:', error);
      }
    }
  }, []);

  // Save to localStorage
  const saveToHistory = (basicPrompt: string, enhancedPrompt: string, length: string, model: string, promptData: PromptData) => {
    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      basicPrompt,
      enhancedPrompt,
      length,
      model,
      promptData
    };

    const newHistory = [historyItem, ...promptHistory].slice(0, 10); // Keep only last 10
    setPromptHistory(newHistory);
    
    // Save to localStorage
    try {
      localStorage.setItem('veo3-prompt-history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save prompt history:', error);
    }
  };

  // Load from history
  const loadFromHistory = (historyItem: typeof promptHistory[0]) => {
    setPromptData(historyItem.promptData);
    setGeneratedPrompt(historyItem.basicPrompt);
    setEnhancedPrompt(historyItem.enhancedPrompt);
    setPromptLength(historyItem.length as 'short' | 'medium' | 'long');
    
    // Restore enhancement info if enhanced prompt exists
    if (historyItem.enhancedPrompt) {
      setEnhancementInfo({
        length: historyItem.length,
        targetCharacters: historyItem.length === 'short' ? 500 : historyItem.length === 'medium' ? 1000 : 2000,
        actualCharacters: historyItem.enhancedPrompt.length
      });
    } else {
      setEnhancementInfo(null);
    }
  };

  // Clear history
  const clearHistory = () => {
    setPromptHistory([]);
    localStorage.removeItem('veo3-prompt-history');
  };

  const updateField = (field: keyof PromptData, value: string) => {
    const newData = { ...promptData, [field]: value };
    setPromptData(newData);
    generatePrompt(newData);
  };

  const generatePrompt = (data: PromptData) => {
    const parts = [];
    
    if (data.scene) parts.push(data.scene);
    if (data.character) parts.push(`featuring ${data.character}`);
    if (data.action) parts.push(`who is ${data.action}`);
    if (data.speech && data.language) {
      parts.push(`says in ${data.language.toLowerCase()}: "${data.speech}"`);
    }
    if (data.camera) parts.push(`Shot with ${data.camera.toLowerCase()}`);
    if (data.lighting) parts.push(`${data.lighting.toLowerCase()}`);
    if (data.style) parts.push(`${data.style.toLowerCase()} style`);
    if (data.mood) parts.push(`${data.mood.toLowerCase()} mood`);
    if (data.duration) parts.push(`Duration: ${data.duration}`);

    const prompt = parts.join(", ") + ".";
    setGeneratedPrompt(prompt);
    
    // Clear enhanced prompt when basic prompt changes
    if (enhancedPrompt) {
      setEnhancedPrompt("");
      setEnhancementInfo(null);
    }
  };

  const enhancePrompt = async () => {
    if (!generatedPrompt) {
      setEnhanceError("Please generate a basic prompt first");
      return;
    }

    setIsEnhancing(true);
    setEnhanceError("");

    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generatedPrompt,
          length: promptLength,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enhance prompt');
      }

      const data = await response.json();
      setEnhancedPrompt(data.enhancedPrompt);
      setEnhancementInfo({
        length: data.length,
        model: data.model,
        modelName: data.modelName,
        targetCharacters: data.targetCharacters,
        actualCharacters: data.actualCharacters
      });

      // Save to history when AI enhancement is successful
      saveToHistory(generatedPrompt, data.enhancedPrompt, data.length, data.model, promptData);
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      setEnhanceError(error instanceof Error ? error.message : 'Failed to enhance prompt');
    } finally {
      setIsEnhancing(false);
    }
  };

  const loadExample = (example: PromptData) => {
    setPromptData(example);
    generatePrompt(example);
  };

  const randomizePrompt = () => {
    const randomSpeech = ["Hello there!", "Привет!", "¡Hola!", "Bonjour!", "Guten Tag!", "Ciao!"];
    const randomData: PromptData = {
      scene: "A " + ["modern office", "cozy cafe", "busy street", "quiet park", "elegant restaurant"][Math.floor(Math.random() * 5)],
      style: PRESET_OPTIONS.styles[Math.floor(Math.random() * PRESET_OPTIONS.styles.length)],
      camera: PRESET_OPTIONS.cameras[Math.floor(Math.random() * PRESET_OPTIONS.cameras.length)],
      duration: PRESET_OPTIONS.durations[Math.floor(Math.random() * PRESET_OPTIONS.durations.length)],
      character: ["a young professional", "an elderly person", "a child", "a couple", "a group of friends"][Math.floor(Math.random() * 5)],
      action: ["having a conversation", "enjoying a meal", "working on a laptop", "taking photos", "listening to music"][Math.floor(Math.random() * 5)],
      lighting: PRESET_OPTIONS.lighting[Math.floor(Math.random() * PRESET_OPTIONS.lighting.length)],
      mood: PRESET_OPTIONS.moods[Math.floor(Math.random() * PRESET_OPTIONS.moods.length)],
      speech: randomSpeech[Math.floor(Math.random() * randomSpeech.length)],
      language: PRESET_OPTIONS.languages[Math.floor(Math.random() * PRESET_OPTIONS.languages.length)]
    };
    
    setPromptData(randomData);
    generatePrompt(randomData);
  };

  const copyToClipboard = async (text: string) => {
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    const emptyData: PromptData = {
      scene: "", style: "", camera: "", duration: "",
      character: "", action: "", lighting: "", mood: "",
      speech: "", language: ""
    };
    setPromptData(emptyData);
    setGeneratedPrompt("");
    setEnhancedPrompt("");
    setEnhanceError("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">VEO3 Prompt Generator</h1>
        <p className="text-muted-foreground">
          Create professional video prompts for Google&apos;s VEO3 AI with AI-powered enhancement
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={randomizePrompt} variant="outline" size="sm">
          <Shuffle className="w-4 h-4 mr-2" />
          Random Prompt
        </Button>
        <Button onClick={clearAll} variant="outline" size="sm">
          Clear All
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Step 1: Prompt Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scene Description */}
            <div className="space-y-2">
              <Label htmlFor="scene">Scene Description</Label>
              <Textarea
                id="scene"
                placeholder="Describe the main scene (e.g., A cozy coffee shop in the morning)"
                value={promptData.scene}
                                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("scene", e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Character */}
            <div className="space-y-2">
              <Label htmlFor="character">Character/Subject</Label>
              <Textarea
                id="character"
                placeholder="Who is in the scene? (e.g., A young woman reading a book)"
                value={promptData.character}
                                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("character", e.target.value)}
              />
            </div>

                        {/* Action */}
            <div className="space-y-2">
              <Label htmlFor="action">Action/Activity</Label>
              <Textarea
                id="action"
                placeholder="What are they doing? (e.g., slowly sipping coffee while turning pages)"
                value={promptData.action}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("action", e.target.value)}
              />
            </div>

            {/* Speech */}
            <div className="space-y-2">
              <Label htmlFor="speech">Character Speech (Optional)</Label>
              <Textarea
                id="speech"
                placeholder="What does the character say? (e.g., Hello there! or Привет!)"
                value={promptData.speech}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("speech", e.target.value)}
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label>Speech Language</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_OPTIONS.languages.map((language) => (
                  <Badge
                    key={language}
                    variant={promptData.language === language ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateField("language", language)}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-2">
              <Label>Visual Style</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_OPTIONS.styles.map((style) => (
                  <Badge
                    key={style}
                    variant={promptData.style === style ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateField("style", style)}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Camera Angle */}
            <div className="space-y-2">
              <Label>Camera Angle</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_OPTIONS.cameras.map((camera) => (
                  <Badge
                    key={camera}
                    variant={promptData.camera === camera ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateField("camera", camera)}
                  >
                    {camera}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div className="space-y-2">
              <Label>Lighting</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_OPTIONS.lighting.map((light) => (
                  <Badge
                    key={light}
                    variant={promptData.lighting === light ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateField("lighting", light)}
                  >
                    {light}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <Label>Mood</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_OPTIONS.moods.map((mood) => (
                  <Badge
                    key={mood}
                    variant={promptData.mood === mood ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateField("mood", mood)}
                  >
                    {mood}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_OPTIONS.durations.map((duration) => (
                  <Badge
                    key={duration}
                    variant={promptData.duration === duration ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateField("duration", duration)}
                  >
                    {duration}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Basic Prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="w-5 h-5" />
              Step 2: Generated Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Textarea with Copy button in top-right */}
              <div className="relative">
                <Textarea
                  value={generatedPrompt}
                  readOnly
                  placeholder="Your generated prompt will appear here..."
                  className="min-h-[250px] font-mono text-sm resize-none pr-12"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(generatedPrompt)}
                  disabled={!generatedPrompt}
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-background/80"
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* Main AI Enhance Button - Large and Prominent */}
              <Button 
                onClick={enhancePrompt}
                disabled={!generatedPrompt || isEnhancing}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Enhancing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3" />
                    Enhance with AI
                  </>
                )}
              </Button>

              {/* Collapsible Settings */}
              <div className="border rounded-lg">
                <Button
                  variant="ghost"
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-full justify-between p-3 h-auto"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Enhancement Settings</span>
                    <Badge variant="outline" className="text-xs">
                      {promptLength} • GPT-4.1
                    </Badge>
                  </div>
                  {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                
                {showSettings && (
                  <div className="px-3 pb-3 space-y-3 border-t">
                    {/* AI Enhancement Length Selector */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Enhancement Length</Label>
                      <div className="flex gap-2">
                        {[
                          { value: 'short', label: 'Short', desc: 'Concise', chars: 500 },
                          { value: 'medium', label: 'Medium', desc: 'Balanced', chars: 1000 },
                          { value: 'long', label: 'Long', desc: 'Detailed', chars: 2000 }
                        ].map((option) => (
                          <Badge
                            key={option.value}
                            variant={promptLength === option.value ? "default" : "outline"}
                            className="cursor-pointer flex-1 text-center p-2 h-auto flex flex-col text-xs"
                            onClick={() => setPromptLength(option.value as 'short' | 'medium' | 'long')}
                            title={`${option.desc} enhancement - ${option.chars} characters`}
                          >
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs opacity-70">{option.chars} chars</span>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Model Info */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">AI Model</Label>
                      <div className="p-2 bg-muted rounded text-xs">
                        <div className="font-medium">GPT-4.1</div>
                        <div className="text-muted-foreground">Best quality enhancement model</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {enhanceError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{enhanceError}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 3: AI Enhanced Prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Step 3: AI Enhanced Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Textarea with Copy button in top-right */}
              <div className="relative">
                <Textarea
                  value={enhancedPrompt}
                  readOnly
                  placeholder="Click 'Enhance with AI' to generate a professional, detailed prompt..."
                  className="min-h-[400px] font-mono text-sm resize-none whitespace-pre-wrap pr-12"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(enhancedPrompt)}
                  disabled={!enhancedPrompt}
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-background/80"
                  title={copied ? "Copied!" : "Copy enhanced prompt"}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* Enhancement Info - Compact */}
              {enhancementInfo && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span>Model: <span className="font-medium text-foreground">{enhancementInfo.modelName || enhancementInfo.model}</span></span>
                      <span>Length: <span className="font-medium text-foreground">{enhancementInfo.length}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Characters: <span className="font-medium text-foreground">{enhancementInfo.actualCharacters} / {enhancementInfo.targetCharacters}</span></span>
                      <Badge 
                        variant={enhancementInfo.actualCharacters <= enhancementInfo.targetCharacters ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {enhancementInfo.actualCharacters <= enhancementInfo.targetCharacters ? "✓ Within limit" : "⚠ Over limit"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prompt History Section */}
      {promptHistory.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <Card>
                         <CardHeader>
               <div className="flex items-center justify-between">
                 <CardTitle className="flex items-center gap-2">
                   <Copy className="w-5 h-5" />
                   Recent Prompts History
                 </CardTitle>
                 <Button
                   onClick={clearHistory}
                   variant="ghost"
                   size="sm"
                   className="text-muted-foreground hover:text-destructive"
                 >
                   <Trash2 className="w-4 h-4" />
                 </Button>
               </div>
             </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {promptHistory.map((historyItem) => (
                  <div key={historyItem.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-muted-foreground">
                        {historyItem.timestamp.toLocaleString()}
                      </p>
                      <div className="flex gap-1">
                        {historyItem.model && (
                          <Badge variant="outline" className="text-xs">
                            {historyItem.model}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {historyItem.length}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm mb-2 max-h-10 overflow-hidden">
                      {historyItem.basicPrompt.length > 100 
                        ? historyItem.basicPrompt.substring(0, 100) + '...' 
                        : historyItem.basicPrompt}
                    </p>
                    <Button
                      onClick={() => loadFromHistory(historyItem)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Load This Version
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Example Prompts Section */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Example Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="text-sm mb-2">
                    {example.scene}, featuring {example.character} who is {example.action}
                  </p>
                  <Button
                    onClick={() => loadExample(example)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Load Example {index + 1}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 