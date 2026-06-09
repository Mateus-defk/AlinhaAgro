package com.alinhaagro.api.repository;

import com.alinhaagro.api.domain.Area;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AreaRepository extends JpaRepository<Area, UUID> {
    List<Area> findByUserIdOrderByNomeAsc(UUID userId);
    Optional<Area> findByIdAndUserId(UUID id, UUID userId);
    int countByUserId(UUID userId);
    boolean existsByIdAndUserId(UUID id, UUID userId);
}