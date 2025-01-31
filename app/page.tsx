'use client'
import { GoalInput } from "@/components/GoalInput";
import { ProgressPath } from "@/components/ProgressPath";
import { useState } from "react";
import { motion } from 'framer-motion';
import { Target } from "lucide-react";

interface Step {
  order: number;
  title: string;
  description: string;
  resources: string[];
  estimatedTime: string;
}

export default function Home() {
  const [steps, setSteps] = useState<Step[]>([]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative w-full max-w-6xl mx-auto px-4 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            DeepStride
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Transform your learning journey into achievable steps. Set your goal, and let AI craft your personalized path to success.
          </p>
        </motion.div>

        <GoalInput onGenerate={(generatedSteps) => setSteps(generatedSteps)} />
        
        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-600" />
              Your Learning Path
            </h2>
            <ProgressPath steps={steps} />
          </motion.div>
        )}
      </div>
    </main>
  );
}