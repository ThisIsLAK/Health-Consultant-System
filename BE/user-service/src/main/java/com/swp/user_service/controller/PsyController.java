package com.swp.user_service.controller;

import com.swp.user_service.dto.request.PsychologistCreationRequest;
import com.swp.user_service.dto.request.PsychologistUpdateRequest;
import com.swp.user_service.dto.response.*;
import com.swp.user_service.entity.UserAnswer;
import com.swp.user_service.service.AppointmentService;
import com.swp.user_service.service.PsyService;
import com.swp.user_service.service.SurveyService;
import com.swp.user_service.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/psychologists")
public class PsyController {
    @Autowired
    private PsyService psyService;
    @Autowired
    private SurveyService surveyService;
    @Autowired
    private UserService userService;
    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PsychologistResponse>> createPsychologist(
            @RequestBody @Valid PsychologistCreationRequest request) {

        PsychologistResponse response = psyService.createPsychologist(request);

        return ResponseEntity.ok(ApiResponse.<PsychologistResponse>builder()
                .result(response)
                .build());
    }

    @DeleteMapping("/{psyId}")
    public String deletePyschologist(@PathVariable String psyId) {
        psyService.deletePsychologist(psyId);
        return "Pyschologist has been deleted";
    }

    @PutMapping("/{psyId}")
    ApiResponse<PsychologistResponse> updatePsy(@PathVariable String psyId, @RequestBody PsychologistUpdateRequest request) {
        return ApiResponse.<PsychologistResponse>builder()
                .result(psyService.updatePsy(psyId, request))
                .build();
    }

    @GetMapping("/results/{userId}")
    public ResponseEntity<List<UserAnswer>> getUserSurveyResults(@PathVariable String userId) {
        return ResponseEntity.ok(surveyService.getUserSurveyResults(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getPsychologistById(@PathVariable String id) {
    UserResponse response = psyService.getPsychologistById(id);
    return ResponseEntity.ok(response);
    }

    @GetMapping("/appointmentview/{psychologistId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getPsychologistAppointments(
            @PathVariable String psychologistId) {
        List<AppointmentResponse> appointments = appointmentService.getPsychologistAppointments(psychologistId);

        return ResponseEntity.ok(ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .build());
    }




}
