package com.alinhaagro.api.dto.praga;

import com.alinhaagro.api.domain.Praga;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PragaResponse(
        UUID id,
        UUID areaId,
        String nome,
        String tipo,
        String nivelSeveridade,
        LocalDate dataIdentificacao,
        String observacoes,
        Instant criadoEm
) {
    public static PragaResponse from(Praga p) {
        return new PragaResponse(p.getId(),
                p.getArea() != null ? p.getArea().getId() : null,
                p.getNome(), p.getTipo(), p.getNivelSeveridade(),
                p.getDataIdentificacao(), p.getObservacoes(), p.getCriadoEm());
    }
}