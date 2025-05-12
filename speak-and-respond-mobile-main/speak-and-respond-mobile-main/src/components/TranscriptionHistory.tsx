
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Clock } from "lucide-react";

interface Transcription {
  id: string;
  transcript: string;
  response: string;
  created_at: string;
}

const TranscriptionHistory = ({ onSelect, onClose }: { 
  onSelect: (transcript: string, response: string) => void,
  onClose: () => void
}) => {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const { data, error } = await supabase
          .from("transcriptions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        setTranscriptions(data || []);
      } catch (error: any) {
        console.error("Error fetching transcription history:", error);
        toast({
          title: "Error",
          description: "Failed to load your transcription history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTranscriptions();

    // Subscribe to changes
    const channel = supabase
      .channel('transcription_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transcriptions' },
        (payload) => {
          fetchTranscriptions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    
    try {
      setDeleting(id);
      
      // Delete from Supabase
      const { error } = await supabase
        .from("transcriptions")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // Update local state immediately
      setTranscriptions(transcriptions.filter(item => item.id !== id));
      
      toast({
        title: "Deleted",
        description: "Transcription has been removed",
      });
    } catch (error: any) {
      console.error("Error deleting transcription:", error);
      toast({
        title: "Error",
        description: "Failed to delete transcription",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleSelectItem = (transcript: string, response: string) => {
    onSelect(transcript, response);
    onClose(); // Close the history panel after selection
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex space-x-2">
          {Array(3).fill(0).map((_, i) => (
            <div 
              key={i}
              className="h-3 w-3 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="border border-border/10 bg-card/80 backdrop-blur-lg shadow-lg">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Transcription History</h2>
        
        {transcriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mb-2 opacity-40" />
            <p>No transcriptions yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px] pr-4 custom-scrollbar">
            <div className="space-y-3">
              {transcriptions.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-lg bg-background/30 hover:bg-background/50 transition-all cursor-pointer group border border-border/5 shadow-sm"
                  onClick={() => handleSelectItem(item.transcript, item.response)}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium line-clamp-1 text-foreground">{item.transcript}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
                        onClick={(e) => handleDelete(item.id, e)}
                        disabled={deleting === item.id}
                      >
                        {deleting === item.id ? (
                          <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-muted-foreground animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {item.response || "No response generated"}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};

export default TranscriptionHistory;
