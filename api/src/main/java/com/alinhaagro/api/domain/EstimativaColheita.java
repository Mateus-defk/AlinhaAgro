package com.alinhaagro.api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "estimativas_colheita")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class EstimativaColheita {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    @Column(name = "kg_est", nullable = false, precision = 12, scale = 2)
    private BigDecimal kgEst;

    @Column(name = "kg_real", precision = 12, scale = 2)
    private BigDecimal kgReal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(name = "desc_pct", nullable = false, precision = 5, scale = 2)
    private BigDecimal descPct;

    @Column(name = "custo_c", nullable = false, precision = 12, scale = 2)
    private BigDecimal custoC;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) criadoEm = Instant.now();
        if (descPct == null) descPct = BigDecimal.ZERO;
        if (custoC == null) custoC = BigDecimal.ZERO;
    }
}