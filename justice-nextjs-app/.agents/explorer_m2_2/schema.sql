-- Reviews Table Migration / Schema
-- Project: Jus-Tice Portal (Hebrew legal matching)

-- 1. Create check constraints or custom domain/enum for reviewer role
-- We support two approaches: Check constraint on TEXT or Enum type.
-- Here we propose a CHECK constraint on TEXT because it is easier to modify or run migrations offline.
-- Alternatively, `CREATE TYPE reviewer_role_type AS ENUM ('Client', 'Colleague', 'Google');`

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_name TEXT NOT NULL,
    reviewer_role TEXT NOT NULL CHECK (reviewer_role IN ('Client', 'Colleague', 'Google')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    approval_status BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS Policies
-- Policy: Anyone can view approved reviews
CREATE POLICY "Allow public read access to approved reviews" 
ON public.reviews 
FOR SELECT 
USING (approval_status = true);

-- Policy: Anyone can insert a new review (will be pending by default)
CREATE POLICY "Allow public insert access" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- Policy: Admin can do all operations (update/delete/select)
-- For demonstration/testing, we can allow authenticated admins or service role client.
-- In Supabase, the service role key bypasses RLS policies entirely.
-- We can create a policy for approved updates:
CREATE POLICY "Allow admin update" 
ON public.reviews 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- 3. Indexes for query optimization
CREATE INDEX IF NOT EXISTS idx_reviews_approval_status ON public.reviews(approval_status);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_role ON public.reviews(reviewer_role);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
