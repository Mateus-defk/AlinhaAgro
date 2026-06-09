package com.alinhaagro.api.dto.area;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AreaRequest(
        @NotBlank @Size(max = 100) String nome,
        @NotNull @DecimalMin("0.0001") BigDecimal ha,
        @NotBlank @Size(max = 100) String variedade,
        LocalDate plantio,
        @Pattern(regexp = "ativa|inativa|colhida") String status,
        @Size(max = 2000) String obs,
        @Min(1) @Max(12) Integer colheitaIni,
        @Min(1) @Max(12) Integer colheitaFim
) {}
