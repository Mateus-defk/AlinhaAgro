package com.alinhaagro.api.dto.praga;

import com.alinhaagro.api.domain.AcaoPraga;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record AcaoPragaResponse(
        UUID id,
        UUID pragaId,
        String descricao,
        String produtoUsado,
        BigDecimal custo,
        LocalDate dataAplicacao,
        Instant criadoEm
) {
    public static AcaoPragaResponse from(AcaoPraga a) {
        return new AcaoPragaResponse(a.getId(), a.getPraga().getId(),
                a.getDescricao(), a.getProdutoUsado(), a.getCusto(),
                a.getDataAplicacao(), a.getCriadoEm());
    }
}