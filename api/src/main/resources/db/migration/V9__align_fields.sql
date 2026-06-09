-- V9: Alinha colunas do banco com o modelo do frontend
-- Areas: renomeia campos + adiciona colheita
-- Lancamentos: adiciona fornecedor + expande tipo para incluir investimento

-- ── AREAS: renomear colunas ────────────────────────────────────────────────
ALTER TABLE areas RENAME COLUMN tamanho_ha   TO ha;
ALTER TABLE areas RENAME COLUMN cultura      TO variedade;
ALTER TABLE areas RENAME COLUMN data_plantio TO plantio;
ALTER TABLE areas RENAME COLUMN observacoes  TO obs;

-- Adicionar meses de colheita (1–12)
ALTER TABLE areas ADD COLUMN colheita_ini INTEGER CHECK (colheita_ini BETWEEN 1 AND 12);
ALTER TABLE areas ADD COLUMN colheita_fim INTEGER CHECK (colheita_fim BETWEEN 1 AND 12);

-- ── LANCAMENTOS: novo campo + ampliar constraint de tipo ───────────────────
ALTER TABLE lancamentos ADD COLUMN fornecedor VARCHAR(150);

-- Remove a constraint inline de tipo (nome gerado automaticamente pelo Postgres)
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'lancamentos'::regclass
      AND contype  = 'c'
      AND pg_get_constraintdef(oid) LIKE '%receita%'
  LOOP
    EXECUTE 'ALTER TABLE lancamentos DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END $$;

ALTER TABLE lancamentos
    ALTER COLUMN tipo TYPE VARCHAR(15),
    ADD CONSTRAINT lancamentos_tipo_check
        CHECK (tipo IN ('receita', 'despesa', 'investimento'));
