
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Cpu } from 'lucide-react';

interface ResponseDisplayProps {
  response: string;
  loading?: boolean;
  mode: "interview" | "gd";
  loadingText?: string;
  placeholderText?: string;
  aiModel?: string;
}

const formattedResponse = (text: string, mode: string) => {
  if (!text) return '';
  
  let formatted = text;
  
  // Add timestamps where appropriate
  const now = new Date();
  const timestamp = `\n\n**Generated at:** ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`;
  formatted = formatted + timestamp;
  
  return formatted;
};

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ 
  response, 
  loading = false, 
  mode = "interview",
  loadingText,
  placeholderText,
  aiModel
}) => {
  const defaultLoadingText = mode === "interview" 
    ? "Generating professional response..." 
    : "Analyzing group discussion...";

  const defaultPlaceholderText = mode === "interview"
    ? "Record your voice to generate a professional interview response"
    : "Record your group discussion to analyze different perspectives";

  return (
    <div className="flex h-full flex-col rounded-lg neo-blur p-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <div className="flex space-x-1">
            {Array(3).fill(0).map((_, i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                style={{
                  animation: 'bounce 1.4s infinite ease-in-out',
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {loadingText || defaultLoadingText}
          </p>
        </div>
      ) : response ? (
        <>
          {aiModel && (
            <div className="flex items-center gap-2 mb-3 py-1 px-2 rounded-md w-fit bg-blue-900/20 border border-blue-500/20">
              <Cpu className="h-3 w-3 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">{aiModel}</span>
            </div>
          )}
          <ScrollArea className="h-full custom-scrollbar pr-2">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  strong: ({node, ...props}) => (
                    <strong className="font-bold text-blue-400" {...props} />
                  ),
                  h1: ({node, ...props}) => (
                    <h1 className="text-xl font-bold mb-3 text-blue-400" {...props} />
                  ),
                  h2: ({node, ...props}) => (
                    <h2 className="text-lg font-bold mb-2 text-blue-400" {...props} />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 className="text-base font-bold mb-2 text-blue-400" {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <p className="mb-3 text-sm" {...props} />
                  ),
                  li: ({node, ...props}) => (
                    <li className="ml-4 text-sm" {...props} />
                  )
                }}
              >
                {formattedResponse(response, mode)}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="rounded-full bg-secondary/50 p-3">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-muted-foreground"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {placeholderText || defaultPlaceholderText}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
