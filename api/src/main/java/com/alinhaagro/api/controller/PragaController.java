package com.alinhaagro.api.controller;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.praga.AcaoPragaRequest;
import com.alinhaagro.api.dto.praga.AcaoPragaResponse;
import com.alinhaagro.api.dto.praga.PragaRequest;
import com.alinhaagro.api.dto.praga.PragaResponse;
import com.alinhaagro.api.service.PragaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pragas")
@RequiredArgsConstructor
public class PragaController {

    private final PragaService pragaService;

    @GetMapping
    public List<PragaResponse> listar(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) UUID areaId) {
        return pragaService.listar(user, areaId);
    }

    @GetMapping("/{id}")
    public PragaResponse buscar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        return pragaService.buscar(user, id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PragaResponse criar(@AuthenticationPrincipal User user, @Valid @RequestBody PragaRequest req) {
        return pragaService.criar(user, req);
    }

    @PutMapping("/{id}")
    public PragaResponse atualizar(@AuthenticationPrincipal User user,
                                   @PathVariable UUID id,
                                   @Valid @RequestBody PragaRequest req) {
        return pragaService.atualizar(user, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        pragaService.deletar(user, id);
    }

    @GetMapping("/{id}/acoes")
    public List<AcaoPragaResponse> listarAcoes(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        return pragaService.listarAcoes(user, id);
    }

    @PostMapping("/{id}/acoes")
    @ResponseStatus(HttpStatus.CREATED)
    public AcaoPragaResponse adicionarAcao(@AuthenticationPrincipal User user,
                                           @PathVariable UUID id,
                                           @Valid @RequestBody AcaoPragaRequest req) {
        return pragaService.adicionarAcao(user, id, req);
    }

    @DeleteMapping("/{pragaId}/acoes/{acaoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarAcao(@AuthenticationPrincipal User user,
                            @PathVariable UUID pragaId,
                            @PathVariable UUID acaoId) {
        pragaService.deletarAcao(user, pragaId, acaoId);
    }
}