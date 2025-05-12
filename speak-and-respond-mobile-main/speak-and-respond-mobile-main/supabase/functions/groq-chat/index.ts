
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.4.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestData {
  transcript: string;
  mode: "interview" | "gd";
  gdTopic?: string;
  aiModel: "groq" | "openrouter";
  knowledge?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json() as RequestData;
    const { transcript, mode, gdTopic, aiModel, knowledge } = requestData;
    
    if (!transcript) {
      return new Response(
        JSON.stringify({ error: "No transcript provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    let response, model;
    
    if (aiModel === "groq") {
      const result = await callGroq(transcript, mode, gdTopic, knowledge);
      response = result.response;
      model = result.model;
    } else {
      const result = await callOpenRouter(transcript, mode, gdTopic, knowledge);
      response = result.response;
      model = result.model;
    }
    
    return new Response(
      JSON.stringify({ response, model }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

async function callGroq(transcript: string, mode: string, gdTopic?: string, knowledge?: string) {
  const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
  
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }
  
  const systemPrompt = `You are a professional interview coach providing high-quality, detailed responses to ${mode === "interview" ? "job interview questions" : "group discussion topics"}. ${
    mode === "gd" && gdTopic ? `The group discussion topic is: ${gdTopic}.` : ""
  }
  
  ${knowledge ? `Here is information about the user that you should use to personalize your response (this is the user's resume and professional background):
  
  ${knowledge}
  
  Tailor your response based on this background information when relevant. If asked about the user's experience, skills, or background, reference this information.` : ""}

  Your goal is to provide detailed, thoughtful and professional responses that would impress an interviewer.
  Keep responses clear, well-structured, and comprehensive.`;

  const payload = {
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: transcript,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.7,
    max_tokens: 800,
  };

  console.log(`Calling Groq API with: ${JSON.stringify(payload, null, 2)}`);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error("Groq API error:", data);
    throw new Error(data.error?.message || "Error calling Groq API");
  }

  return {
    response: data.choices[0].message.content,
    model: "LLama3-8b (Groq)",
  };
}

async function callOpenRouter(transcript: string, mode: string, gdTopic?: string, knowledge?: string) {
  const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
  
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }
  
  const systemPrompt = `You are a professional interview coach providing high-quality, detailed responses to ${mode === "interview" ? "job interview questions" : "group discussion topics"}. ${
    mode === "gd" && gdTopic ? `The group discussion topic is: ${gdTopic}.` : ""
  }
  
  ${knowledge ? `Here is information about the user that you should use to personalize your response (this is the user's resume and professional background):
  
  ${knowledge}
  
  Tailor your response based on this background information when relevant. If asked about the user's experience, skills, or background, reference this information.` : ""}

  Your goal is to provide detailed, thoughtful and professional responses that would impress an interviewer.
  Keep responses clear, well-structured, and comprehensive.`;

  const payload = {
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: transcript,
      },
    ],
    model: "google/gemma-3-8b",
    temperature: 0.7,
    max_tokens: 800,
  };

  console.log(`Calling OpenRouter API with: ${JSON.stringify(payload, null, 2)}`);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://lovable.ai",
      "X-Title": "MeigdAI Interview Assistant",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error("OpenRouter API error:", data);
    throw new Error(data.error?.message || "Error calling OpenRouter API");
  }

  return {
    response: data.choices[0].message.content,
    model: "Gemma 3 8B (OpenRouter)",
  };
}
