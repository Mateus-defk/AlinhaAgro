package com.alinhaagro.api.dto.area;

import com.alinhaagro.api.domain.Area;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record AreaResponse(
        UUID id,
        String nome,
        BigDecimal ha,
        String variedade,
        LocalDate plantio,
        String status,
        String obs,
        Integer colheitaIni,
        Integer colheitaFim,
        Instant criadoEm
) {
    public static AreaResponse from(Area a) {
        return new AreaResponse(
                a.getId(), a.getNome(), a.getHa(), a.getVariedade(),
                a.getPlantio(), a.getStatus(), a.getObs(),
                a.getColheitaIni(), a.getColheitaFim(), a.getCriadoEm());
    }
}
