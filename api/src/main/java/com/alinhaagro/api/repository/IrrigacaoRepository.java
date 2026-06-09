package com.alinhaagro.api.repository;

import com.alinhaagro.api.domain.Irrigacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IrrigacaoRepository extends JpaRepository<Irrigacao, UUID> {
    List<Irrigacao> findByUserIdOrderByDataDesc(UUID userId);
    List<Irrigacao> findByUserIdAndAreaIdOrderByDataDesc(UUID userId, UUID areaId);
    Optional<Irrigacao> findByIdAndUserId(UUID id, UUID userId);
}