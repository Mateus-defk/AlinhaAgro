package com.alinhaagro.api.dto.precomercado;

import com.alinhaagro.api.domain.PrecoMercado;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PrecoMercadoResponse(
        UUID id,
        String cultura,
        BigDecimal precoKg,
        String fonte,
        LocalDate data,
        Instant criadoEm
) {
    public static PrecoMercadoResponse from(PrecoMercado p) {
        return new PrecoMercadoResponse(p.getId(), p.getCultura(),
                p.getPrecoKg(), p.getFonte(), p.getData(), p.getCriadoEm());
    }
}