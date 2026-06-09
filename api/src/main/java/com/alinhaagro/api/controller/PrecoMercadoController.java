package com.alinhaagro.api.controller;

import com.alinhaagro.api.dto.precomercado.PrecoMercadoRequest;
import com.alinhaagro.api.dto.precomercado.PrecoMercadoResponse;
import com.alinhaagro.api.service.PrecoMercadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/precos-mercado")
@RequiredArgsConstructor
public class PrecoMercadoController {

    private final PrecoMercadoService precoMercadoService;

    @GetMapping
    public List<PrecoMercadoResponse> listar(@RequestParam(required = false) String cultura) {
        return precoMercadoService.listar(cultura);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PrecoMercadoResponse criar(@Valid @RequestBody PrecoMercadoRequest req) {
        return precoMercadoService.criar(req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable UUID id) {
        precoMercadoService.deletar(id);
    }
}