package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.Produto;
import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.produto.ProdutoRequest;
import com.alinhaagro.api.dto.produto.ProdutoResponse;
import com.alinhaagro.api.exception.ResourceNotFoundException;
import com.alinhaagro.api.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final PlanLimitService planLimitService;

    public List<ProdutoResponse> listar(User user) {
        return produtoRepository.findByUserIdOrderByNomeAsc(user.getId())
                .stream().map(ProdutoResponse::from).toList();
    }

    @Transactional
    public ProdutoResponse criar(User user, ProdutoRequest req) {
        planLimitService.checkProdutosLimit(user.getId(), user.getPlano());

        var produto = Produto.builder()
                .user(user)
                .nome(req.nome())
                .tipo(req.tipo())
                .unidade(req.unidade())
                .principioAtivo(req.principioAtivo())
                .obs(req.obs())
                .build();

        return ProdutoResponse.from(produtoRepository.save(produto));
    }

    @Transactional
    public void deletar(User user, UUID id) {
        var produto = produtoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id));
        produtoRepository.delete(produto);
    }
}