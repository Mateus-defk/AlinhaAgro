package com.alinhaagro.api.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String recurso, Object id) {
        super(recurso + " não encontrado: " + id);
    }
}