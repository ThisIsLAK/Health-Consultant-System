package com.swp.user_service.dto.request;

import jakarta.persistence.PrePersist;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PsychologistCreationRequest {
    String name;
    String email;
    String password;
    String specialization;

    Boolean active;
    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }
}
