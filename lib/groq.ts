import Groq from "groq-sdk";
import { z } from "zod";

const responseSchema = z.object({
  steps: z.array(
    z.object({
      order: z.number(),
      title: z.string(),
      description: z.string(),
      resources: z.array(z.string()),
      estimatedTime: z.string()
    })
  )
});

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface AIResponse {
  steps: Array<{
    order: number;
    title: string;
    description: string;
    resources: string[];
    estimatedTime: string;
  }>;
}

export const generateLearningPath = async (goal: string): Promise<AIResponse> => {
    const systemPrompt = `You are an expert learning path generator. Create a detailed, step-by-step plan using this exact JSON format:
    {
      "steps": [
        {
          "order": 1,
          "title": "Step Title",
          "description": "Detailed explanation",
          "resources": ["Resource 1 (https://example.com)", "Resource 2"],
          "estimatedTime": "X days"
        }
      ]
    }
    
    For the learning goal: "${goal}". Follow these rules:
    1. Output ONLY raw JSON without markdown formatting
    2. Keep resource strings in format "Display Text (URL)"
    3. Ensure all URLs are properly parenthesized
    4. Maintain consistent string formatting
    5. Include exactly these fields in each step: order, title, description, resources, estimatedTime`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: goal
        }
      ],
      model: "deepseek-r1-distill-llama-70b",
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const rawResponse = completion.choices[0].message.content;
    const sanitizedResponse = rawResponse?.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!sanitizedResponse) {
      throw new Error("Sanitized response is undefined");
    }
    const parsedResponse = responseSchema.parse(JSON.parse(sanitizedResponse));
    return parsedResponse;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate learning path");
  }
};