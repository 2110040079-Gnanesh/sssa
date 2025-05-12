
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Book, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface KnowledgeBaseProps {
  userId: string | undefined;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ userId }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_knowledge_base")
          .select("content")
          .eq("user_id", userId)
          .single();
          
        if (error && error.code !== "PGRST116") {
          throw error;
        }
        
        if (data) {
          setContent(data.content || "");
          calculateWordCount(data.content || "");
        }
      } catch (error: any) {
        console.error("Error loading knowledge base:", error);
        toast({
          title: "Error",
          description: "Failed to load your knowledge base content",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [userId, toast]);

  const calculateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/);
    setWordCount(text.trim() ? words.length : 0);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    calculateWordCount(newContent);
  };

  const handleSave = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to save your knowledge base",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    try {
      const { data, error: selectError } = await supabase
        .from("user_knowledge_base")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (selectError) throw selectError;
      
      if (data) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("user_knowledge_base")
          .update({ content, updated_at: new Date().toISOString() })
          .eq("id", data.id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("user_knowledge_base")
          .insert({ 
            user_id: userId, 
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Success",
        description: "Your knowledge base has been saved",
      });
      
      // Redirect to dashboard after saving
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Error saving knowledge base:", error);
      toast({
        title: "Error",
        description: "Failed to save your knowledge base",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Book className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-lg">Knowledge Base</CardTitle>
        </div>
        <CardDescription>
          Add your resume details, professional experience, and projects for more personalized responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <p>This information will be used to provide context-aware interview responses</p>
          </div>
          
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Paste your resume content, skills, education, and project details here..."
            className="min-h-[300px] bg-background/30 border-white/5 resize-none custom-scrollbar"
          />
          
          <div className="text-xs text-muted-foreground text-right">
            Word count: {wordCount}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={saving || !userId}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700"
        >
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Knowledge Base
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KnowledgeBase;
