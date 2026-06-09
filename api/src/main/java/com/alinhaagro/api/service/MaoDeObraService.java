package com.alinhaagro.api.service;

import com.alinhaagro.api.domain.MaoDeObra;
import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.maodeobra.MaoDeObraRequest;
import com.alinhaagro.api.dto.maodeobra.MaoDeObraResponse;
import com.alinhaagro.api.exception.ResourceNotFoundException;
import com.alinhaagro.api.repository.AreaRepository;
import com.alinhaagro.api.repository.MaoDeObraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MaoDeObraService {

    private final MaoDeObraRepository maoDeObraRepository;
    private final AreaRepository areaRepository;

    public List<MaoDeObraResponse> listar(User user, UUID areaId) {
        if (areaId != null) {
            return maoDeObraRepository.findByUserIdAndAreaIdOrderByDataDesc(user.getId(), areaId)
                    .stream().map(MaoDeObraResponse::from).toList();
        }
        return maoDeObraRepository.findByUserIdOrderByDataDesc(user.getId())
                .stream().map(MaoDeObraResponse::from).toList();
    }

    public MaoDeObraResponse buscar(User user, UUID id) {
        return maoDeObraRepository.findByIdAndUserId(id, user.getId())
                .map(MaoDeObraResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Mão de Obra", id));
    }

    @Transactional
    public MaoDeObraResponse criar(User user, MaoDeObraRequest req) {
        var mdo = MaoDeObra.builder()
                .user(user)
                .area(req.areaId() != null
                        ? areaRepository.findByIdAndUserId(req.areaId(), user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Área", req.areaId()))
                        : null)
                .descricao(req.descricao())
                .tipo(req.tipo())
                .quantidadePessoas(req.quantidadePessoas() != null ? req.quantidadePessoas() : 1)
                .valorTotal(req.valorTotal())
                .data(req.data())
                .build();

        return MaoDeObraResponse.from(maoDeObraRepository.save(mdo));
    }

    @Transactional
    public MaoDeObraResponse atualizar(User user, UUID id, MaoDeObraRequest req) {
        var mdo = maoDeObraRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Mão de Obra", id));

        mdo.setArea(req.areaId() != null
                ? areaRepository.findByIdAndUserId(req.areaId(), user.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Área", req.areaId()))
                : null);
        mdo.setDescricao(req.descricao());
        mdo.setTipo(req.tipo());
        if (req.quantidadePessoas() != null) mdo.setQuantidadePessoas(req.quantidadePessoas());
        mdo.setValorTotal(req.valorTotal());
        mdo.setData(req.data());

        return MaoDeObraResponse.from(maoDeObraRepository.save(mdo));
    }

    @Transactional
    public void deletar(User user, UUID id) {
        var mdo = maoDeObraRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Mão de Obra", id));
        maoDeObraRepository.delete(mdo);
    }
}