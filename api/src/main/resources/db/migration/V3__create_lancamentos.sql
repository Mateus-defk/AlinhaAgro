CREATE TABLE lancamentos (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    area_id     UUID         REFERENCES areas(id) ON DELETE SET NULL,
    tipo        VARCHAR(10)  NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    categoria   VARCHAR(80)  NOT NULL,
    descricao   VARCHAR(255),
    valor       NUMERIC(12,2) NOT NULL CHECK (valor > 0),
    data        DATE          NOT NULL,
    criado_em   TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_lancamentos_user_id ON lancamentos(user_id);
CREATE INDEX idx_lancamentos_area_id ON lancamentos(area_id);
CREATE INDEX idx_lancamentos_data    ON lancamentos(data DESC);