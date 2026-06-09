package com.alinhaagro.api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "produtos")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, length = 15)
    private String tipo;

    @Column(nullable = false, length = 20)
    private String unidade;

    @Column(name = "principio_ativo", length = 150)
    private String principioAtivo;

    @Column(columnDefinition = "TEXT")
    private String obs;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) criadoEm = Instant.now();
        if (unidade == null) unidade = "kg";
    }
}