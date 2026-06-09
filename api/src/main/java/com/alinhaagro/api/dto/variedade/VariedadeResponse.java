package com.alinhaagro.api.dto.variedade;

import com.alinhaagro.api.domain.Variedade;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record VariedadeResponse(
        UUID id,
        String nome,
        String fruta,
        BigDecimal pesoMedioKg,
        Integer cicloDias,
        String mesColheita,
        String obs,
        Instant criadoEm
) {
    public static VariedadeResponse from(Variedade v) {
        return new VariedadeResponse(
                v.getId(), v.getNome(), v.getFruta(),
                v.getPesoMedioKg(), v.getCicloDias(), v.getMesColheita(),
                v.getObs(), v.getCriadoEm());
    }
}