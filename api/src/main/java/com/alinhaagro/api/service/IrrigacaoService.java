package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.Irrigacao;
import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.irrigacao.IrrigacaoRequest;
import com.alinhaagro.api.dto.irrigacao.IrrigacaoResponse;
import com.alinhaagro.api.exception.ResourceNotFoundException;
import com.alinhaagro.api.repository.AreaRepository;
import com.alinhaagro.api.repository.IrrigacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IrrigacaoService {

    private final IrrigacaoRepository irrigacaoRepository;
    private final AreaRepository areaRepository;

    public List<IrrigacaoResponse> listar(User user, UUID areaId) {
        if (areaId != null) {
            return irrigacaoRepository.findByUserIdAndAreaIdOrderByDataDesc(user.getId(), areaId)
                    .stream().map(IrrigacaoResponse::from).toList();
        }
        return irrigacaoRepository.findByUserIdOrderByDataDesc(user.getId())
                .stream().map(IrrigacaoResponse::from).toList();
    }

    public IrrigacaoResponse buscar(User user, UUID id) {
        return irrigacaoRepository.findByIdAndUserId(id, user.getId())
                .map(IrrigacaoResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Irrigação", id));
    }

    @Transactional
    public IrrigacaoResponse criar(User user, IrrigacaoRequest req) {
        var irrigacao = Irrigacao.builder()
                .user(user)
                .area(req.areaId() != null
                        ? areaRepository.findByIdAndUserId(req.areaId(), user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Área", req.areaId()))
                        : null)
                .data(req.data())
                .duracaoMin(req.duracaoMin())
                .laminaMm(req.laminaMm())
                .custo(req.custo())
                .observacoes(req.observacoes())
                .build();

        return IrrigacaoResponse.from(irrigacaoRepository.save(irrigacao));
    }

    @Transactional
    public IrrigacaoResponse atualizar(User user, UUID id, IrrigacaoRequest req) {
        var irrigacao = irrigacaoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Irrigação", id));

        irrigacao.setArea(req.areaId() != null
                ? areaRepository.findByIdAndUserId(req.areaId(), user.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Área", req.areaId()))
                : null);
        irrigacao.setData(req.data());
        irrigacao.setDuracaoMin(req.duracaoMin());
        irrigacao.setLaminaMm(req.laminaMm());
        irrigacao.setCusto(req.custo());
        irrigacao.setObservacoes(req.observacoes());

        return IrrigacaoResponse.from(irrigacaoRepository.save(irrigacao));
    }

    @Transactional
    public void deletar(User user, UUID id) {
        var irrigacao = irrigacaoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Irrigação", id));
        irrigacaoRepository.delete(irrigacao);
    }
}