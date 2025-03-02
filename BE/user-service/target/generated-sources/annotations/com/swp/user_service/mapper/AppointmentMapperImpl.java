package com.swp.user_service.mapper;

import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.entity.Appointment;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class AppointmentMapperImpl implements AppointmentMapper {

    @Override
    public AppointmentResponse toAppointmentResponse(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }

        AppointmentResponse.AppointmentResponseBuilder appointmentResponse = AppointmentResponse.builder();

        appointmentResponse.appointmentId( appointment.getAppointmentId() );
        appointmentResponse.appointmentDate( appointment.getAppointmentDate() );
        appointmentResponse.timeSlot( appointment.getTimeSlot() );

        return appointmentResponse.build();
    }
}
