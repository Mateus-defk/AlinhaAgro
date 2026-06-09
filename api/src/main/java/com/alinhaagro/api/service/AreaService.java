package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.Area;
import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.area.AreaRequest;
import com.alinhaagro.api.dto.area.AreaResponse;
import com.alinhaagro.api.exception.ResourceNotFoundException;
import com.alinhaagro.api.repository.AreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final AreaRepository areaRepository;
    private final PlanLimitService planLimitService;

    public List<AreaResponse> listar(User user) {
        return areaRepository.findByUserIdOrderByNomeAsc(user.getId())
                .stream().map(AreaResponse::from).toList();
    }

    public AreaResponse buscar(User user, UUID id) {
        return areaRepository.findByIdAndUserId(id, user.getId())
                .map(AreaResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Área", id));
    }

    @Transactional
    public AreaResponse criar(User user, AreaRequest req) {
        planLimitService.checkAreaLimit(user.getId(), user.getPlano());

        var area = Area.builder()
                .user(user)
                .nome(req.nome())
                .ha(req.ha())
                .variedade(req.variedade())
                .plantio(req.plantio())
                .status(req.status() != null ? req.status() : "ativa")
                .obs(req.obs())
                .colheitaIni(req.colheitaIni())
                .colheitaFim(req.colheitaFim())
                .build();

        return AreaResponse.from(areaRepository.save(area));
    }

    @Transactional
    public AreaResponse atualizar(User user, UUID id, AreaRequest req) {
        var area = areaRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Área", id));

        area.setNome(req.nome());
        area.setHa(req.ha());
        area.setVariedade(req.variedade());
        area.setPlantio(req.plantio());
        if (req.status() != null) area.setStatus(req.status());
        area.setObs(req.obs());
        area.setColheitaIni(req.colheitaIni());
        area.setColheitaFim(req.colheitaFim());

        return AreaResponse.from(areaRepository.save(area));
    }

    @Transactional
    public void deletar(User user, UUID id) {
        var area = areaRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Área", id));
        areaRepository.delete(area);
    }
}
