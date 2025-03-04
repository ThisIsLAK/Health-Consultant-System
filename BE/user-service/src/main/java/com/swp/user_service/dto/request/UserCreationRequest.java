package com.swp.user_service.dto.request;

import com.swp.user_service.entity.Role;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    @NotNull
    @Size(min = 2, message = "USERNAME_INVALID")
    String name;

    @NotNull
    @Pattern(
            regexp = "^[A-Za-z0-9_]+@gmail.com",
            message = "EMAIL_INVALID"
    )
    String email;

    @NotNull
    @Size(min = 8, message = "PASSWORD_INVALID")
    String password;

    String roleId;

    Boolean active;
    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }
}
