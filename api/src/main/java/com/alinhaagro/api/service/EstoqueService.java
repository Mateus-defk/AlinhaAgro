package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.Area;
import com.alinhaagro.api.domain.Estoque;
import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.estoque.BaixarEstoqueRequest;
import com.alinhaagro.api.dto.estoque.EstoqueRequest;
import com.alinhaagro.api.dto.estoque.EstoqueResponse;
import com.alinhaagro.api.exception.ResourceNotFoundException;
import com.alinhaagro.api.repository.AreaRepository;
import com.alinhaagro.api.repository.EstoqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EstoqueService {

    private final EstoqueRepository estoqueRepository;
    private final AreaRepository areaRepository;
    private final PlanLimitService planLimitService;

    public List<EstoqueResponse> listar(User user, String tipo) {
        if (tipo != null) {
            return estoqueRepository.findByUserIdAndTipoOrderByProdutoAsc(user.getId(), tipo)
                    .stream().map(EstoqueResponse::from).toList();
        }
        return estoqueRepository.findByUserIdOrderByProdutoAsc(user.getId())
                .stream().map(EstoqueResponse::from).toList();
    }

    public EstoqueResponse buscar(User user, UUID id) {
        return estoqueRepository.findByIdAndUserId(id, user.getId())
                .map(EstoqueResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Estoque", id));
    }

    @Transactional
    public EstoqueResponse criar(User user, EstoqueRequest req) {
        planLimitService.checkEstoqueLimit(user.getId(), user.getPlano());

        var estoque = Estoque.builder()
                .user(user)
                .area(resolveArea(user.getId(), req.areaId()))
                .produto(req.produto())
                .tipo(req.tipo())
                .quantidade(req.quantidade())
                .unidade(req.unidade())
                .custoUnitario(req.custoUnitario())
                .validade(req.validade())
                .build();

        return EstoqueResponse.from(estoqueRepository.save(estoque));
    }

    @Transactional
    public EstoqueResponse atualizar(User user, UUID id, EstoqueRequest req) {
        var estoque = estoqueRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Estoque", id));

        estoque.setArea(resolveArea(user.getId(), req.areaId()));
        estoque.setProduto(req.produto());
        estoque.setTipo(req.tipo());
        estoque.setQuantidade(req.quantidade());
        estoque.setUnidade(req.unidade());
        estoque.setCustoUnitario(req.custoUnitario());
        estoque.setValidade(req.validade());

        return EstoqueResponse.from(estoqueRepository.save(estoque));
    }

    @Transactional
    public EstoqueResponse baixar(User user, UUID id, BaixarEstoqueRequest req) {
        var estoque = estoqueRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Estoque", id));

        var novaQtd = estoque.getQuantidade().subtract(req.quantidade());
        if (novaQtd.compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Quantidade insuficiente em estoque. Disponível: " + estoque.getQuantidade());
        }
        estoque.setQuantidade(novaQtd);
        return EstoqueResponse.from(estoqueRepository.save(estoque));
    }

    @Transactional
    public void deletar(User user, UUID id) {
        var estoque = estoqueRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Estoque", id));
        estoqueRepository.delete(estoque);
    }

    private Area resolveArea(UUID userId, UUID areaId) {
        if (areaId == null) return null;
        return areaRepository.findByIdAndUserId(areaId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Área", areaId));
    }
}