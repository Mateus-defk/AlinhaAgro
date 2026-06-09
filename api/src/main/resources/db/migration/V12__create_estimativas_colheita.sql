CREATE TABLE estimativas_colheita (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    area_id   UUID REFERENCES areas(id) ON DELETE SET NULL,
    kg_est    NUMERIC(12,2) NOT NULL DEFAULT 0,
    kg_real   NUMERIC(12,2),
    preco     NUMERIC(10,2) NOT NULL DEFAULT 0,
    desc_pct  NUMERIC(5,2)  NOT NULL DEFAULT 0,
    custo_c   NUMERIC(12,2) NOT NULL DEFAULT 0,
    criado_em TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_estimativas_colheita_user_id ON estimativas_colheita(user_id);