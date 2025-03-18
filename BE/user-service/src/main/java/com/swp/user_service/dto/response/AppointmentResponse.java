package com.swp.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;


import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentResponse {
    String psychologistId;
    String psychologistName;
    String psychologistEmail;
    String appointmentId;
    String userId;
    String studentName;
    String studentEmail;
    Date appointmentDate;
    String timeSlot;
    Boolean active;
}
