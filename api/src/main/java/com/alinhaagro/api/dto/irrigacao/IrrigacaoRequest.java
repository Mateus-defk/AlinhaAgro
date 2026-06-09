package com.alinhaagro.api.dto.irrigacao;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record IrrigacaoRequest(
        UUID areaId,
        @NotNull LocalDate data,
        @NotNull @Min(1) Integer duracaoMin,
        @DecimalMin("0") BigDecimal laminaMm,
        @DecimalMin("0") BigDecimal custo,
        @Size(max = 2000) String observacoes
) {}