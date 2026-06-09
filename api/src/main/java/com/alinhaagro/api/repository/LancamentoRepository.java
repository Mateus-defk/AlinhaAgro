package com.alinhaagro.api.repository;

import com.alinhaagro.api.domain.Lancamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LancamentoRepository extends JpaRepository<Lancamento, UUID> {

    List<Lancamento> findByUserIdOrderByDataDesc(UUID userId);

    List<Lancamento> findByUserIdAndTipoOrderByDataDesc(UUID userId, String tipo);

    List<Lancamento> findByUserIdAndAreaIdOrderByDataDesc(UUID userId, UUID areaId);

    Optional<Lancamento> findByIdAndUserId(UUID id, UUID userId);

    @Query("SELECT COALESCE(SUM(l.valor), 0) FROM Lancamento l " +
           "WHERE l.user.id = :userId AND l.tipo = :tipo " +
           "AND l.data BETWEEN :inicio AND :fim")
    BigDecimal sumValorByTipoAndPeriodo(@Param("userId") UUID userId,
                                        @Param("tipo") String tipo,
                                        @Param("inicio") LocalDate inicio,
                                        @Param("fim") LocalDate fim);
}