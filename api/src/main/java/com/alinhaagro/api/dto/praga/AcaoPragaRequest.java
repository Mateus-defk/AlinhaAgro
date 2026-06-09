package com.alinhaagro.api.dto.praga;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AcaoPragaRequest(
        @NotBlank @Size(max = 255) String descricao,
        @Size(max = 150) String produtoUsado,
        @DecimalMin("0") BigDecimal custo,
        @NotNull LocalDate dataAplicacao
) {}