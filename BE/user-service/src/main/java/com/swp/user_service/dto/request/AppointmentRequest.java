package com.swp.user_service.dto.request;

import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentRequest {
    @NotBlank
    String appointmentId;

    @NotNull
    Date appointmentDate; // Đổi từ @NotBlank -> @NotNull vì Date không phải String

    @NotBlank
    String timeSlot; // Thêm timeSlot để khớp với entity

    private Boolean active;
    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }
}
