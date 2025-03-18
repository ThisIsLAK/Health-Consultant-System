package com.swp.user_service.controller;

import com.swp.user_service.dto.request.PsychologistUpdateRequest;
import com.swp.user_service.dto.response.*;
import com.swp.user_service.entity.User;
import com.swp.user_service.entity.UserAnswer;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.UserMapper;
import com.swp.user_service.repository.SurveyResultRepository;
import com.swp.user_service.repository.UserRepository;
import com.swp.user_service.service.*;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import com.swp.user_service.mapper.SurveyResultMapper;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/psychologists")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PsyController {
    PsyService psyService;
    SurveyService surveyService;
    SupportProgramService supportProgramService;
    UserAnswerService userAnswerService;
    UserRepository userRepository ;
    UserMapper userMapper ;
    AppointmentService appointmentService;
    SurveyResultRepository surveyResultRepository;
    SurveyResultMapper surveyResultMapper;

    @PutMapping("/updatepsy/{psychologistId}")
    public ApiResponse<UserResponse> updatePsy(
            @PathVariable String psychologistId, @Valid @RequestBody PsychologistUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(psyService.updatePsy(psychologistId, request))
                .build();
    }

    @GetMapping("/findpsybyid/{psychologistId}")
    public ApiResponse<UserResponse> getPsychologistById(@PathVariable String psychologistId) {
        User psychologist = userRepository.findById(psychologistId)
                .filter(user -> Objects.equals(user.getRole().getRoleId(), "4"))
                .orElseThrow(() -> new AppException(ErrorCode.NOT_PSYCHOLOGIST));

        UserResponse response = userMapper.toUserResponse(psychologist);
        return ApiResponse.<UserResponse>builder()
                .message("Psychologist retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping("/allpsy")
    public ApiResponse<List<UserResponse>> getAllPsychologists() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(psyService.getAllPsychologists())
                .build();
    }

    /************************************************************
     *                  SUPPORT PROGRAM CONTROLLER              *
     ************************************************************/

    @GetMapping("/allsupportprograms")
    public ApiResponse<List<SupportProgramResponse>> getAllSupportPrograms() {
        return ApiResponse.<List<SupportProgramResponse>>builder()
                .result(supportProgramService.getAllSupportPrograms())
                .build();
    }

    @GetMapping("/findprogrambycode/{programCode}")
    public ApiResponse<SupportProgramResponse> findBySupportProgramCode(@PathVariable String programCode) {
        return ApiResponse.<SupportProgramResponse>builder()
                .result(supportProgramService.findByProgramCode(programCode))
                .build();
    }

    /************************************************************
     *                  SURVEY CONTROLLER                       *
     ************************************************************/

    @GetMapping("/result")
    public ApiResponse<SurveyResultResponse> getSurveyResult(
            @RequestParam String surveyId, @RequestParam String userId) {
        return ApiResponse.<SurveyResultResponse>builder()
                .result(userAnswerService.getSurveyResult(surveyId, userId))
                .build();
    }

    @GetMapping("/surveyresultsbyid/{userId}")
    public ApiResponse<List<SurveyResultResponse>> getUserSurveyResults(@PathVariable String userId) {
        List<SurveyResultResponse> results = surveyService.getUserSurveyResults(userId);
        return ApiResponse.<List<SurveyResultResponse>>builder()
                .message(results.isEmpty() ? "No survey results found for user" : "Survey results retrieved successfully")
                .result(results)
                .build();
    }

    @DeleteMapping("/cancelappointment/{appointmentId}")
    public ApiResponse<Void> cancelAppointment(@PathVariable String appointmentId) {

        appointmentService.cancelAppointment(appointmentId);

        return ApiResponse.<Void>builder()
                .message("Appointment cancelled successfully")
                .build();
    }

    @GetMapping("/psyappointment/{psychologistId}")
    public ApiResponse<List<AppointmentResponse>> getPsychologistAppointments(@PathVariable String psychologistId) {

        User psychologist = userRepository.findById(psychologistId)
                .filter(user -> Objects.equals(user.getRole().getRoleId(), "4"))
                .orElseThrow(() -> new AppException(ErrorCode.NOT_PSYCHOLOGIST));

        List<AppointmentResponse> appointments = appointmentService.getPsychologistAppointments(psychologistId);

        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .message("Psychologist appointments retrieved successfully")
                .build();
    }

    @GetMapping("/allactiveappointments/{psychologistId}")
    public ApiResponse<List<AppointmentResponse>> getAllActiveAppointments(@PathVariable String psychologistId) {

        User psychologist = userRepository.findById(psychologistId)
                .filter(user -> Objects.equals(user.getRole().getRoleId(), "4"))
                .orElseThrow(() -> new AppException(ErrorCode.NOT_PSYCHOLOGIST));

        List<AppointmentResponse> activeAppointments = psyService.getAllActiveAppointments(psychologistId);

        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(activeAppointments)
                .message("Active appointments retrieved successfully")
                .build();
    }
}
