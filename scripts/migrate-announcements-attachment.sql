-- Adiciona coluna attachment_url para PDFs/anexos enviados via Vercel Blob
ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS attachment_url text,
  ADD COLUMN IF NOT EXISTS attachment_name text;
