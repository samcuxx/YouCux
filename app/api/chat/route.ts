import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatMessage } from "@/types/chat";

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

const SYSTEM_PROMPT = `You are an expert YouTube content creator and script writer with extensive experience in creating viral videos and engaging content. Your goal is to help users create professional, engaging, and well-structured video scripts.

Follow these guidelines when helping with scripts:

1. Hook (First 15 Seconds):
   - Create attention-grabbing openings
   - Present a clear value proposition
   - Use pattern interrupts or curiosity gaps

2. Content Structure:
   - Maintain a clear 3-act structure (Setup, Development, Resolution)
   - Include smooth transitions between segments
   - Incorporate storytelling elements
   - Keep optimal pacing for engagement

3. Viewer Retention:
   - Add strategic pattern interrupts every 2-3 minutes
   - Include open loops and callbacks
   - Create anticipation for what's coming next
   - Use "but wait" moments strategically

4. SEO & Discoverability:
   - Suggest SEO-optimized titles
   - Create compelling thumbnails descriptions
   - Include relevant tags and keywords
   - Optimize for YouTube's algorithm

5. Engagement Elements:
   - Add well-timed call-to-actions
   - Include community engagement prompts
   - Suggest relevant end screens
   - Create shareable moments

6. Production Notes:
   - Suggest B-roll opportunities
   - Mark emphasis points
   - Include timing guidelines
   - Note where to add graphics/effects

Format your responses clearly using markdown, and include specific timestamps or duration recommendations when relevant. Keep responses focused and actionable.`;

const FALLBACK_RESPONSES = [
  "I apologize, but I'm currently experiencing high demand. Please try again in a few minutes.",
  "Our AI system is quite busy at the moment. Your request is important to us - please try again shortly.",
  "We're experiencing temporary limitations. Please wait a moment before sending your next message.",
];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Try primary model first
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((msg: ChatMessage) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        temperature: 1,
        max_tokens: 4096,
        top_p: 1,
      });

      const reply = completion.choices[0]?.message?.content;
      if (reply) {
        return NextResponse.json({ message: reply });
      }
    } catch (primaryError: unknown) {
      console.error("Primary model error:", primaryError);

      // If it's not a rate limit error, throw it
      if (
        typeof primaryError === "object" &&
        primaryError !== null &&
        "status" in primaryError &&
        primaryError.status !== 429
      ) {
        throw primaryError;
      }

      // For rate limit errors, try fallback model
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((msg: ChatMessage) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
          temperature: 0.7,
          max_tokens: 2048,
        });

        const reply = completion.choices[0]?.message?.content;
        if (reply) {
          return NextResponse.json({
            message: reply,
            notice: "Using fallback model due to high demand.",
          });
        }
      } catch (fallbackError) {
        console.error("Fallback model error:", fallbackError);
        // If both models fail, use a random fallback response
        return NextResponse.json({
          message:
            FALLBACK_RESPONSES[
              Math.floor(Math.random() * FALLBACK_RESPONSES.length)
            ],
          notice:
            "Service temporarily limited. Please try again in a few minutes.",
        });
      }
    }

    return NextResponse.json({
      message:
        "I apologize, but I couldn't generate a response. Please try again.",
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process your request",
        message:
          "Our services are experiencing high demand. Please try again in a few minutes.",
      },
      { status: 500 }
    );
  }
}
