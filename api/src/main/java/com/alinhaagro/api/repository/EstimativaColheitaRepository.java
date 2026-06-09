package com.alinhaagro.api.repository;

import com.alinhaagro.api.domain.EstimativaColheita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EstimativaColheitaRepository extends JpaRepository<EstimativaColheita, UUID> {
    List<EstimativaColheita> findByUserIdOrderByCriadoEmDesc(UUID userId);
    Optional<EstimativaColheita> findByIdAndUserId(UUID id, UUID userId);
}