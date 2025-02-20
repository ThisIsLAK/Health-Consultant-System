package com.swp.user_service.dto.response;

import com.swp.user_service.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PsychologistResponse {
    String id;
    String name;
    String email;
    String specialization;
    UserResponse user;
}

