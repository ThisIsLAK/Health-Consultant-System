package com.swp.user_service.controller;

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


//    @PutMapping("/{userId}")
//    public ResponseEntity<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
//        return ResponseEntity.ok(adminService.updateUser(userId, request));
//    }

    @DeleteMapping("/{userId}")
    ApiResponse<String> deleteUser(@PathVariable String userId) {

        log.info("UserController - deleteUser is called for user ID: {}", userId);         //testloi

        adminService.deleteUser(userId);
        return ApiResponse.<String>builder().result("User has been deleted").build();
    }

    @GetMapping("/getAllUser")
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(adminService.getUsers())
                .build();
    }
}
