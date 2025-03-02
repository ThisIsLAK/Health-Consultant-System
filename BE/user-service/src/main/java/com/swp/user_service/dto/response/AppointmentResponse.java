package com.swp.user_service.dto.response;

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
//    String userId;
    String appointmentId;
    Date appointmentDate;
    String timeSlot;
    public static AppointmentResponse fromEntity(Appointment appointment) {
        return AppointmentResponse.builder()
                .appointmentId(appointment.getAppointmentId())
                .appointmentDate(appointment.getAppointmentDate())
                .timeSlot(appointment.getTimeSlot())
                .build();
    }
}
