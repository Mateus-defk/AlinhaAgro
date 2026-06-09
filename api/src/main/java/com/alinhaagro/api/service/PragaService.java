package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.AcaoPraga;
import com.alinhaagro.api.domain.Area;
import com.alinhaagro.api.domain.Praga;
import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.praga.AcaoPragaRequest;
import com.alinhaagro.api.dto.praga.AcaoPragaResponse;
import com.alinhaagro.api.dto.praga.PragaRequest;
import com.alinhaagro.api.dto.praga.PragaResponse;
import com.alinhaagro.api.exception.ResourceNotFoundException;
import com.alinhaagro.api.repository.AcaoPragaRepository;
import com.alinhaagro.api.repository.AreaRepository;
import com.alinhaagro.api.repository.PragaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PragaService {

    private final PragaRepository pragaRepository;
    private final AcaoPragaRepository acaoPragaRepository;
    private final AreaRepository areaRepository;

    public List<PragaResponse> listar(User user, UUID areaId) {
        if (areaId != null) {
            return pragaRepository.findByUserIdAndAreaIdOrderByDataIdentificacaoDesc(user.getId(), areaId)
                    .stream().map(PragaResponse::from).toList();
        }
        return pragaRepository.findByUserIdOrderByDataIdentificacaoDesc(user.getId())
                .stream().map(PragaResponse::from).toList();
    }

    public PragaResponse buscar(User user, UUID id) {
        return pragaRepository.findByIdAndUserId(id, user.getId())
                .map(PragaResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Praga", id));
    }

    @Transactional
    public PragaResponse criar(User user, PragaRequest req) {
        var praga = Praga.builder()
                .user(user)
                .area(resolveArea(user.getId(), req.areaId()))
                .nome(req.nome())
                .tipo(req.tipo())
                .nivelSeveridade(req.nivelSeveridade() != null ? req.nivelSeveridade() : "baixo")
                .dataIdentificacao(req.dataIdentificacao())
                .observacoes(req.observacoes())
                .build();

        return PragaResponse.from(pragaRepository.save(praga));
    }

    @Transactional
    public PragaResponse atualizar(User user, UUID id, PragaRequest req) {
        var praga = pragaRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Praga", id));

        praga.setArea(resolveArea(user.getId(), req.areaId()));
        praga.setNome(req.nome());
        praga.setTipo(req.tipo());
        if (req.nivelSeveridade() != null) praga.setNivelSeveridade(req.nivelSeveridade());
        praga.setDataIdentificacao(req.dataIdentificacao());
        praga.setObservacoes(req.observacoes());

        return PragaResponse.from(pragaRepository.save(praga));
    }

    @Transactional
    public void deletar(User user, UUID id) {
        var praga = pragaRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Praga", id));
        pragaRepository.delete(praga);
    }

    public List<AcaoPragaResponse> listarAcoes(User user, UUID pragaId) {
        pragaRepository.findByIdAndUserId(pragaId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Praga", pragaId));
        return acaoPragaRepository.findByPragaIdOrderByDataAplicacaoDesc(pragaId)
                .stream().map(AcaoPragaResponse::from).toList();
    }

    @Transactional
    public AcaoPragaResponse adicionarAcao(User user, UUID pragaId, AcaoPragaRequest req) {
        var praga = pragaRepository.findByIdAndUserId(pragaId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Praga", pragaId));

        var acao = AcaoPraga.builder()
                .praga(praga)
                .descricao(req.descricao())
                .produtoUsado(req.produtoUsado())
                .custo(req.custo())
                .dataAplicacao(req.dataAplicacao())
                .build();

        return AcaoPragaResponse.from(acaoPragaRepository.save(acao));
    }

    @Transactional
    public void deletarAcao(User user, UUID pragaId, UUID acaoId) {
        pragaRepository.findByIdAndUserId(pragaId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Praga", pragaId));
        var acao = acaoPragaRepository.findByIdAndPragaId(acaoId, pragaId)
                .orElseThrow(() -> new ResourceNotFoundException("Ação", acaoId));
        acaoPragaRepository.delete(acao);
    }

    private Area resolveArea(UUID userId, UUID areaId) {
        if (areaId == null) return null;
        return areaRepository.findByIdAndUserId(areaId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Área", areaId));
    }
}