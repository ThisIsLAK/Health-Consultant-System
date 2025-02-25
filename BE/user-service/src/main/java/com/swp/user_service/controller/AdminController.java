package com.swp.user_service.controller;

import com.swp.user_service.dto.request.ResetPasswordRequest;
import com.swp.user_service.dto.request.UserUpdateByAdminRequest;
import com.swp.user_service.dto.request.UserUpdateRequest;
import com.swp.user_service.dto.response.ApiResponse;
import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.service.AdminService;
import com.swp.user_service.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminController {
    @Autowired
    private AdminService adminService;
    @Autowired
    private UserService userService;

    @DeleteMapping("/{userId}")
    ApiResponse<String> deleteUser(@PathVariable String userId) {
        adminService.deleteUser(userId);
        return ApiResponse.<String>builder().result("User has been deleted with ID:"+ " " + userId).build();
    }

    @GetMapping("/getAllUser")
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(adminService.getUsers())
                .build();
    }

    @GetMapping("/{email}")
    ApiResponse<UserResponse> getUserByEmail(@PathVariable("email") String email) {
        return ApiResponse.<UserResponse>builder()
                .result(adminService.getUserByEmail(email))
                .build();
    }

    @PutMapping("/resetUserPassword/{email}")
    ApiResponse<UserResponse> resetUserPassword(@PathVariable String email, @RequestBody ResetPasswordRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(adminService.resetUserPassword(email, request))
                .build();
    }

    @PutMapping("/updateUser/{email}")
    ApiResponse<UserResponse> updateUserByAdmin(@PathVariable String email, @RequestBody UserUpdateByAdminRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(adminService.updateUserByAdmin(email, request))
                .build();
    }
}
