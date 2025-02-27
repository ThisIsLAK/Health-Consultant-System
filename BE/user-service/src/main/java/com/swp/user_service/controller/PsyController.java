package com.swp.user_service.controller;

import com.swp.user_service.dto.request.PsychologistCreationRequest;
import com.swp.user_service.dto.request.PsychologistUpdateRequest;
import com.swp.user_service.dto.response.ApiResponse;
import com.swp.user_service.dto.response.PsychologistResponse;
import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.service.PsyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/psychologists")
public class PsyController {
    @Autowired
    private PsyService psyService;

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

}
