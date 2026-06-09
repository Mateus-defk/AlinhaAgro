package com.alinhaagro.api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pragas")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Praga {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, length = 20)
    private String tipo;

    @Column(name = "nivel_severidade", nullable = false, length = 20)
    private String nivelSeveridade;

    @Column(name = "data_identificacao", nullable = false)
    private LocalDate dataIdentificacao;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @OneToMany(mappedBy = "praga", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AcaoPraga> acoes = new ArrayList<>();

    @PrePersist
    void prePersist() {
        if (criadoEm == null) criadoEm = Instant.now();
        if (nivelSeveridade == null) nivelSeveridade = "baixo";
    }
}