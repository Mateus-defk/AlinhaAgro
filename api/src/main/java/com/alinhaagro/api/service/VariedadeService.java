package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.domain.Variedade;
import com.alinhaagro.api.dto.variedade.VariedadeRequest;
import com.alinhaagro.api.dto.variedade.VariedadeResponse;
import com.alinhaagro.api.exception.ResourceNotFoundException;
import com.alinhaagro.api.repository.VariedadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VariedadeService {

    private final VariedadeRepository variedadeRepository;
    private final PlanLimitService planLimitService;

    public List<VariedadeResponse> listar(User user) {
        return variedadeRepository.findByUserIdOrderByNomeAsc(user.getId())
                .stream().map(VariedadeResponse::from).toList();
    }

    @Transactional
    public VariedadeResponse criar(User user, VariedadeRequest req) {
        planLimitService.checkVariedadesLimit(user.getId(), user.getPlano());

        var variedade = Variedade.builder()
                .user(user)
                .nome(req.nome())
                .fruta(req.fruta() != null ? req.fruta() : "Manga")
                .pesoMedioKg(req.pesoMedioKg())
                .cicloDias(req.cicloDias())
                .mesColheita(req.mesColheita())
                .obs(req.obs())
                .build();

        return VariedadeResponse.from(variedadeRepository.save(variedade));
    }

    @Transactional
    public void deletar(User user, UUID id) {
        var variedade = variedadeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Variedade", id));
        variedadeRepository.delete(variedade);
    }
}