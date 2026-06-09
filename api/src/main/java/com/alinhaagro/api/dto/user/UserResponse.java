package com.alinhaagro.api.dto.user;

import com.alinhaagro.api.domain.User;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String nome,
        String email,
        String plano,
        boolean ativo,
        Instant criadoEm
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getNome(),
                user.getEmail(),
                user.getPlano(),
                user.isAtivo(),
                user.getCriadoEm()
        );
    }
}