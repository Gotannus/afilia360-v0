-- Adiciona controle editorial para posts do blog de avisos
ALTER TABLE announcements
ADD COLUMN IF NOT EXISTS publication_status TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Garante integridade dos status permitidos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'announcements_publication_status_check'
  ) THEN
    ALTER TABLE announcements
    ADD CONSTRAINT announcements_publication_status_check
    CHECK (publication_status IN ('draft', 'published'));
  END IF;
END $$;

-- Backfill incremental para não esconder posts já existentes
UPDATE announcements
SET
  publication_status = 'published',
  published_at = COALESCE(published_at, created_at, NOW())
WHERE publication_status IS NULL
   OR publication_status = '';

CREATE INDEX IF NOT EXISTS idx_announcements_publication_status ON announcements(publication_status);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON announcements(published_at DESC);
