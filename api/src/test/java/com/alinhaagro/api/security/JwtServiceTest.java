package com.alinhaagro.api.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String SECRET = "test_secret_minimum_256_bits_for_hs256_algorithm_placeholder";
    private static final long ACCESS_EXP  = 900L;
    private static final long REFRESH_EXP = 604800L;

    private JwtService jwtService;
    private UUID userId;
    private String email;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET, ACCESS_EXP, REFRESH_EXP);
        userId = UUID.randomUUID();
        email  = "usuario@teste.com";
    }

    @Test
    void accessToken_isRecognizedAsAccessType() {
        String token = jwtService.generateAccessToken(userId, email);
        assertThat(jwtService.isAccessToken(token)).isTrue();
        assertThat(jwtService.isRefreshToken(token)).isFalse();
    }

    @Test
    void refreshToken_isRecognizedAsRefreshType() {
        String token = jwtService.generateRefreshToken(userId, email);
        assertThat(jwtService.isRefreshToken(token)).isTrue();
        assertThat(jwtService.isAccessToken(token)).isFalse();
    }

    @Test
    void extractEmail_returnsCorrectEmail() {
        String token = jwtService.generateAccessToken(userId, email);
        assertThat(jwtService.extractEmail(token)).isEqualTo(email);
    }

    @Test
    void extractUserId_returnsCorrectId() {
        String token = jwtService.generateAccessToken(userId, email);
        assertThat(jwtService.extractUserId(token)).isEqualTo(userId.toString());
    }

    @Test
    void isAccessToken_returnsFalse_forGarbage() {
        assertThat(jwtService.isAccessToken("isso.nao.e.um.token")).isFalse();
    }

    @Test
    void parse_throwsOnTamperedToken() {
        String token = jwtService.generateAccessToken(userId, email);
        String tampered = token.substring(0, token.length() - 5) + "XXXXX";
        assertThatThrownBy(() -> jwtService.parse(tampered));
    }
}