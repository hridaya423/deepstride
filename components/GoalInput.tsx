import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Step {
  order: number;
  title: string;
  description: string;  
  resources: string[];
  estimatedTime: string;
}

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

const LoadingAnimation = () => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTimeout(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 relative">
        <div className="absolute w-full h-full border-4 border-purple-200 rounded-full"></div>
        <div className="absolute w-full h-full border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <div className="mt-4 text-purple-600 font-medium animate-pulse">
        Crafting your learning path...
      </div>
      {showTimeout && (
        <div className="mt-2 text-sm text-purple-600">
          This might take a little longer due to high demand
        </div>
      )}
    </div>
  );
};

const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
};

export const GoalInput = ({ onGenerate }: { onGenerate: (steps: Step[]) => void }) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!goal.trim()) {
      setError("Please enter a learning goal");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWithRetry('/api/generate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
      });
      
      onGenerate(data.steps);
    } catch (error) {
      console.error("Generation Error:", error);
      setError("Failed to generate path after multiple attempts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center">
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              type="text"
              placeholder="What skill do you want to conquer today?"
              className="w-full px-8 py-6 text-lg rounded-2xl border-0 bg-white/90 backdrop-blur-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              disabled={loading}
            />
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="absolute right-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Generating..." : (
                <>Generate Path <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {loading && <LoadingAnimation />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default GoalInput;
