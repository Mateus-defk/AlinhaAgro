package com.alinhaagro.api.exception;

public class TokenInvalidoException extends RuntimeException {
    public TokenInvalidoException() {
        super("Token inválido ou expirado");
    }
}