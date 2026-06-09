package com.alinhaagro.api.dto.estimativa;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record EstimativaColheitaRequest(
        UUID areaId,
        @NotNull @DecimalMin("0") BigDecimal kgEst,
        @DecimalMin("0") BigDecimal kgReal,
        @NotNull @DecimalMin("0") BigDecimal preco,
        @DecimalMin("0") @DecimalMax("100") BigDecimal descPct,
        @DecimalMin("0") BigDecimal custoC
) {}