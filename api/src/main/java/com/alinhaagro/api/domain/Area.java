package com.alinhaagro.api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "areas")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal ha;

    @Column(nullable = false, length = 100)
    private String variedade;

    @Column(name = "plantio")
    private LocalDate plantio;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "obs", columnDefinition = "TEXT")
    private String obs;

    @Column(name = "colheita_ini")
    private Integer colheitaIni;

    @Column(name = "colheita_fim")
    private Integer colheitaFim;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) criadoEm = Instant.now();
        if (status == null) status = "ativa";
    }
}
