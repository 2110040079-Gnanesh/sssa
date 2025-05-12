
-- Create table for user knowledge base
CREATE TABLE IF NOT EXISTS public.user_knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own knowledge base"
  ON public.user_knowledge_base
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own knowledge base"
  ON public.user_knowledge_base
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge base"
  ON public.user_knowledge_base
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add trigger to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
