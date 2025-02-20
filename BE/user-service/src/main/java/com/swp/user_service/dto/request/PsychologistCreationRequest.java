package com.swp.user_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PsychologistCreationRequest {

    @Size(min = 3, message = "NAME_INVALID")
    String name;

    @Email(message = "EMAIL_INVALID")
    @NotBlank
    String email;

    @Size(min = 8, message = "PASSWORD_INVALID")
    String password;

    @NotBlank
    String specialization;
}
