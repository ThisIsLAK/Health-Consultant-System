package com.swp.user_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    @Size(min = 3, message = "USERNAME_INVALID")
    String name;

    @Pattern(
            regexp = "^[A-Za-z0-9_]+@gmail.com",
            message = "EMAIL_INVALID"
    )
    String email;

    @Size(min = 8, message = "PASSWORD_INVALID")
    String password;
}
