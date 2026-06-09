package com.alinhaagro.api.dto.produto;

import com.alinhaagro.api.domain.Produto;

import java.time.Instant;
import java.util.UUID;

public record ProdutoResponse(
        UUID id,
        String nome,
        String tipo,
        String unidade,
        String principioAtivo,
        String obs,
        Instant criadoEm
) {
    public static ProdutoResponse from(Produto p) {
        return new ProdutoResponse(
                p.getId(), p.getNome(), p.getTipo(),
                p.getUnidade(), p.getPrincipioAtivo(),
                p.getObs(), p.getCriadoEm());
    }
}