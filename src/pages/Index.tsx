import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import TranscriptionHistory from "@/components/TranscriptionHistory";
import InputCard from "@/components/InputCard";
import ResponseCard from "@/components/ResponseCard";
import FeatureSection from "@/components/FeatureSection";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const [responseModel, setResponseModel] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState<"interview" | "gd">("interview");
  const [gdTopic, setGdTopic] = useState("");
  const [aiModel, setAiModel] = useState<"groq" | "openrouter">("groq");
  const [showFeatures, setShowFeatures] = useState(false);
  const { toast } = useToast();
  const { user, loading, requireAuth } = useAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Redirect to landing page if not logged in and not loading
  if (!loading && !user) {
    return <Navigate to="/" />;
  }

  const handleTranscript = (text: string) => {
    setTranscript(text);
  };

  const handleHistorySelect = (historicalTranscript: string, historicalResponse: string) => {
    setTranscript(historicalTranscript);
    setResponse(historicalResponse);
    setShowHistory(false); // Close history panel after selection
  };

  const saveResponseToSupabase = async (responseText: string) => {
    if (!user?.id || !transcript.trim()) return;
    
    try {
      // Get current timestamp
      const timestamp = new Date().toISOString();
      
      // Check for existing transcription with this transcript for this user
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('transcript', transcript)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Update the existing transcription with the response and timestamp
        await supabase
          .from('transcriptions')
          .update({ 
            response: responseText,
            updated_at: timestamp,
            mode: mode,
            ai_model: aiModel
          })
          .eq('id', data[0].id);
      } else {
        // If no match found, insert a new record
        await supabase
          .from('transcriptions')
          .insert({
            user_id: user.id,
            transcript: transcript,
            response: responseText,
            created_at: timestamp,
            updated_at: timestamp,
            mode: mode,
            ai_model: aiModel
          });
      }
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };

  const handleGenerateResponse = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Empty transcript",
        description: "Please record some audio first",
        variant: "destructive",
      });
      return;
    }

    // Stop recording if it's in progress
    if (isRecording) {
      setIsRecording(false);
    }

    setProcessing(true);
    setResponse("Processing your request...");
    setResponseModel("");
    
    try {
      // Get knowledge base for context
      const { data: knowledgeBase, error: kbError } = await supabase
        .from('user_knowledge_base')
        .select('content')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (kbError && kbError.code !== "PGRST116") {
        console.error("Error fetching knowledge base:", kbError);
      }
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('groq-chat', {
        body: { 
          transcript, 
          mode, 
          gdTopic, 
          aiModel,
          knowledge: knowledgeBase?.content || "" 
        },
      });
      
      if (error) {
        throw new Error(error.message || "Error calling API");
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResponse(data.response);
      setResponseModel(data.model || (aiModel === "groq" ? "Groq (LLama3-8b)" : "Gemma 3 4B (OpenRouter)"));
      saveResponseToSupabase(data.response);
    } catch (error: any) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate response",
        variant: "destructive",
      });
      setResponse(""); // Clear the "Processing..." message
      setResponseModel("");
    } finally {
      setProcessing(false);
    }
  };

  // If loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="flex space-x-2">
          {Array(3).fill(0).map((_, i) => (
            <div 
              key={i}
              className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
              style={{
                animation: 'bounce 1.4s infinite ease-in-out',
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background/95 to-background/90 p-3 md:p-4">
      <Header 
        user={user}
        onViewHistory={() => setShowHistory(!showHistory)}
        historyVisible={showHistory}
      />

      <div className="grid flex-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <InputCard
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            transcript={transcript}
            onTranscriptReady={setTranscript}
            processing={processing}
            handleGenerateResponse={handleGenerateResponse}
            mode={mode}
            setMode={setMode}
            gdTopic={gdTopic}
            setGdTopic={setGdTopic}
            aiModel={aiModel}
            setAiModel={setAiModel}
            userId={user?.id}
          />

          {showHistory ? (
            <TranscriptionHistory 
              onSelect={handleHistorySelect} 
              onClose={() => setShowHistory(false)}
            />
          ) : (
            <FeatureSection />
          )}
        </div>

        <ResponseCard 
          mode={mode}
          response={response}
          processing={processing}
          responseModel={responseModel}
        />
      </div>
      
      <footer className="mt-4 text-xs text-center text-muted-foreground py-2">
        <p>© 2025 MeigdAI Interview Assistant. Professional interview responses powered by AI.</p>
      </footer>
    </div>
  );
};

export default Index;