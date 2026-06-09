package com.alinhaagro.api.controller;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.estoque.BaixarEstoqueRequest;
import com.alinhaagro.api.dto.estoque.EstoqueRequest;
import com.alinhaagro.api.dto.estoque.EstoqueResponse;
import com.alinhaagro.api.service.EstoqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/estoque")
@RequiredArgsConstructor
public class EstoqueController {

    private final EstoqueService estoqueService;

    @GetMapping
    public List<EstoqueResponse> listar(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String tipo) {
        return estoqueService.listar(user, tipo);
    }

    @GetMapping("/{id}")
    public EstoqueResponse buscar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        return estoqueService.buscar(user, id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EstoqueResponse criar(@AuthenticationPrincipal User user, @Valid @RequestBody EstoqueRequest req) {
        return estoqueService.criar(user, req);
    }

    @PutMapping("/{id}")
    public EstoqueResponse atualizar(@AuthenticationPrincipal User user,
                                     @PathVariable UUID id,
                                     @Valid @RequestBody EstoqueRequest req) {
        return estoqueService.atualizar(user, id, req);
    }

    @PatchMapping("/{id}/baixar")
    public EstoqueResponse baixar(@AuthenticationPrincipal User user,
                                  @PathVariable UUID id,
                                  @Valid @RequestBody BaixarEstoqueRequest req) {
        return estoqueService.baixar(user, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        estoqueService.deletar(user, id);
    }
}