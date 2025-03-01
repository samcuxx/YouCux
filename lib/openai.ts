import OpenAI from "openai";
import type { AIAnalysis } from "@/types/analysis";

if (!process.env.GITHUB_TOKEN) {
  throw new Error("Missing GitHub Token");
}

export const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

export function extractJsonFromMarkdown(content: string | null): string {
  if (!content) throw new Error("No content provided");

  // Try to extract JSON from markdown code blocks
  const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1];
  }

  // If no markdown, try to find JSON directly
  const jsonRegex = /\{[\s\S]*\}/;
  const directMatch = content.match(jsonRegex);
  if (directMatch) {
    return directMatch[0];
  }

  throw new Error("No valid JSON found in response");
}

export async function analyzeContent(content: string): Promise<AIAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a YouTube content analysis expert. Provide your analysis in valid JSON format without any markdown formatting.",
        },
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    const jsonContent = extractJsonFromMarkdown(
      response.choices[0].message.content
    );
    return JSON.parse(jsonContent) as AIAnalysis;
  } catch (error) {
    console.error("Error analyzing content:", error);
    throw error;
  }
}
