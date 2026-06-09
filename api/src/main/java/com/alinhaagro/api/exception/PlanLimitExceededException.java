package com.alinhaagro.api.exception;

public class PlanLimitExceededException extends RuntimeException {
    public PlanLimitExceededException(String message) {
        super(message);
    }
}