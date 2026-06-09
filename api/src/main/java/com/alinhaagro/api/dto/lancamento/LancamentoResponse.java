package com.alinhaagro.api.dto.lancamento;

import com.alinhaagro.api.domain.Lancamento;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record LancamentoResponse(
        UUID id,
        UUID areaId,
        String areaNome,
        String tipo,
        String categoria,
        String descricao,
        String fornecedor,
        BigDecimal valor,
        LocalDate data,
        Instant criadoEm
) {
    public static LancamentoResponse from(Lancamento l) {
        return new LancamentoResponse(
                l.getId(),
                l.getArea() != null ? l.getArea().getId()   : null,
                l.getArea() != null ? l.getArea().getNome() : null,
                l.getTipo(), l.getCategoria(), l.getDescricao(),
                l.getFornecedor(), l.getValor(), l.getData(), l.getCriadoEm());
    }
}
