package com.alinhaagro.api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 100) String nome,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 72) String senha,
        String plano
) {}