package com.swp.user_service.mapper;

import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.entity.Appointment;
import com.swp.user_service.entity.User;
import java.util.ArrayList;
import java.util.List;
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

        String id = appointmentUserId( appointment );
        if ( id != null ) {
            appointmentResponse.userId( id );
        }
        else {
            appointmentResponse.userId( "Unknown" );
        }
        String name = appointmentUserName( appointment );
        if ( name != null ) {
            appointmentResponse.studentName( name );
        }
        else {
            appointmentResponse.studentName( "Unknown" );
        }
        String email = appointmentUserEmail( appointment );
        if ( email != null ) {
            appointmentResponse.studentEmail( email );
        }
        else {
            appointmentResponse.studentEmail( "N/A" );
        }
        if ( appointment.getPsychologistId() != null ) {
            appointmentResponse.psychologistId( appointment.getPsychologistId() );
        }
        else {
            appointmentResponse.psychologistId( "Unknown" );
        }
        appointmentResponse.appointmentId( appointment.getAppointmentId() );
        appointmentResponse.appointmentDate( appointment.getAppointmentDate() );
        appointmentResponse.timeSlot( appointment.getTimeSlot() );
        appointmentResponse.active( appointment.getActive() );

        return appointmentResponse.build();
    }

    @Override
    public List<AppointmentResponse> toAppointmentResponses(List<Appointment> appointments) {
        if ( appointments == null ) {
            return null;
        }

        List<AppointmentResponse> list = new ArrayList<AppointmentResponse>( appointments.size() );
        for ( Appointment appointment : appointments ) {
            list.add( toAppointmentResponse( appointment ) );
        }

        return list;
    }

    private String appointmentUserId(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }
        User user = appointment.getUser();
        if ( user == null ) {
            return null;
        }
        String id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String appointmentUserName(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }
        User user = appointment.getUser();
        if ( user == null ) {
            return null;
        }
        String name = user.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private String appointmentUserEmail(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }
        User user = appointment.getUser();
        if ( user == null ) {
            return null;
        }
        String email = user.getEmail();
        if ( email == null ) {
            return null;
        }
        return email;
    }
}
