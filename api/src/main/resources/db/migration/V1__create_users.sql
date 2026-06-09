CREATE TABLE users (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    senha_hash  VARCHAR(255) NOT NULL,
    plano       VARCHAR(20)  NOT NULL DEFAULT 'mensal' CHECK (plano IN ('mensal', 'trimestral', 'anual', 'admin')),
    ativo       BOOLEAN      NOT NULL DEFAULT true,
    criado_em   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);