package com.alinhaagro.api.service;

import com.alinhaagro.api.exception.PlanLimitExceededException;
import com.alinhaagro.api.repository.AreaRepository;
import com.alinhaagro.api.repository.EstoqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlanLimitService {

    private final AreaRepository areaRepository;
    private final EstoqueRepository estoqueRepository;

    public void checkAreaLimit(UUID userId, String plano) {
        int atual = areaRepository.countByUserId(userId);
        int max   = maxAreas(plano);
        if (max != -1 && atual >= max) {
            throw new PlanLimitExceededException(
                "Limite de áreas atingido para o plano '" + plano + "' (máx: " + max + "). Faça upgrade para continuar.");
        }
    }

    public void checkEstoqueLimit(UUID userId, String plano) {
        int atual = estoqueRepository.countByUserId(userId);
        int max   = maxEstoque(plano);
        if (max != -1 && atual >= max) {
            throw new PlanLimitExceededException(
                "Limite de itens de estoque atingido para o plano '" + plano + "' (máx: " + max + "). Faça upgrade para continuar.");
        }
    }

    private static int maxAreas(String plano) {
        return switch (plano) {
            case "mensal"      -> 3;
            case "trimestral"  -> 8;
            case "anual", "admin" -> -1; // ilimitado
            default -> 1;
        };
    }

    private static int maxEstoque(String plano) {
        return switch (plano) {
            case "mensal"      -> 20;
            case "trimestral"  -> 60;
            case "anual", "admin" -> -1;
            default -> 5;
        };
    }
}