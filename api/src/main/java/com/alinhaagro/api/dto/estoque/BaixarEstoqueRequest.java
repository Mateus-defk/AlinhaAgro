package com.alinhaagro.api.dto.estoque;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record BaixarEstoqueRequest(
        @NotNull @DecimalMin("0.001") BigDecimal quantidade
) {}