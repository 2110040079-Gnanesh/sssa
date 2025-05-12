
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ResponseDisplay from "./ResponseDisplay";

interface ResponseCardProps {
  mode: "interview" | "gd";
  response: string;
  processing: boolean;
  responseModel: string;
}

const ResponseCard: React.FC<ResponseCardProps> = ({
  mode,
  response,
  processing,
  responseModel,
}) => {
  const getResponseTitle = () => {
    if (mode === "interview") return "AI Interview Response";
    return "AI Discussion Analysis";
  };

  const getLoadingText = () => {
    if (mode === "interview") return "Generating professional response...";
    return "Analyzing group discussion...";
  };

  const getPlaceholderText = () => {
    if (mode === "interview") return "Record your voice to generate a professional interview response";
    return "Record your group discussion to analyze perspectives on the topic";
  };

  return (
    <Card className="flex flex-col border-0 glass-card h-auto md:h-full transition-all duration-300 ease-in-out">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          {getResponseTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponseDisplay
          response={response}
          loading={processing}
          mode={mode}
          loadingText={getLoadingText()}
          placeholderText={getPlaceholderText()}
          aiModel={responseModel}
        />
      </CardContent>
    </Card>
  );
};

export default ResponseCard;
