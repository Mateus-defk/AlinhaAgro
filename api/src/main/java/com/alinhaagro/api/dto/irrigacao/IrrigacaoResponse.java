package com.alinhaagro.api.dto.irrigacao;

import com.alinhaagro.api.domain.Irrigacao;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record IrrigacaoResponse(
        UUID id,
        UUID areaId,
        LocalDate data,
        Integer duracaoMin,
        BigDecimal laminaMm,
        BigDecimal custo,
        String observacoes,
        Instant criadoEm
) {
    public static IrrigacaoResponse from(Irrigacao i) {
        return new IrrigacaoResponse(i.getId(),
                i.getArea() != null ? i.getArea().getId() : null,
                i.getData(), i.getDuracaoMin(), i.getLaminaMm(),
                i.getCusto(), i.getObservacoes(), i.getCriadoEm());
    }
}