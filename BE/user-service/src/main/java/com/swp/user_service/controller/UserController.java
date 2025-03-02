package com.swp.user_service.controller;

import com.swp.user_service.dto.request.AppointmentRequest;
import com.swp.user_service.dto.request.UserCreationRequest;
import com.swp.user_service.dto.request.UserUpdateRequest;
import com.swp.user_service.dto.response.ApiResponse;
import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.entity.User;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.repository.UserRepository;
import com.swp.user_service.service.AppointmentService;
import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {

    UserService userService;

    AppointmentService appointmentService;

    UserRepository userRepository;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }


    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }

    @PostMapping("/bookappointment")
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(
            @RequestBody @Valid AppointmentRequest request) {
        AppointmentResponse response = appointmentService.bookAppointment(request);

        return ResponseEntity.ok(ApiResponse.<AppointmentResponse>builder()
                .result(response)
                .build());
    }


    @DeleteMapping("/cancelappointment/{appointmentId}")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(
            @PathVariable String appointmentId) {
        appointmentService.cancelAppointment(appointmentId);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Appointment cancelled successfully")
                .build());
    }

    @GetMapping("/appointmenthistory/{userId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getMyAppointments(@PathVariable("userId") String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        List<AppointmentResponse> appointments = userService.getAppointmentHistory(userId);

        return ResponseEntity.ok(ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .build());
    }
}
