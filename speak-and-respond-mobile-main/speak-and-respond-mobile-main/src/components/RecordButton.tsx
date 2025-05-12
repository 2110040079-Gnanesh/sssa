
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

interface RecordButtonProps {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  startRecording,
  stopRecording,
}) => {
  return (
    <div className="flex justify-center w-full">
      {isRecording ? (
        <Button
          variant="destructive"
          size="lg"
          className="h-14 w-14 rounded-full p-0 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          onClick={stopRecording}
          aria-label="Stop Recording"
        >
          <Square className="h-6 w-6" />
        </Button>
      ) : (
        <Button
          variant="default"
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 p-0 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          onClick={startRecording}
          aria-label="Start Recording"
        >
          <Mic className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default RecordButton;
