CREATE TABLE areas (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nome           VARCHAR(100) NOT NULL,
    tamanho_ha     NUMERIC(10,4) NOT NULL CHECK (tamanho_ha > 0),
    cultura        VARCHAR(100) NOT NULL,
    data_plantio   DATE,
    status         VARCHAR(20)  NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'inativa', 'colhida')),
    observacoes    TEXT,
    criado_em      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_areas_user_id ON areas(user_id);