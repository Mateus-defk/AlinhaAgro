package com.alinhaagro.api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "precos_mercado")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class PrecoMercado {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String cultura;

    @Column(name = "preco_kg", nullable = false, precision = 10, scale = 4)
    private BigDecimal precoKg;

    @Column(length = 150)
    private String fonte;

    @Column(nullable = false)
    private LocalDate data;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) criadoEm = Instant.now();
    }
}