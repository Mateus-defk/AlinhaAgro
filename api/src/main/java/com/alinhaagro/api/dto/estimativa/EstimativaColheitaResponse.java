package com.alinhaagro.api.dto.estimativa;

import com.alinhaagro.api.domain.EstimativaColheita;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record EstimativaColheitaResponse(
        UUID id,
        UUID areaId,
        String areaNome,
        BigDecimal kgEst,
        BigDecimal kgReal,
        BigDecimal preco,
        BigDecimal descPct,
        BigDecimal custoC,
        Instant criadoEm
) {
    public static EstimativaColheitaResponse from(EstimativaColheita e) {
        return new EstimativaColheitaResponse(
                e.getId(),
                e.getArea() != null ? e.getArea().getId()   : null,
                e.getArea() != null ? e.getArea().getNome() : null,
                e.getKgEst(), e.getKgReal(), e.getPreco(),
                e.getDescPct(), e.getCustoC(), e.getCriadoEm());
    }
}