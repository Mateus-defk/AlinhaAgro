package com.alinhaagro.api.repository;

import com.alinhaagro.api.domain.PrecoMercado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PrecoMercadoRepository extends JpaRepository<PrecoMercado, UUID> {
    List<PrecoMercado> findByCulturaIgnoreCaseOrderByDataDesc(String cultura);
    List<PrecoMercado> findAllByOrderByDataDesc();
}