package com.alinhaagro.api.dto.praga;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.UUID;

public record PragaRequest(
        UUID areaId,
        @NotBlank @Size(max = 150) String nome,
        @NotBlank @Pattern(regexp = "praga|doenca|erva-daninha") String tipo,
        @Pattern(regexp = "baixo|medio|alto|critico") String nivelSeveridade,
        @NotNull LocalDate dataIdentificacao,
        @Size(max = 2000) String observacoes
) {}