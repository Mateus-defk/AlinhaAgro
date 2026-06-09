package com.alinhaagro.api.dto.estoque;

import com.alinhaagro.api.domain.Estoque;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record EstoqueResponse(
        UUID id,
        UUID areaId,
        String produto,
        String tipo,
        BigDecimal quantidade,
        String unidade,
        BigDecimal custoUnitario,
        LocalDate validade,
        Instant criadoEm
) {
    public static EstoqueResponse from(Estoque e) {
        return new EstoqueResponse(e.getId(),
                e.getArea() != null ? e.getArea().getId() : null,
                e.getProduto(), e.getTipo(), e.getQuantidade(), e.getUnidade(),
                e.getCustoUnitario(), e.getValidade(), e.getCriadoEm());
    }
}
