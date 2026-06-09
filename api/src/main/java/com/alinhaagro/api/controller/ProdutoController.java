package com.alinhaagro.api.controller;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.produto.ProdutoRequest;
import com.alinhaagro.api.dto.produto.ProdutoResponse;
import com.alinhaagro.api.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    @GetMapping
    public List<ProdutoResponse> listar(@AuthenticationPrincipal User user) {
        return produtoService.listar(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProdutoResponse criar(@AuthenticationPrincipal User user,
                                 @Valid @RequestBody ProdutoRequest req) {
        return produtoService.criar(user, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        produtoService.deletar(user, id);
    }
}