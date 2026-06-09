package com.alinhaagro.api.controller;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.maodeobra.MaoDeObraRequest;
import com.alinhaagro.api.dto.maodeobra.MaoDeObraResponse;
import com.alinhaagro.api.service.MaoDeObraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/mao-de-obra")
@RequiredArgsConstructor
public class MaoDeObraController {

    private final MaoDeObraService maoDeObraService;

    @GetMapping
    public List<MaoDeObraResponse> listar(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) UUID areaId) {
        return maoDeObraService.listar(user, areaId);
    }

    @GetMapping("/{id}")
    public MaoDeObraResponse buscar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        return maoDeObraService.buscar(user, id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MaoDeObraResponse criar(@AuthenticationPrincipal User user, @Valid @RequestBody MaoDeObraRequest req) {
        return maoDeObraService.criar(user, req);
    }

    @PutMapping("/{id}")
    public MaoDeObraResponse atualizar(@AuthenticationPrincipal User user,
                                       @PathVariable UUID id,
                                       @Valid @RequestBody MaoDeObraRequest req) {
        return maoDeObraService.atualizar(user, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        maoDeObraService.deletar(user, id);
    }
}