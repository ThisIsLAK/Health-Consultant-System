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
    private String name;
    private String email;
    private String password;
    private String specialization;

    private Boolean active;
    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }
}
