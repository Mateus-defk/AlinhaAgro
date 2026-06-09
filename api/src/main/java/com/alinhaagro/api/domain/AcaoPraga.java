package com.alinhaagro.api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "acoes_praga")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AcaoPraga {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "praga_id", nullable = false)
    private Praga praga;

    @Column(nullable = false, length = 255)
    private String descricao;

    @Column(name = "produto_usado", length = 150)
    private String produtoUsado;

    @Column(precision = 12, scale = 2)
    private BigDecimal custo;

    @Column(name = "data_aplicacao", nullable = false)
    private LocalDate dataAplicacao;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) criadoEm = Instant.now();
    }
}