package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.auth.AuthResponse;
import com.alinhaagro.api.dto.auth.LoginRequest;
import com.alinhaagro.api.dto.auth.RefreshRequest;
import com.alinhaagro.api.dto.auth.RegisterRequest;
import com.alinhaagro.api.exception.EmailJaCadastradoException;
import com.alinhaagro.api.repository.UserRepository;
import com.alinhaagro.api.security.JwtService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${jwt.access-expiration}")
    private int accessExpiration;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new EmailJaCadastradoException(req.email());
        }

        var user = User.builder()
                .nome(req.nome())
                .email(req.email())
                .senhaHash(passwordEncoder.encode(req.senha()))
                .plano(req.plano() != null ? req.plano() : "mensal")
                .build();

        user = userRepository.save(user);
        return buildResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.senha()));

        var user = userRepository.findByEmail(req.email()).orElseThrow();
        return buildResponse(user);
    }

    public AuthResponse refresh(RefreshRequest req) {
        try {
            if (!jwtService.isRefreshToken(req.refreshToken())) {
                throw new JwtException("Token inválido");
            }
            String email = jwtService.extractEmail(req.refreshToken());
            var user = userRepository.findByEmail(email).orElseThrow();
            return buildResponse(user);
        } catch (JwtException e) {
            throw new com.alinhaagro.api.exception.TokenInvalidoException();
        }
    }

    private AuthResponse buildResponse(User user) {
        String access  = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refresh = jwtService.generateRefreshToken(user.getId(), user.getEmail());
        return new AuthResponse(access, refresh, "Bearer", user.getPlano(), accessExpiration);
    }
}