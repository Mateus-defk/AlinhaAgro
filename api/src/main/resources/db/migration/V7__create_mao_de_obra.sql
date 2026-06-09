CREATE TABLE mao_de_obra (
    id                 UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    area_id            UUID          REFERENCES areas(id) ON DELETE SET NULL,
    descricao          VARCHAR(255)  NOT NULL,
    tipo               VARCHAR(20)   NOT NULL CHECK (tipo IN ('diarista', 'mensalista', 'empreitada')),
    quantidade_pessoas INTEGER       NOT NULL DEFAULT 1 CHECK (quantidade_pessoas > 0),
    valor_total        NUMERIC(12,2) NOT NULL CHECK (valor_total > 0),
    data               DATE          NOT NULL,
    criado_em          TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_mao_de_obra_user_id ON mao_de_obra(user_id);
CREATE INDEX idx_mao_de_obra_data    ON mao_de_obra(data DESC);