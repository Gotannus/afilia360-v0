-- Tabela de afiliados pendentes de aprovação
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  whatsapp TEXT NOT NULL,
  -- Adicionar campos password, is_admin e password_hash
  password TEXT,
  password_hash TEXT,
  is_admin BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID
);

-- Habilitar RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- Políticas para affiliates
DROP POLICY IF EXISTS "Anyone can insert affiliate registration" ON public.affiliates;
CREATE POLICY "Anyone can insert affiliate registration" ON public.affiliates
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view affiliates" ON public.affiliates;
CREATE POLICY "Anyone can view affiliates" ON public.affiliates
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can update affiliates" ON public.affiliates;
CREATE POLICY "Anyone can update affiliates" ON public.affiliates
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete affiliates" ON public.affiliates;
CREATE POLICY "Anyone can delete affiliates" ON public.affiliates
  FOR DELETE USING (true);

-- Inserir usuário administrador
INSERT INTO public.affiliates (name, email, whatsapp, password, status, is_admin)
VALUES (
  'Administrador',
  'rtmacedo2@hotmail.com',
  '',
  'Prego4188!',
  'approved',
  true
)
ON CONFLICT (email) 
DO UPDATE SET 
  password = 'Prego4188!',
  status = 'approved',
  is_admin = true;
