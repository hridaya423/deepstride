import { generateLearningPath } from '@/lib/groq';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  goal: z.string().min(3).max(500),
})

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { goal } = requestSchema.parse(body)
      const path = await generateLearningPath(goal)
      return NextResponse.json(path);
    } catch (error) {
      console.error("API Error:", error);
      const statusCode = error instanceof z.ZodError ? 400 : 500;
      return NextResponse.json(
        { 
          error: error instanceof z.ZodError 
            ? "Invalid request format" 
            : "Failed to generate valid learning path structure"
        },
        { status: statusCode }
      );
    }
  }