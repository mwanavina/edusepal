-- Add rich_description column to courses table for Tiptap editor support
-- This allows storing HTML-formatted course descriptions with full formatting support

ALTER TABLE public.courses 
ADD COLUMN rich_description TEXT;

-- Add comment explaining the column
COMMENT ON COLUMN public.courses.rich_description IS 
'Rich HTML description of the course created with Tiptap editor. Supports formatting, lists, images, and links.';

-- Create index for searching
CREATE INDEX idx_courses_rich_description ON public.courses USING GIN (
  to_tsvector('english', COALESCE(rich_description, ''))
);
