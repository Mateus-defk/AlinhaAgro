package com.alinhaagro.api.dto.lancamento;

import java.math.BigDecimal;
import java.time.LocalDate;

public record LancamentoResumoResponse(
        BigDecimal totalReceitas,
        BigDecimal totalDespesas,
        BigDecimal saldo,
        Periodo periodo
) {
    public record Periodo(LocalDate inicio, LocalDate fim) {}
}