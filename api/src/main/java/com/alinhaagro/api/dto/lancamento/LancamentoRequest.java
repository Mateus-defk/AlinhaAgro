package com.alinhaagro.api.dto.lancamento;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record LancamentoRequest(
        UUID areaId,
        @NotBlank @Pattern(regexp = "receita|despesa|investimento") String tipo,
        @NotBlank @Size(max = 80) String categoria,
        @Size(max = 255) String descricao,
        @Size(max = 150) String fornecedor,
        @NotNull @DecimalMin("0.01") BigDecimal valor,
        @NotNull LocalDate data
) {}
