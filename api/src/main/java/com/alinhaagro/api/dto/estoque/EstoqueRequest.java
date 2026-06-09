package com.alinhaagro.api.dto.estoque;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record EstoqueRequest(
        UUID areaId,
        @NotBlank @Size(max = 150) String produto,
        @NotBlank @Pattern(regexp = "semente|fertilizante|defensivo|outro") String tipo,
        @NotNull @DecimalMin("0") BigDecimal quantidade,
        @NotBlank @Size(max = 20) String unidade,
        @DecimalMin("0") BigDecimal custoUnitario,
        LocalDate validade
) {}