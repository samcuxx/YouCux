import type { YouTubeVideoData } from "./youtube"

export interface AIAnalysis {
  summary: {
    strengths: string[]
    weaknesses: string[]
    score: number
  }
  seo: {
    titleSuggestions: string[]
    descriptionSuggestions: string[]
    tagsToRemove: string[]
    tagsToAdd: string[]
    keywordDensity: {
      keyword: string
      count: number
      density: number
    }[]
  }
  engagement: {
    rating: "poor" | "fair" | "good" | "excellent"
    viewsPerDay: number
    engagementRate: number
    suggestions: string[]
  }
  content: {
    topics: string[]
    sentiment: "negative" | "neutral" | "positive"
    suggestions: string[]
  }
}

export interface AnalysisData {
  original: YouTubeVideoData
  analysis: AIAnalysis
} 