package com.alinhaagro.api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "variedades")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Variedade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 50)
    private String fruta;

    @Column(name = "peso_medio_kg", precision = 6, scale = 2)
    private BigDecimal pesoMedioKg;

    @Column(name = "ciclo_dias")
    private Integer cicloDias;

    @Column(name = "mes_colheita", length = 30)
    private String mesColheita;

    @Column(columnDefinition = "TEXT")
    private String obs;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) criadoEm = Instant.now();
        if (fruta == null) fruta = "Manga";
    }
}