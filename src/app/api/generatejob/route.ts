import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { formatJobDescription } from "@/lib/formatJobDescription";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { title, company, location, employmentType, experience } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Create a detailed job posting in Russian for the following position.
Start with the title in bold using ** markers:
**${title} в ${company} (${location})**

Then structure the description using the following sections:

[RESPONSIBILITIES]
• Responsibility 1
• Responsibility 2
...

[REQUIREMENTS]
• Requirement 1
• Requirement 2
...

[BENEFITS]
• Benefit 1
• Benefit 2
...

[CONDITIONS]
• Condition 1
• Condition 2
...

Use "•" for bullet points. Each section should be marked with [SECTION_NAME].
Format the response as plain text with line breaks.
Make the title bold using ** markers.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    const formattedText = formatJobDescription(rawText);

    return NextResponse.json({ description: formattedText });
  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate job description' },
      { status: 500 }
    );
  }
} 