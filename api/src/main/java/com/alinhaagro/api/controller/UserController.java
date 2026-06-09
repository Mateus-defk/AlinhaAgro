package com.alinhaagro.api.controller;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.user.UserResponse;
import com.alinhaagro.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal User user) {
        return UserResponse.from(user);
    }

    @GetMapping
    public List<UserResponse> listarTodos(@AuthenticationPrincipal User user) {
        if (!"admin".equals(user.getPlano())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return userRepository.findAll().stream()
                .filter(u -> !"admin".equals(u.getPlano()))
                .map(UserResponse::from)
                .toList();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@AuthenticationPrincipal User admin, @PathVariable UUID id) {
        if (!"admin".equals(admin.getPlano())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        if (admin.getId().equals(id)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível remover a própria conta.");
        userRepository.deleteById(id);
    }
}