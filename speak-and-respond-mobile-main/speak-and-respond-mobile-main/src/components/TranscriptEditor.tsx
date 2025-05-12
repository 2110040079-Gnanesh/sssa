
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface TranscriptEditorProps {
  transcript: string;
  isEditing: boolean;
  toggleEditMode: () => void;
  handleEditTranscript: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleClearTranscript: () => void;
}

const TranscriptEditor: React.FC<TranscriptEditorProps> = ({
  transcript,
  isEditing,
  toggleEditMode,
  handleEditTranscript,
  handleClearTranscript,
}) => {
  return (
    <div className="mt-4 rounded-lg bg-muted/50 p-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-muted-foreground">Transcript:</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={toggleEditMode}
          >
            {isEditing ? "Done" : "Edit"}
          </Button>
          {transcript && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              onClick={handleClearTranscript}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="max-h-[150px] overflow-y-auto custom-scrollbar rounded-md bg-background/50 p-3 text-sm">
        {isEditing ? (
          <Textarea 
            className="w-full h-full min-h-[120px] bg-transparent border-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground/50"
            placeholder="Edit your transcript here..."
            value={transcript}
            onChange={handleEditTranscript}
            autoFocus
          />
        ) : (
          transcript ? transcript : <span className="text-muted-foreground/70 italic">Your speech will appear here... <br/>Click "Edit" to type manually</span>
        )}
      </div>
    </div>
  );
};

export default TranscriptEditor;
