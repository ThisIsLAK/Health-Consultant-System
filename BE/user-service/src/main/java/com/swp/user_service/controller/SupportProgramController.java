package com.swp.user_service.controller;

import com.swp.user_service.dto.request.SupportProgramRequest;
import com.swp.user_service.dto.request.SupportProgramSignupRequest;
import com.swp.user_service.dto.response.ApiResponse;
import com.swp.user_service.dto.response.SupportProgramResponse;
import com.swp.user_service.service.SupportProgramService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/support-programs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupportProgramController {

    SupportProgramService supportProgramService;

    @PostMapping
    public ApiResponse<SupportProgramResponse> createSupportProgram(@RequestBody @Valid SupportProgramRequest request) {
        return ApiResponse.<SupportProgramResponse>builder()
                .result(supportProgramService.createSupportProgram(request))
                .build();
    }

    @PutMapping("/{programCode}")
    public ApiResponse<SupportProgramResponse> updateSupportProgram(@PathVariable String programCode, @RequestBody @Valid SupportProgramRequest request) {
        return ApiResponse.<SupportProgramResponse>builder()
                .result(supportProgramService.updateSupportProgram(programCode, request))
                .build();
    }

    @DeleteMapping("/{programCode}")
    public ApiResponse<String> deleteSupportProgram(@PathVariable String programCode) {
        supportProgramService.deleteSupportProgram(programCode);
        return ApiResponse.<String>builder()
                .message("Delete successfully")
                .build();
    }

    @GetMapping
    public ApiResponse<List<SupportProgramResponse>> getAllSupportPrograms() {
        return ApiResponse.<List<SupportProgramResponse>>builder()
                .result(supportProgramService.getAllSupportPrograms())
                .build();
    }

    @GetMapping("/{programCode}")
    public ApiResponse<SupportProgramResponse> findBySupportProgramCode(@PathVariable String programCode) {
        return ApiResponse.<SupportProgramResponse>builder()
                .result(supportProgramService.findByProgramCode(programCode))
                .build();
    }

    @PostMapping("/signup")
    public ApiResponse<SupportProgramResponse> signupForProgram(@RequestBody @Valid SupportProgramSignupRequest request) {
        return ApiResponse.<SupportProgramResponse>builder()
                .result(supportProgramService.signupForProgram(request, request.getEmail()))
                .build();
    }

}