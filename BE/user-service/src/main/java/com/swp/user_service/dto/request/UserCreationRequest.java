package com.swp.user_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserCreationRequest {

    @Size(min = 3, message = "USERNAME_INVALID")
    private String name;

    @Pattern(
            regexp = "^[A-Za-z0-9_]+@gmail.com",
            message = "EMAIL_INVALID"
    )
    private String email;

    @Size(min = 8, message = "PASSWORD_INVALID")
    private String password;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
