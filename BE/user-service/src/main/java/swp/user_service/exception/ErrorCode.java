package swp.user_service.exception;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999,"Uncategorized exception"),
    INVALID_KEY( 1001, "Invalid message key"),
    USER_EXISTED(1002, "User Existed"),
    USERNAME_INVALID(1003, "Username must be at least 8 characters"),
    PASSWORD_INVALID( 1004, "Password must be at least 8 characters"),
    USER_NOT_EXISTED(1005,"User is not exist"),
    EMAIL_INVALID(1006, "Email must end with @gmail.com")
    ;

    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
