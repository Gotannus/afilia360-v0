-- Adicionar coluna de despesas na tabela de métricas manuais
ALTER TABLE daily_metrics_manual 
ADD COLUMN IF NOT EXISTS expenses NUMERIC(10, 2) DEFAULT 0;

-- Adicionar coluna de status de validação na tabela de produtos
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'disponivel' 
CHECK (validation_status IN ('disponivel', 'em-breve', 'em-validacao'));

-- Comentário para descrever os campos
COMMENT ON COLUMN daily_metrics_manual.expenses IS 'Despesas operacionais do dia (marketing, IA, hospedagem, contador, etc)';
COMMENT ON COLUMN products.validation_status IS 'Status de validação do produto: disponivel, em-breve, em-validacao';
