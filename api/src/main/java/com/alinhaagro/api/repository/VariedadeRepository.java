package com.alinhaagro.api.repository;

import com.alinhaagro.api.domain.Variedade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VariedadeRepository extends JpaRepository<Variedade, UUID> {
    List<Variedade> findByUserIdOrderByNomeAsc(UUID userId);
    Optional<Variedade> findByIdAndUserId(UUID id, UUID userId);
    int countByUserId(UUID userId);
}