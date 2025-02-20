package com.swp.user_service.controller;

import com.swp.user_service.dto.request.PsychologistCreationRequest;
import com.swp.user_service.dto.request.PyschologistUpdateRequest;
import com.swp.user_service.dto.response.ApiResponse;
import com.swp.user_service.dto.response.PsychologistResponse;
import com.swp.user_service.entity.Psychologist;
import com.swp.user_service.service.PsyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pyschologists")
public class PysController {
    @Autowired
    private PsyService pysService;

    @PostMapping
    public ResponseEntity<ApiResponse<PsychologistResponse>> createPsychologist(
            @RequestBody @Valid PsychologistCreationRequest request) {

        PsychologistResponse response = pysService.createPsychologist(request);

        return ResponseEntity.ok(ApiResponse.<PsychologistResponse>builder()
                .result(response)
                .build());
    }

    @DeleteMapping("/{pysId}")
    public String deletePyschologist(@PathVariable String pysId) {
        pysService.deletePsychologist(pysId);
        return "Pyschologist has been deleted";
    }
}
