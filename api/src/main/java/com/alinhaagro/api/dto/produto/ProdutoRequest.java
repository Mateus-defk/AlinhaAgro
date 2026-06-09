package com.alinhaagro.api.dto.produto;

import jakarta.validation.constraints.*;

public record ProdutoRequest(
        @NotBlank @Size(max = 150) String nome,
        @NotBlank @Pattern(regexp = "organico|quimico") String tipo,
        @NotBlank @Size(max = 20) String unidade,
        @Size(max = 150) String principioAtivo,
        String obs
) {}