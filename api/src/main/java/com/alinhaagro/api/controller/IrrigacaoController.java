package com.alinhaagro.api.controller;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.irrigacao.IrrigacaoRequest;
import com.alinhaagro.api.dto.irrigacao.IrrigacaoResponse;
import com.alinhaagro.api.service.IrrigacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/irrigacao")
@RequiredArgsConstructor
public class IrrigacaoController {

    private final IrrigacaoService irrigacaoService;

    @GetMapping
    public List<IrrigacaoResponse> listar(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) UUID areaId) {
        return irrigacaoService.listar(user, areaId);
    }

    @GetMapping("/{id}")
    public IrrigacaoResponse buscar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        return irrigacaoService.buscar(user, id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IrrigacaoResponse criar(@AuthenticationPrincipal User user, @Valid @RequestBody IrrigacaoRequest req) {
        return irrigacaoService.criar(user, req);
    }

    @PutMapping("/{id}")
    public IrrigacaoResponse atualizar(@AuthenticationPrincipal User user,
                                       @PathVariable UUID id,
                                       @Valid @RequestBody IrrigacaoRequest req) {
        return irrigacaoService.atualizar(user, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        irrigacaoService.deletar(user, id);
    }
}