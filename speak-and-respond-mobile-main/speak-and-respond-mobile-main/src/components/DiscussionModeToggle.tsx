
import React from 'react';
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Users, User, Bot, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

interface DiscussionModeToggleProps {
  activeMode: "interview" | "gd";
  onModeChange: (mode: "interview" | "gd") => void;
  gdTopic: string;
  onGdTopicChange: (topic: string) => void;
  activeAI: "groq" | "openrouter";
  onAIChange: (ai: "groq" | "openrouter") => void;
}

const DiscussionModeToggle: React.FC<DiscussionModeToggleProps> = ({
  activeMode,
  onModeChange,
  gdTopic,
  onGdTopicChange,
  activeAI,
  onAIChange
}) => {
  return (
    <Card className="p-3 w-full md:w-auto neo-blur">
      <div className="space-y-3">
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1 block">Mode</Label>
          <ToggleGroup
            type="single"
            variant="outline"
            value={activeMode}
            onValueChange={(value) => {
              if (value) onModeChange(value as "interview" | "gd");
            }}
            className="justify-start bg-black/20 p-1 rounded-md border border-white/5 shadow-sm w-full"
          >
            <ToggleGroupItem 
              value="interview" 
              className="flex-1 gap-1 data-[state=on]:bg-blue-500/10 data-[state=on]:text-blue-400 transition-all"
            >
              <User className="h-3 w-3" />
              <span className="text-xs">Interview</span>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="gd" 
              className="flex-1 gap-1 data-[state=on]:bg-blue-500/10 data-[state=on]:text-blue-400 transition-all"
            >
              <Users className="h-3 w-3" />
              <span className="text-xs">Group</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {activeMode === "gd" && (
          <div>
            <Label htmlFor="gd-topic" className="text-xs font-medium text-muted-foreground mb-1 block">
              Discussion Topic
            </Label>
            <Input 
              id="gd-topic"
              placeholder="Enter topic..." 
              value={gdTopic} 
              onChange={(e) => onGdTopicChange(e.target.value)}
              className="h-8 text-xs bg-black/20 border-white/5 focus-visible:ring-blue-500/20"
            />
          </div>
        )}

        <div>
          <Label htmlFor="ai-model" className="text-xs font-medium text-muted-foreground mb-1 block">
            AI Model
          </Label>
          <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-black/20 border border-white/5">
            <div className="flex items-center space-x-1">
              <Bot className={`h-3 w-3 ${activeAI === "groq" ? "text-blue-400" : "text-muted-foreground"}`} />
              <span className={`text-xs ${activeAI === "groq" ? "font-medium text-blue-400" : "text-muted-foreground"}`}>
                LLama3
              </span>
            </div>
            <Switch
              id="ai-model"
              checked={activeAI === "openrouter"}
              onCheckedChange={(checked) => onAIChange(checked ? "openrouter" : "groq")}
              className="data-[state=checked]:bg-blue-500 h-4 w-8"
            />
            <div className="flex items-center space-x-1">
              <span className={`text-xs ${activeAI === "openrouter" ? "font-medium text-blue-400" : "text-muted-foreground"}`}>
                Gemma
              </span>
              <Cpu className={`h-3 w-3 ${activeAI === "openrouter" ? "text-blue-400" : "text-muted-foreground"}`} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DiscussionModeToggle;
