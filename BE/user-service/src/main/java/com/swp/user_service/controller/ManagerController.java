package com.swp.user_service.controller;

import com.swp.user_service.dto.response.ApiResponse;
import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.dto.response.DashboardResponse;
import com.swp.user_service.service.AppointmentService;
import com.swp.user_service.service.ManagerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/manager")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ManagerController {

    AppointmentService appointmentService;
    ManagerService managerService;

    @GetMapping("/allappointments")
    public ApiResponse<List<AppointmentResponse>> getAllAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getAllAppointments();
        return ApiResponse.<List<AppointmentResponse>>builder()
                .message("All appointments retrieved successfully")
                .result(appointments)
                .build();
    }

    @GetMapping("/dashboard")
    public ApiResponse<DashboardResponse> getDashboardData() {
        DashboardResponse dashboardData = managerService.getDashboardData();
        return ApiResponse.<DashboardResponse>builder()
                .message("Dashboard data retrieved successfully")
                .result(dashboardData)
                .build();
    }
}
