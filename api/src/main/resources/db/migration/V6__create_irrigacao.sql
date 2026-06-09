CREATE TABLE irrigacao (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    area_id       UUID          REFERENCES areas(id) ON DELETE SET NULL,
    data          DATE          NOT NULL,
    duracao_min   INTEGER       NOT NULL CHECK (duracao_min > 0),
    lamina_mm     NUMERIC(8,2),
    custo         NUMERIC(12,2),
    observacoes   TEXT,
    criado_em     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_irrigacao_user_id ON irrigacao(user_id);
CREATE INDEX idx_irrigacao_data    ON irrigacao(data DESC);