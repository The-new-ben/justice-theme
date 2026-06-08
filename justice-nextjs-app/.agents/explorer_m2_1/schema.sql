-- Supabase PostgreSQL Reviews Schema & Policies
-- Path: src/lib/schema.sql (Proposed)

-- 1. Create the reviews table with constraints
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_name TEXT NOT NULL CONSTRAINT name_not_empty CHECK (char_length(trim(reviewer_name)) > 0),
    reviewer_role TEXT NOT NULL CONSTRAINT valid_role CHECK (reviewer_role IN ('Client', 'Colleague', 'Google')),
    rating INTEGER NOT NULL CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL CONSTRAINT content_not_empty CHECK (char_length(trim(content)) > 0),
    approval_status BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_reviews_approval_status ON public.reviews (approval_status);
CREATE INDEX IF NOT EXISTS idx_reviews_role ON public.reviews (reviewer_role) WHERE approval_status = true;
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews (created_at DESC);

-- 3. Enable Row-Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Policy A: Allow public read access only to approved reviews
CREATE POLICY "Allow public read of approved reviews" 
ON public.reviews 
FOR SELECT 
USING (approval_status = true);

-- Policy B: Allow anyone to insert a new review, but force its initial status to pending (false)
CREATE POLICY "Allow public insert of pending reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (approval_status = false);

-- Policy C: Allow administrative update access to authenticated users / service_role
CREATE POLICY "Allow admin updates to reviews" 
ON public.reviews 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Policy D: Allow administrative delete access to authenticated users / service_role
CREATE POLICY "Allow admin deletions of reviews" 
ON public.reviews 
FOR DELETE 
TO authenticated 
USING (true);
