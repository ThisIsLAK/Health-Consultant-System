package com.swp.user_service.exception;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized exception"),
    USER_EXIST(1001, "User existed"),
    EMAIL_EXIST(1002, "Email existed"),
    USERNAME_INVALID(1003,"Username must be at least 3 characters"),
    EMAIL_INVALID(1004, "Email must be end with .@gmail.com"),
    PASSWORD_INVALID(1005, "Password must be at least 8 characters"),
    EMAIL_NOT_EXIST(1006, "User is not exist"),
    USER_NOT_EXIST(1007, "User not found"),
    UNAUTHENTICATED(1008, "Unauthenticated"),
    ROLE_NOT_FOUND(1009, "Role not found"),
    PROGRAM_NOT_EXIST(1010, "Program is not exist"),
    PERMISSION_ERROR(1011, "You don't have permission to do this"),
    USER_CREATION_FAILED(1012, "User creation failed"),
    BLOGCODE_EXIST(1013, "Blog code is existed"),
    INVALID_SLOT(1014, "Time slot must be one of: 8h-10h, 10h-12h, 13h-15h, 15h-17h"),
    PYSOCHOLOGIST_NOT_ACTIVE(1015, "Psychologist is not active "),
    SLOT_IS_BOOKING(1016, "This time slot is already booked"),
    NOT_PSYCHOLOGIST(1016, "This is not a psychologist"),
    SUPPORT_PROGRAM_EXIST(1017,"This support program code is exist"),
    SUPPORT_PROGRAM_NOT_EXIST(1018, "This support program is not exist"),
    USER_SIGNUP_ALREADY(1019, "User had been signup this program before"),
    APPOINTMENT_NOT_EXIST(1020, "Appointment is not exist"),
    NAME_REQUIRED(1021, "Name is required"),
    USER_ALREADY_BOOKED(1022,"You already have an appointment on this date."),
    MAX_DAILY_SLOTS_REACHED(1023,"The psychologist is fully booked for the day."),

    NO_APPOINTMENT_FOUND(1024,"No appointment history found" ),
    NOT_USER(1025, "This is not a User"),
    BLOG_NOT_FOUND(1026, "Blog is not found")
    ;   //<<====chu y dau (;)===========================================================================================



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
