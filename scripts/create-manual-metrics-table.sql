-- Criar tabela para métricas manuais diárias
CREATE TABLE IF NOT EXISTS daily_metrics_manual (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  
  -- Vendas AFILIA360
  afilia_basic_qty INTEGER DEFAULT 0,
  afilia_basic_revenue NUMERIC(10,2) DEFAULT 0,
  afilia_pro_qty INTEGER DEFAULT 0,
  afilia_pro_revenue NUMERIC(10,2) DEFAULT 0,
  
  -- Vendas de Afiliados
  affiliate_qty INTEGER DEFAULT 0,
  affiliate_revenue NUMERIC(10,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca por data
CREATE INDEX IF NOT EXISTS idx_daily_metrics_manual_date ON daily_metrics_manual(date);

-- Comentários
COMMENT ON TABLE daily_metrics_manual IS 'Métricas diárias inseridas manualmente';
COMMENT ON COLUMN daily_metrics_manual.afilia_basic_qty IS 'Quantidade de vendas AFILIA360 BÁSICO';
COMMENT ON COLUMN daily_metrics_manual.afilia_basic_revenue IS 'Faturamento AFILIA360 BÁSICO';
COMMENT ON COLUMN daily_metrics_manual.afilia_pro_qty IS 'Quantidade de vendas AFILIA360 PRO';
COMMENT ON COLUMN daily_metrics_manual.afilia_pro_revenue IS 'Faturamento AFILIA360 PRO';
COMMENT ON COLUMN daily_metrics_manual.affiliate_qty IS 'Quantidade de vendas de afiliados';
COMMENT ON COLUMN daily_metrics_manual.affiliate_revenue IS 'Faturamento de afiliados';
