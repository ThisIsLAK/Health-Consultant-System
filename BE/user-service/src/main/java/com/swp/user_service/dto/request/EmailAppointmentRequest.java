package com.swp.user_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailAppointmentRequest {

    String appointmentId;


    String userEmail;


    String psychologistId;


    LocalDateTime appointmentDate;


    String timeSlot;
}
