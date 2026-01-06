-- Adicionar campo de senha para autenticação
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS password_hash TEXT;
