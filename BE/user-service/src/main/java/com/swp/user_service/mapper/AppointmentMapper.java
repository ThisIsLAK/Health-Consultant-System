package com.swp.user_service.mapper;

import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.entity.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    @Mapping(source = "user.id", target = "userId", defaultValue = "Unknown")
    @Mapping(source = "user.name", target = "studentName", defaultValue = "Unknown")
    @Mapping(source = "user.email", target = "studentEmail", defaultValue = "N/A")
    @Mapping(source = "psychologistId", target = "psychologistId", defaultValue = "Unknown")
    @Mapping(target = "psychologistName", ignore = true) // Sẽ xử lý sau
    @Mapping(target = "psychologistEmail", ignore = true) // Sẽ xử lý sau
    AppointmentResponse toAppointmentResponse(Appointment appointment);

    List<AppointmentResponse> toAppointmentResponses(List<Appointment> appointments);
}

