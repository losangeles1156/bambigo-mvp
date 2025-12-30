-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Add embedding column to stations_static
-- We use 768 dimensions (Google Gemini embedding-001 standard)
-- If using OpenAI (1536), change this to vector(1536)
ALTER TABLE stations_static ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Create HNSW index for efficient similarity search
-- HNSW is preferred over IVFFlat for better performance/recall balance
CREATE INDEX IF NOT EXISTS idx_stations_static_embedding ON stations_static USING hnsw (embedding vector_cosine_ops);

-- Create a function to search stations by embedding similarity
CREATE OR REPLACE FUNCTION match_stations (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id text,
  name jsonb,
  tags jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    stations_static.id,
    stations_static.name,
    stations_static.tags,
    1 - (stations_static.embedding <=> query_embedding) as similarity
  FROM stations_static
  WHERE 1 - (stations_static.embedding <=> query_embedding) > match_threshold
  ORDER BY stations_static.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
