package com.alinhaagro.api.repository;

import com.alinhaagro.api.domain.MaoDeObra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MaoDeObraRepository extends JpaRepository<MaoDeObra, UUID> {
    List<MaoDeObra> findByUserIdOrderByDataDesc(UUID userId);
    List<MaoDeObra> findByUserIdAndAreaIdOrderByDataDesc(UUID userId, UUID areaId);
    Optional<MaoDeObra> findByIdAndUserId(UUID id, UUID userId);
}