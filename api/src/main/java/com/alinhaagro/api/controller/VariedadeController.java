package com.alinhaagro.api.controller;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.variedade.VariedadeRequest;
import com.alinhaagro.api.dto.variedade.VariedadeResponse;
import com.alinhaagro.api.service.VariedadeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/variedades")
@RequiredArgsConstructor
public class VariedadeController {

    private final VariedadeService variedadeService;

    @GetMapping
    public List<VariedadeResponse> listar(@AuthenticationPrincipal User user) {
        return variedadeService.listar(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VariedadeResponse criar(@AuthenticationPrincipal User user,
                                   @Valid @RequestBody VariedadeRequest req) {
        return variedadeService.criar(user, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        variedadeService.deletar(user, id);
    }
}