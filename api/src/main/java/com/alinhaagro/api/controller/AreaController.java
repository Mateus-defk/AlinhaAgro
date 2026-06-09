package com.alinhaagro.api.controller;

import com.alinhaagro.api.domain.User;
import com.alinhaagro.api.dto.area.AreaRequest;
import com.alinhaagro.api.dto.area.AreaResponse;
import com.alinhaagro.api.service.AreaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/areas")
@RequiredArgsConstructor
public class AreaController {

    private final AreaService areaService;

    @GetMapping
    public List<AreaResponse> listar(@AuthenticationPrincipal User user) {
        return areaService.listar(user);
    }

    @GetMapping("/{id}")
    public AreaResponse buscar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        return areaService.buscar(user, id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AreaResponse criar(@AuthenticationPrincipal User user, @Valid @RequestBody AreaRequest req) {
        return areaService.criar(user, req);
    }

    @PutMapping("/{id}")
    public AreaResponse atualizar(@AuthenticationPrincipal User user,
                                  @PathVariable UUID id,
                                  @Valid @RequestBody AreaRequest req) {
        return areaService.atualizar(user, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        areaService.deletar(user, id);
    }
}