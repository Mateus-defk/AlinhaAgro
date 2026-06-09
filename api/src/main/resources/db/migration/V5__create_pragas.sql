CREATE TABLE pragas (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    area_id             UUID        REFERENCES areas(id) ON DELETE SET NULL,
    nome                VARCHAR(150) NOT NULL,
    tipo                VARCHAR(20)  NOT NULL CHECK (tipo IN ('praga', 'doenca', 'erva-daninha')),
    nivel_severidade    VARCHAR(20)  NOT NULL DEFAULT 'baixo' CHECK (nivel_severidade IN ('baixo', 'medio', 'alto', 'critico')),
    data_identificacao  DATE         NOT NULL,
    observacoes         TEXT,
    criado_em           TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE acoes_praga (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    praga_id        UUID          NOT NULL REFERENCES pragas(id) ON DELETE CASCADE,
    descricao       VARCHAR(255)  NOT NULL,
    produto_usado   VARCHAR(150),
    custo           NUMERIC(12,2),
    data_aplicacao  DATE          NOT NULL,
    criado_em       TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_pragas_user_id  ON pragas(user_id);
CREATE INDEX idx_pragas_area_id  ON pragas(area_id);
CREATE INDEX idx_acoes_praga_id  ON acoes_praga(praga_id);