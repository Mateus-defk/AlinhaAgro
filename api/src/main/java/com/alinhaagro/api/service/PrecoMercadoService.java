package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.PrecoMercado;
import com.alinhaagro.api.dto.precomercado.PrecoMercadoRequest;
import com.alinhaagro.api.dto.precomercado.PrecoMercadoResponse;
import com.alinhaagro.api.exception.ResourceNotFoundException;
import com.alinhaagro.api.repository.PrecoMercadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrecoMercadoService {

    private final PrecoMercadoRepository precoMercadoRepository;

    public List<PrecoMercadoResponse> listar(String cultura) {
        if (cultura != null) {
            return precoMercadoRepository.findByCulturaIgnoreCaseOrderByDataDesc(cultura)
                    .stream().map(PrecoMercadoResponse::from).toList();
        }
        return precoMercadoRepository.findAllByOrderByDataDesc()
                .stream().map(PrecoMercadoResponse::from).toList();
    }

    @Transactional
    public PrecoMercadoResponse criar(PrecoMercadoRequest req) {
        var preco = PrecoMercado.builder()
                .cultura(req.cultura())
                .precoKg(req.precoKg())
                .fonte(req.fonte())
                .data(req.data())
                .build();
        return PrecoMercadoResponse.from(precoMercadoRepository.save(preco));
    }

    @Transactional
    public void deletar(UUID id) {
        var preco = precoMercadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Preço", id));
        precoMercadoRepository.delete(preco);
    }
}