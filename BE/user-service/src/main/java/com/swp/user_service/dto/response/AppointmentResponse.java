package com.swp.user_service.dto.response;

import com.swp.user_service.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.swp.user_service.entity.Appointment;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentResponse {
    private String psychologistId;
    private String appointmentId;
    private String userId;
    private Date appointmentDate;
    private String timeSlot;

}
