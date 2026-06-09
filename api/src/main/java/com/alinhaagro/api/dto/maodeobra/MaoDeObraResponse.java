package com.alinhaagro.api.dto.maodeobra;

import com.alinhaagro.api.domain.MaoDeObra;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record MaoDeObraResponse(
        UUID id,
        UUID areaId,
        String descricao,
        String tipo,
        Integer quantidadePessoas,
        BigDecimal valorTotal,
        LocalDate data,
        Instant criadoEm
) {
    public static MaoDeObraResponse from(MaoDeObra m) {
        return new MaoDeObraResponse(m.getId(),
                m.getArea() != null ? m.getArea().getId() : null,
                m.getDescricao(), m.getTipo(), m.getQuantidadePessoas(),
                m.getValorTotal(), m.getData(), m.getCriadoEm());
    }
}