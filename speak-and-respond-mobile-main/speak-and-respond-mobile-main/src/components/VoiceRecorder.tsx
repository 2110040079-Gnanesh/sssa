
import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AudioSourceToggle from "./AudioSourceToggle";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import RecordButton from "./RecordButton";
import RecordingIndicator from "./RecordingIndicator";
import TranscriptEditor from "./TranscriptEditor";

interface VoiceRecorderProps {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  onTranscriptReady: (transcript: string) => void;
  userId: string | undefined;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  setIsRecording,
  onTranscriptReady,
  userId,
}) => {
  const [transcript, setTranscript] = useState("");
  const [audioSource, setAudioSource] = useState<"microphone" | "tab">("microphone");
  const [isEditing, setIsEditing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = Array.from(event.results)
        .map((result: SpeechRecognitionResult) => result[0].transcript)
        .join(" ");
      
      setTranscript(currentTranscript);
      onTranscriptReady(currentTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      toast({
        title: "Speech recognition error",
        description: event.error,
        variant: "destructive",
      });
    };

    speechRecognitionRef.current = recognition;

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast, onTranscriptReady]);

  const saveTranscriptionToSupabase = async (transcriptText: string) => {
    if (!userId || !transcriptText.trim()) return;
    
    try {
      await supabase
        .from('transcriptions')
        .insert({
          user_id: userId,
          transcript: transcriptText,
          audio_source: audioSource
        });
    } catch (error) {
      console.error("Error saving transcription:", error);
    }
  };

  const getAudioStream = async () => {
    try {
      let stream;
      
      if (audioSource === "microphone") {
        console.log("Getting microphone stream");
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else {
        console.log(`Getting ${isMobile ? "speaker" : "tab"} audio stream`);
        // @ts-ignore - Chrome API not in TypeScript types
        stream = await (navigator.mediaDevices as any).getDisplayMedia({ 
          video: true, 
          audio: true 
        });
      }
      
      console.log("Stream obtained:", stream);
      streamRef.current = stream;
      return stream;
    } catch (error) {
      console.error(`Error accessing ${audioSource}:`, error);
      throw error;
    }
  };

  const startRecording = async () => {
    try {
      console.log(`Starting recording with ${audioSource} source`);
      const stream = await getAudioStream();
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.start();
      
      // Start speech recognition
      if (speechRecognitionRef.current) {
        console.log("Starting speech recognition");
        speechRecognitionRef.current.start();
      }
      
      setIsRecording(true);
      setTranscript("");
      
      toast({
        title: "Recording started",
        description: `Listening to ${audioSource === "microphone" ? "your microphone" : (isMobile ? "device speaker" : "tab audio")}`,
      });
    } catch (error: any) {
      console.error("Error starting recording:", error);
      toast({
        title: audioSource === "microphone" ? "Microphone access denied" : `${isMobile ? "Speaker" : "Tab"} audio capture failed`,
        description: error.message || "Please allow access to your audio source",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      mediaRecorderRef.current.onstop = () => {
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      // Stop speech recognition
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      
      setIsRecording(false);
      saveTranscriptionToSupabase(transcript);
      
      toast({
        title: "Recording stopped",
        description: "Your speech has been transcribed",
      });
    }
  };

  const handleSourceChange = (source: "microphone" | "tab") => {
    console.log(`Audio source changed to: ${source}`);
    if (isRecording) {
      stopRecording();
    }
    setAudioSource(source);
  };

  const handleClearTranscript = () => {
    setTranscript("");
    onTranscriptReady("");
    toast({
      title: "Transcript cleared",
      description: "The transcript has been cleared successfully",
    });
  };

  const handleEditTranscript = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTranscript = e.target.value;
    setTranscript(newTranscript);
    onTranscriptReady(newTranscript);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <AudioSourceToggle onSourceChange={handleSourceChange} activeSource={audioSource} />
      
      <RecordButton 
        isRecording={isRecording} 
        startRecording={startRecording} 
        stopRecording={stopRecording} 
      />
      
      <RecordingIndicator isRecording={isRecording} />
      
      <TranscriptEditor 
        transcript={transcript}
        isEditing={isEditing}
        toggleEditMode={toggleEditMode}
        handleEditTranscript={handleEditTranscript}
        handleClearTranscript={handleClearTranscript}
      />
    </div>
  );
};

export default VoiceRecorder;
