CREATE TABLE produtos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nome            VARCHAR(150) NOT NULL,
    tipo            VARCHAR(15)  NOT NULL CHECK (tipo IN ('organico', 'quimico')),
    unidade         VARCHAR(20)  NOT NULL DEFAULT 'kg',
    principio_ativo VARCHAR(150),
    obs             TEXT,
    criado_em       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_produtos_user_id ON produtos(user_id);