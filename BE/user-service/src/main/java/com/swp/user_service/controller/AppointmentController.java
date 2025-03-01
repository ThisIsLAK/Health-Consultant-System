package com.swp.user_service.controller;

import com.swp.user_service.dto.request.AppointmentRequest;
import com.swp.user_service.dto.response.ApiResponse;
import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(
            @RequestBody @Valid AppointmentRequest request) {
        AppointmentResponse response = appointmentService.bookAppointment(request);

        return ResponseEntity.ok(ApiResponse.<AppointmentResponse>builder()
                .result(response)
                .build());
    }

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(
            @PathVariable String appointmentId) {
        appointmentService.cancelAppointment(appointmentId);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Appointment cancelled successfully")
                .build());
    }

    @GetMapping("/psychologist/{psychologistId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getPsychologistAppointments(
            @PathVariable String psychologistId) {
        List<AppointmentResponse> appointments = appointmentService.getPsychologistAppointments(psychologistId);

        return ResponseEntity.ok(ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getUserAppointments(
            @PathVariable String userId) {
        List<AppointmentResponse> appointments = appointmentService.getUserAppointments(userId);

        return ResponseEntity.ok(ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .build());
    }

}