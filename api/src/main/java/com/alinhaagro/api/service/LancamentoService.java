package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.Area;
import com.alinhaagro.api.domain.Lancamento;
import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.lancamento.LancamentoRequest;
import com.alinhaagro.api.dto.lancamento.LancamentoResponse;
import com.alinhaagro.api.dto.lancamento.LancamentoResumoResponse;
import com.alinhaagro.api.exception.ResourceNotFoundException;
import com.alinhaagro.api.repository.AreaRepository;
import com.alinhaagro.api.repository.LancamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LancamentoService {

    private final LancamentoRepository lancamentoRepository;
    private final AreaRepository areaRepository;

    @Transactional(readOnly = true)
    public List<LancamentoResponse> listar(User user, String tipo, UUID areaId) {
        if (areaId != null) {
            return lancamentoRepository.findByUserIdAndAreaIdOrderByDataDesc(user.getId(), areaId)
                    .stream().map(LancamentoResponse::from).toList();
        }
        if (tipo != null) {
            return lancamentoRepository.findByUserIdAndTipoOrderByDataDesc(user.getId(), tipo)
                    .stream().map(LancamentoResponse::from).toList();
        }
        return lancamentoRepository.findByUserIdOrderByDataDesc(user.getId())
                .stream().map(LancamentoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public LancamentoResponse buscar(User user, UUID id) {
        return lancamentoRepository.findByIdAndUserId(id, user.getId())
                .map(LancamentoResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Lançamento", id));
    }

    @Transactional
    public LancamentoResponse criar(User user, LancamentoRequest req) {
        Area area = resolveArea(user.getId(), req.areaId());

        var lancamento = Lancamento.builder()
                .user(user)
                .area(area)
                .tipo(req.tipo())
                .categoria(req.categoria())
                .descricao(req.descricao())
                .fornecedor(req.fornecedor())
                .valor(req.valor())
                .data(req.data())
                .build();

        return LancamentoResponse.from(lancamentoRepository.save(lancamento));
    }

    @Transactional
    public LancamentoResponse atualizar(User user, UUID id, LancamentoRequest req) {
        var lancamento = lancamentoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Lançamento", id));

        lancamento.setArea(resolveArea(user.getId(), req.areaId()));
        lancamento.setTipo(req.tipo());
        lancamento.setCategoria(req.categoria());
        lancamento.setDescricao(req.descricao());
        lancamento.setFornecedor(req.fornecedor());
        lancamento.setValor(req.valor());
        lancamento.setData(req.data());

        return LancamentoResponse.from(lancamentoRepository.save(lancamento));
    }

    @Transactional
    public void deletar(User user, UUID id) {
        var lancamento = lancamentoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Lançamento", id));
        lancamentoRepository.delete(lancamento);
    }

    @Transactional(readOnly = true)
    public LancamentoResumoResponse resumo(User user, LocalDate inicio, LocalDate fim) {
        if (inicio == null) inicio = LocalDate.now().withDayOfMonth(1);
        if (fim == null) fim = LocalDate.now();

        BigDecimal receitas = lancamentoRepository.sumValorByTipoAndPeriodo(user.getId(), "receita", inicio, fim);
        BigDecimal despesas = lancamentoRepository.sumValorByTipoAndPeriodo(user.getId(), "despesa", inicio, fim);

        return new LancamentoResumoResponse(receitas, despesas,
                receitas.subtract(despesas),
                new LancamentoResumoResponse.Periodo(inicio, fim));
    }

    private Area resolveArea(UUID userId, UUID areaId) {
        if (areaId == null) return null;
        return areaRepository.findByIdAndUserId(areaId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Área", areaId));
    }
}