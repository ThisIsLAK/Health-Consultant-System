package com.swp.user_service.mapper;

import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.entity.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "psychologistId", target = "psychologistId")
    AppointmentResponse toAppointmentResponse(Appointment appointment);
    List<AppointmentResponse> toAppointmentResponses(List<Appointment> appointments);

}
