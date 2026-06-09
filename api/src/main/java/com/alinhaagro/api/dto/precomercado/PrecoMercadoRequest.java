package com.alinhaagro.api.dto.precomercado;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PrecoMercadoRequest(
        @NotBlank @Size(max = 100) String cultura,
        @NotNull @DecimalMin("0.0001") BigDecimal precoKg,
        @Size(max = 150) String fonte,
        @NotNull LocalDate data
) {}