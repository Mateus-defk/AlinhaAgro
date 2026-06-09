package com.alinhaagro.api.repository;

import com.alinhaagro.api.domain.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EstoqueRepository extends JpaRepository<Estoque, UUID> {
    List<Estoque> findByUserIdOrderByProdutoAsc(UUID userId);
    List<Estoque> findByUserIdAndTipoOrderByProdutoAsc(UUID userId, String tipo);
    Optional<Estoque> findByIdAndUserId(UUID id, UUID userId);
    int countByUserId(UUID userId);
}