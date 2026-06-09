CREATE TABLE precos_mercado (
    id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    cultura    VARCHAR(100)  NOT NULL,
    preco_kg   NUMERIC(10,4) NOT NULL CHECK (preco_kg > 0),
    fonte      VARCHAR(150),
    data       DATE          NOT NULL,
    criado_em  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_precos_mercado_cultura ON precos_mercado(cultura);
CREATE INDEX idx_precos_mercado_data    ON precos_mercado(data DESC);