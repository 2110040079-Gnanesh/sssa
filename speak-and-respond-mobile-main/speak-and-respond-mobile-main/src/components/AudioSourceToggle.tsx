
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface AudioSourceToggleProps {
  onSourceChange: (source: "microphone" | "tab") => void;
  activeSource?: "microphone" | "tab";
}

const AudioSourceToggle: React.FC<AudioSourceToggleProps> = ({ 
  onSourceChange, 
  activeSource = "microphone" 
}) => {
  const [isTabAudio, setIsTabAudio] = useState(activeSource === "tab");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Update the state when activeSource changes
  useEffect(() => {
    setIsTabAudio(activeSource === "tab");
  }, [activeSource]);

  const handleToggle = async (checked: boolean) => {
    try {
      if (checked) {
        // Request tab capture permission
        // @ts-ignore - Chrome API not in TypeScript types
        const tabCaptureAvailable = navigator.mediaDevices && 
          typeof (navigator.mediaDevices as any).getDisplayMedia === 'function';
        
        if (!tabCaptureAvailable) {
          throw new Error("Tab audio capture is not supported in your browser");
        }
        
        toast({
          title: "Tab Capture",
          description: isMobile 
            ? "Please select your device speaker in the next dialog" 
            : "Please select the tab whose audio you want to capture in the next dialog",
        });
        
        onSourceChange("tab");
      } else {
        onSourceChange("microphone");
      }
      
      setIsTabAudio(checked);
    } catch (error: any) {
      console.error("Error toggling audio source:", error);
      toast({
        title: "Audio Source Error",
        description: error.message || "Failed to change audio source",
        variant: "destructive",
      });
      setIsTabAudio(false);
      onSourceChange("microphone");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="audio-source" 
        checked={isTabAudio}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="audio-source" className="text-sm">
        {isTabAudio ? 
          (isMobile ? "Capture speaker audio" : "Capture tab audio") : 
          "Use microphone"
        }
      </Label>
    </div>
  );
};

export default AudioSourceToggle;
