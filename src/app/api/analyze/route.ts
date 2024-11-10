import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 60;

if (!process.env.GEMINI_KEY) {
  throw new Error('Missing GEMINI_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const ANALYSIS_PROMPT = `You are a professional HR specialist and resume reviewer. Analyze this resume and provide detailed feedback.
Focus on these aspects:
1. Contact Information
2. Professional Experience
3. Education
4. Skills
5. Overall Presentation

For each section, identify strengths and areas for improvement.
Provide specific, actionable recommendations.
Rate the resume on a scale of 1-10.

IMPORTANT: Return ONLY pure JSON without any markdown formatting or code blocks. The response should start with { and end with }.
IMPORTANT: The response should be in Russian.
Format your response as:
{
  "score": number,
  "sections": [
    {
      "title": string,
      "status": "good" | "warning" | "info",
      "points": string[]
    }
  ],
  "recommendations": string[]
}`;

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `${ANALYSIS_PROMPT}\n\nResume text:\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let analysisText = response.text();

    analysisText = analysisText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    if (!analysisText) {
      throw new Error("Failed to get analysis result");
    }

    try {
      const parsedJson = JSON.parse(analysisText);
      return NextResponse.json(parsedJson);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError, "Raw text:", analysisText);
      throw new Error("Failed to parse analysis result");
    }
  } catch (error) {
    console.error("Error in resume analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
} 