import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import VoiceRecorder from "./VoiceRecorder";
import DiscussionModeToggle from "./DiscussionModeToggle";

interface InputCardProps {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  transcript: string;
  onTranscriptReady: (transcript: string) => void;
  processing: boolean;
  handleGenerateResponse: () => void;
  mode: "interview" | "gd";
  setMode: (mode: "interview" | "gd") => void;
  gdTopic: string;
  setGdTopic: (topic: string) => void;
  aiModel: "groq" | "openrouter";
  setAiModel: (ai: "groq" | "openrouter") => void;
  userId: string | undefined;
}

const InputCard: React.FC<InputCardProps> = ({
  isRecording,
  setIsRecording,
  transcript,
  onTranscriptReady,
  processing,
  handleGenerateResponse,
  mode,
  setMode,
  gdTopic,
  setGdTopic,
  aiModel,
  setAiModel,
  userId,
}) => {
  const getButtonText = () => {
    if (mode === "interview") return "Generate Interview Response";
    return "Analyze Discussion";
  };

  return (
    <Card className="flex flex-col border-0 glass-card">
      <CardHeader className="pb-3 pt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <CardTitle className="text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Voice Input
          </CardTitle>
          <DiscussionModeToggle
            activeMode={mode}
            onModeChange={setMode}
            gdTopic={gdTopic}
            onGdTopicChange={setGdTopic}
            activeAI={aiModel}
            onAIChange={setAiModel}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <VoiceRecorder
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onTranscriptReady={onTranscriptReady}
          userId={userId}
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateResponse}
          disabled={processing || !transcript}
          className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90 transition-all shadow-md"
        >
          <Play className="h-4 w-4" />
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InputCard;