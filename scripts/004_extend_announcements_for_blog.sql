-- Expande a tabela announcements para suportar posts longos estilo blog/WordPress
ALTER TABLE announcements
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS link_url TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Índice para facilitar busca por slug na página de detalhe
CREATE INDEX IF NOT EXISTS idx_announcements_slug ON announcements(slug);
