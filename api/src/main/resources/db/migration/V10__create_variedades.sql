CREATE TABLE variedades (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nome         VARCHAR(100) NOT NULL,
    fruta        VARCHAR(50)  NOT NULL DEFAULT 'Manga',
    peso_medio_kg NUMERIC(6,2) CHECK (peso_medio_kg > 0),
    ciclo_dias   INTEGER      CHECK (ciclo_dias > 0),
    mes_colheita VARCHAR(30),
    obs          TEXT,
    criado_em    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_variedades_user_id ON variedades(user_id);