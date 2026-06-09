package com.alinhaagro.api.repository;

import com.alinhaagro.api.domain.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProdutoRepository extends JpaRepository<Produto, UUID> {
    List<Produto> findByUserIdOrderByNomeAsc(UUID userId);
    Optional<Produto> findByIdAndUserId(UUID id, UUID userId);
    int countByUserId(UUID userId);
}