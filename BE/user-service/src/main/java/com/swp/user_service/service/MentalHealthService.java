package com.swp.user_service.service;

import com.swp.user_service.dto.request.ProgramRegistrationRequest;
import com.swp.user_service.dto.request.AppointmentRequest;
import com.swp.user_service.dto.response.SurveyResultResponse;
import com.swp.user_service.dto.response.ProgramResponse;
import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.repository.AppointmentRepository;
import com.swp.user_service.repository.MentalHealthRepository;
import com.swp.user_service.entity.SurveyResult;
import com.swp.user_service.entity.Program;
import com.swp.user_service.entity.Appointment;
import com.swp.user_service.repository.ProgramRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MentalHealthService {
    MentalHealthRepository mentalHealthRepository;
    AppointmentRepository appointmentRepository;
    ProgramRepository programRepository;

    public List<SurveyResultResponse> getSurveyResults(String userId) {
        List<SurveyResult> results = mentalHealthRepository.findSurveyResultsByUserId(userId);
        return results.stream().map(SurveyResultResponse::fromEntity).collect(Collectors.toList());
    }

    public ProgramResponse registerForProgram(String email, ProgramRegistrationRequest request) {
        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new AppException(ErrorCode.PROGRAM_NOT_EXIST));

        if (program.getRegisteredUsers() == null) {
            program.setRegisteredUsers(0);
        }

        program.setRegisteredUsers(program.getRegisteredUsers() + 1);
        programRepository.save(program);

        return ProgramResponse.fromEntity(program);
    }


    public AppointmentResponse bookAppointment(String email, AppointmentRequest request) {
        Appointment appointment = Appointment.builder()
                .appointmentId(request.getAppointmentId())
                .appointmentDate(request.getAppointmentDate()) // Đổi thành `appointmentDate`
                .timeSlot(request.getTimeSlot()) // Đổi thành `timeSlot`
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(savedAppointment);
    }
}
