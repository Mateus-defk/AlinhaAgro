package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.Area;
import com.alinhaagro.api.domain.EstimativaColheita;
import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.estimativa.EstimativaColheitaRequest;
import com.alinhaagro.api.dto.estimativa.EstimativaColheitaResponse;
import com.alinhaagro.api.exception.ResourceNotFoundException;
import com.alinhaagro.api.repository.AreaRepository;
import com.alinhaagro.api.repository.EstimativaColheitaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EstimativaColheitaService {

    private final EstimativaColheitaRepository estimativaRepository;
    private final AreaRepository areaRepository;

    public List<EstimativaColheitaResponse> listar(User user) {
        return estimativaRepository.findByUserIdOrderByCriadoEmDesc(user.getId())
                .stream().map(EstimativaColheitaResponse::from).toList();
    }

    @Transactional
    public EstimativaColheitaResponse criar(User user, EstimativaColheitaRequest req) {
        var est = EstimativaColheita.builder()
                .user(user)
                .area(resolveArea(user.getId(), req.areaId()))
                .kgEst(req.kgEst())
                .kgReal(req.kgReal())
                .preco(req.preco())
                .descPct(req.descPct() != null ? req.descPct() : BigDecimal.ZERO)
                .custoC(req.custoC() != null ? req.custoC() : BigDecimal.ZERO)
                .build();

        return EstimativaColheitaResponse.from(estimativaRepository.save(est));
    }

    @Transactional
    public EstimativaColheitaResponse atualizar(User user, UUID id, EstimativaColheitaRequest req) {
        var est = estimativaRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("EstimativaColheita", id));

        est.setArea(resolveArea(user.getId(), req.areaId()));
        est.setKgEst(req.kgEst());
        est.setKgReal(req.kgReal());
        est.setPreco(req.preco());
        est.setDescPct(req.descPct() != null ? req.descPct() : BigDecimal.ZERO);
        est.setCustoC(req.custoC() != null ? req.custoC() : BigDecimal.ZERO);

        return EstimativaColheitaResponse.from(estimativaRepository.save(est));
    }

    @Transactional
    public void deletar(User user, UUID id) {
        var est = estimativaRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("EstimativaColheita", id));
        estimativaRepository.delete(est);
    }

    private Area resolveArea(UUID userId, UUID areaId) {
        if (areaId == null) return null;
        return areaRepository.findByIdAndUserId(areaId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Área", areaId));
    }
}