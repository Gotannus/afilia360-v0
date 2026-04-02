-- Adiciona colunas necessárias à tabela announcements
-- A tabela atualmente possui apenas: id, created_at, text, active, type

ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS title       text,
  ADD COLUMN IF NOT EXISTS excerpt     text,
  ADD COLUMN IF NOT EXISTS content     text,
  ADD COLUMN IF NOT EXISTS html_content text,
  ADD COLUMN IF NOT EXISTS cover_url   text,
  ADD COLUMN IF NOT EXISTS link_url    text,
  ADD COLUMN IF NOT EXISTS slug        text,
  ADD COLUMN IF NOT EXISTS content_type character varying DEFAULT 'blog',
  ADD COLUMN IF NOT EXISTS materials   jsonb;
