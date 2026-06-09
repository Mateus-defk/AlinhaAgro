package com.alinhaagro.api.dto.auth;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tipo,
        String plano,
        int expiraEm
) {}