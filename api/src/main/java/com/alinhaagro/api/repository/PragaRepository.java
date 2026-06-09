package com.alinhaagro.api.repository;

import com.alinhaagro.api.domain.Praga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PragaRepository extends JpaRepository<Praga, UUID> {
    List<Praga> findByUserIdOrderByDataIdentificacaoDesc(UUID userId);
    List<Praga> findByUserIdAndAreaIdOrderByDataIdentificacaoDesc(UUID userId, UUID areaId);
    Optional<Praga> findByIdAndUserId(UUID id, UUID userId);
}