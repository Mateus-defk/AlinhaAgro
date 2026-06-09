package com.alinhaagro.api.dto.variedade;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record VariedadeRequest(
        @NotBlank @Size(max = 100) String nome,
        @Size(max = 50) String fruta,
        @DecimalMin("0.01") BigDecimal pesoMedioKg,
        @Min(1) Integer cicloDias,
        @Size(max = 30) String mesColheita,
        String obs
) {}