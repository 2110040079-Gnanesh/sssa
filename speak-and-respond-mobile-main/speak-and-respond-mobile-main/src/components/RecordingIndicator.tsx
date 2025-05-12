
import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface RecordingIndicatorProps {
  isRecording: boolean;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({ isRecording }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        {isRecording ? (
          <>
            <Volume2 className="h-4 w-4 text-blue-400 animate-pulse" />
            <span className="text-xs text-blue-400 animate-pulse font-medium">Recording...</span>
          </>
        ) : (
          <>
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Ready to record</span>
          </>
        )}
      </div>
      
      {isRecording && (
        <div className="flex justify-center gap-1 mt-1">
          {Array(5).fill(0).map((_, i) => (
            <div 
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"
              style={{ 
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordingIndicator;
