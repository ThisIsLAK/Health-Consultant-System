package com.swp.user_service.controller;

import com.swp.user_service.dto.request.ProgramRegistrationRequest;
import com.swp.user_service.dto.request.AppointmentRequest;
import com.swp.user_service.dto.response.ApiResponse;
import com.swp.user_service.dto.response.SurveyResultResponse;
import com.swp.user_service.dto.response.ProgramResponse;
import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.service.MentalHealthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mental-health")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MentalHealthController {
    MentalHealthService mentalHealthService;

    @GetMapping("/survey-results")
    ApiResponse<List<SurveyResultResponse>> getSurveyResults() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Fetching survey results for user: {}", authentication.getName());
        return ApiResponse.<List<SurveyResultResponse>>builder()
                .result(mentalHealthService.getSurveyResults(authentication.getName()))
                .build();
    }

    @PostMapping("/programs/register")
    ApiResponse<ProgramResponse> registerForProgram(@RequestBody @Valid ProgramRegistrationRequest request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("User {} registering for program {}", authentication.getName(), request.getProgramId());
        return ApiResponse.<ProgramResponse>builder()
                .result(mentalHealthService.registerForProgram(authentication.getName(), request))
                .build();
    }

    @PostMapping("/appointments")
    ApiResponse<AppointmentResponse> bookAppointment(@RequestBody @Valid AppointmentRequest request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("User {} booking appointment with counselor {}", authentication.getName(), request.getAppointmentId());
        return ApiResponse.<AppointmentResponse>builder()
                .result(mentalHealthService.bookAppointment(authentication.getName(), request))
                .build();
    }
}
