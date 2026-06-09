package com.alinhaagro.api.controller;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.estimativa.EstimativaColheitaRequest;
import com.alinhaagro.api.dto.estimativa.EstimativaColheitaResponse;
import com.alinhaagro.api.service.EstimativaColheitaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/estimativas")
@RequiredArgsConstructor
public class EstimativaColheitaController {

    private final EstimativaColheitaService estimativaService;

    @GetMapping
    public List<EstimativaColheitaResponse> listar(@AuthenticationPrincipal User user) {
        return estimativaService.listar(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EstimativaColheitaResponse criar(@AuthenticationPrincipal User user,
                                            @Valid @RequestBody EstimativaColheitaRequest req) {
        return estimativaService.criar(user, req);
    }

    @PutMapping("/{id}")
    public EstimativaColheitaResponse atualizar(@AuthenticationPrincipal User user,
                                                @PathVariable UUID id,
                                                @Valid @RequestBody EstimativaColheitaRequest req) {
        return estimativaService.atualizar(user, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        estimativaService.deletar(user, id);
    }
}