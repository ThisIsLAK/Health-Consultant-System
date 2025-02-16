package com.swp.user_service.exception;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized exception"),
    USER_EXIST(1001, "User existed"),
    EMAIL_EXIST(1002, "Email existed"),
    USERNAME_INVALID(1003,"Username must be at least 3 characters"),
    EMAIL_INVALID(1004, "Email must be end with .@gmail.com"),
    PASSWORD_INVALID(1005, "Password must be at least 8 characters")
    ;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    private int code;
    private String message;

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
