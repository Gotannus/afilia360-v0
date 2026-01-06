-- Inserir usuário administrador
-- Email: rtmacedo2@hotmail.com
-- Senha: Prego4188!

INSERT INTO affiliates (name, email, whatsapp, password, status, is_admin, created_at)
VALUES (
  'Administrador',
  'rtmacedo2@hotmail.com',
  '',
  'Prego4188!',
  'approved',
  true,
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
  password = 'Prego4188!',
  status = 'approved',
  is_admin = true;
