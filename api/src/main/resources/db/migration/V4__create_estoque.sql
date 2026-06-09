CREATE TABLE estoque (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    area_id         UUID          REFERENCES areas(id) ON DELETE SET NULL,
    produto         VARCHAR(150)  NOT NULL,
    tipo            VARCHAR(20)   NOT NULL CHECK (tipo IN ('semente', 'fertilizante', 'defensivo', 'outro')),
    quantidade      NUMERIC(12,3) NOT NULL CHECK (quantidade >= 0),
    unidade         VARCHAR(20)   NOT NULL,
    custo_unitario  NUMERIC(12,2),
    validade        DATE,
    criado_em       TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_estoque_user_id ON estoque(user_id);