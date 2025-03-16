package com.swp.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentSummaryResponse {
    private Long totalAppointments;
    private Long activeAppointments;
    private Long cancelledAppointments;
    private Long upcomingAppointments;
}
