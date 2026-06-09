package com.alinhaagro.api.dto.maodeobra;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record MaoDeObraRequest(
        UUID areaId,
        @NotBlank @Size(max = 255) String descricao,
        @NotBlank @Pattern(regexp = "diarista|mensalista|empreitada") String tipo,
        @Min(1) Integer quantidadePessoas,
        @NotNull @DecimalMin("0.01") BigDecimal valorTotal,
        @NotNull LocalDate data
) {}