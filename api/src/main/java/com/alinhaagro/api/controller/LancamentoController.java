package com.alinhaagro.api.controller;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.lancamento.LancamentoRequest;
import com.alinhaagro.api.dto.lancamento.LancamentoResponse;
import com.alinhaagro.api.dto.lancamento.LancamentoResumoResponse;
import com.alinhaagro.api.service.LancamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lancamentos")
@RequiredArgsConstructor
public class LancamentoController {

    private final LancamentoService lancamentoService;

    @GetMapping
    public List<LancamentoResponse> listar(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) UUID areaId) {
        return lancamentoService.listar(user, tipo, areaId);
    }

    @GetMapping("/resumo")
    public LancamentoResumoResponse resumo(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return lancamentoService.resumo(user, inicio, fim);
    }

    @GetMapping("/{id}")
    public LancamentoResponse buscar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        return lancamentoService.buscar(user, id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LancamentoResponse criar(@AuthenticationPrincipal User user, @Valid @RequestBody LancamentoRequest req) {
        return lancamentoService.criar(user, req);
    }

    @PutMapping("/{id}")
    public LancamentoResponse atualizar(@AuthenticationPrincipal User user,
                                        @PathVariable UUID id,
                                        @Valid @RequestBody LancamentoRequest req) {
        return lancamentoService.atualizar(user, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        lancamentoService.deletar(user, id);
    }
}