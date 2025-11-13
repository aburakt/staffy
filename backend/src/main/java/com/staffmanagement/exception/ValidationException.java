package com.staffmanagement.exception;

public class ValidationException extends RuntimeException {
    private final String field;
    private final String message;

    public ValidationException(String field, String message) {
        super(String.format("Validation error on field '%s': %s", field, message));
        this.field = field;
        this.message = message;
    }

    public String getField() {
        return field;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
