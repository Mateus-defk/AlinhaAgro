package com.alinhaagro.api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "irrigacao")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Irrigacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    @Column(nullable = false)
    private LocalDate data;

    @Column(name = "duracao_min", nullable = false)
    private Integer duracaoMin;

    @Column(name = "lamina_mm", precision = 8, scale = 2)
    private BigDecimal laminaMm;

    @Column(precision = 12, scale = 2)
    private BigDecimal custo;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) criadoEm = Instant.now();
    }
}