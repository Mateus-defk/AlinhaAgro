package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.auth.LoginRequest;
import com.alinhaagro.api.dto.auth.RefreshRequest;
import com.alinhaagro.api.dto.auth.RegisterRequest;
import com.alinhaagro.api.exception.EmailJaCadastradoException;
import com.alinhaagro.api.exception.TokenInvalidoException;
import com.alinhaagro.api.repository.UserRepository;
import com.alinhaagro.api.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock AuthenticationManager authenticationManager;

    @InjectMocks AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(UUID.randomUUID())
                .nome("Natanael")
                .email("natanael@teste.com")
                .senhaHash("$2a$12$hash")
                .plano("mensal")
                .ativo(true)
                .build();
    }

    @Test
    void register_savesUser_andReturnsTokens() {
        var req = new RegisterRequest("Natanael", "natanael@teste.com", "senha123", null);
        when(userRepository.existsByEmail(req.email())).thenReturn(false);
        when(passwordEncoder.encode(req.senha())).thenReturn("$2a$12$hash");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateAccessToken(any(), any())).thenReturn("access.token");
        when(jwtService.generateRefreshToken(any(), any())).thenReturn("refresh.token");

        var response = authService.register(req);

        assertThat(response.accessToken()).isEqualTo("access.token");
        assertThat(response.refreshToken()).isEqualTo("refresh.token");
        assertThat(response.plano()).isEqualTo("mensal");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_throwsEmailJaCadastrado_whenEmailExists() {
        var req = new RegisterRequest("Nome", "existente@teste.com", "senha123", null);
        when(userRepository.existsByEmail(req.email())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(EmailJaCadastradoException.class);
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_usesPlanoFromRequest_whenProvided() {
        var req = new RegisterRequest("Nome", "novo@teste.com", "senha123", "anual");
        var savedUser = User.builder().id(UUID.randomUUID()).email("novo@teste.com").plano("anual").ativo(true).build();
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hash");
        when(userRepository.save(any())).thenReturn(savedUser);
        when(jwtService.generateAccessToken(any(), any())).thenReturn("tok");
        when(jwtService.generateRefreshToken(any(), any())).thenReturn("ref");

        var response = authService.register(req);
        assertThat(response.plano()).isEqualTo("anual");
    }

    @Test
    void login_returnsTokens_onValidCredentials() {
        var req = new LoginRequest("natanael@teste.com", "senha123");
        when(userRepository.findByEmail(req.email())).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(any(), any())).thenReturn("access.token");
        when(jwtService.generateRefreshToken(any(), any())).thenReturn("refresh.token");

        var response = authService.login(req);

        assertThat(response.accessToken()).isEqualTo("access.token");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_throws_onBadCredentials() {
        var req = new LoginRequest("natanael@teste.com", "errada");
        doThrow(new BadCredentialsException("bad")).when(authenticationManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void refresh_returnsNewAccessToken_onValidRefreshToken() {
        var req = new RefreshRequest("valid.refresh.token");
        when(jwtService.isRefreshToken("valid.refresh.token")).thenReturn(true);
        when(jwtService.extractEmail("valid.refresh.token")).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(any(), any())).thenReturn("new.access");
        when(jwtService.generateRefreshToken(any(), any())).thenReturn("new.refresh");

        var response = authService.refresh(req);
        assertThat(response.accessToken()).isEqualTo("new.access");
    }

    @Test
    void refresh_throws_whenTokenIsNotRefreshType() {
        var req = new RefreshRequest("access.token.not.refresh");
        when(jwtService.isRefreshToken("access.token.not.refresh")).thenReturn(false);

        assertThatThrownBy(() -> authService.refresh(req))
                .isInstanceOf(TokenInvalidoException.class);
    }
}