package com.swp.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminResponse {
    String id;
    String name;
    String email;
    String password;
    UserResponse user;
    PsychologistResponse psychologist;
}
