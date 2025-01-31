import { motion } from 'framer-motion';
import { Book, Clock, Link as LinkIcon } from 'lucide-react';

interface Step {
  order: number;
  title: string;
  description: string;
  resources: string[];
  estimatedTime: string;
}

const extractLink = (resource: string) => {
  const matches = resource.match(/^(.*?)\s*\((https?:\/\/.*?)\)$/);
  return matches ? { text: matches[1].trim(), url: matches[2] } : { text: resource, url: null };
};
  
export const ProgressPath = ({ steps }: { steps: Step[] }) => {
  return (
    <div className="space-y-8 relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-pink-600 to-blue-600"></div>
      {steps.map((step, index) => (
        <motion.div 
          key={step.order}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
          className="p-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 relative pl-16 hover:shadow-2xl transition-shadow duration-300"
        >
          <motion.div 
            className="absolute left-0 top-8 -ml-6 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {step.order}
          </motion.div>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {step.title}
          </h3>
          <p className="text-slate-600 mb-4 leading-relaxed">{step.description}</p>
          <div className="flex gap-3 flex-wrap mb-4">
            <div className="flex items-center gap-1 text-sm text-purple-600">
              <Clock className="w-4 h-4" />
              {step.estimatedTime}
            </div>
            <div className="flex items-center gap-1 text-sm text-pink-600">
              <Book className="w-4 h-4" />
              {step.resources.length} Resources
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {step.resources.map((resource) => {
              const { text, url } = extractLink(resource);
              return url ? (
                <a
                  key={text}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-medium text-purple-700 hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center gap-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  {text}
                </a>
              ) : (
                <span 
                  key={text}
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-medium text-purple-700"
                >
                  {text}
                </span>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
};