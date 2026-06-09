package com.alinhaagro.api.repository;

import com.alinhaagro.api.domain.AcaoPraga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AcaoPragaRepository extends JpaRepository<AcaoPraga, UUID> {
    List<AcaoPraga> findByPragaIdOrderByDataAplicacaoDesc(UUID pragaId);
    Optional<AcaoPraga> findByIdAndPragaId(UUID id, UUID pragaId);
}