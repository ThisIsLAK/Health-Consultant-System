package com.swp.user_service.controller;

import com.swp.user_service.dto.request.PsychologistCreationRequest;
import com.swp.user_service.dto.request.PsychologistUpdateRequest;
import com.swp.user_service.dto.request.SubmitUserAnswerRequest;
import com.swp.user_service.dto.response.*;
import com.swp.user_service.entity.UserAnswer;
import com.swp.user_service.service.*;
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
    private SupportProgramService supportProgramService;
    @Autowired
    private UserAnswerService userAnswerService;


    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PsychologistResponse>> createPsychologist(
            @RequestBody @Valid PsychologistCreationRequest request) {

        PsychologistResponse response = psyService.createPsychologist(request);

        return ResponseEntity.ok(ApiResponse.<PsychologistResponse>builder()
                .result(response)
                .build());
    }

    @DeleteMapping("/deletepsy/{psyId}")
    public String deletePyschologist(@PathVariable String psyId) {
        psyService.deletePsychologist(psyId);
        return "Pyschologist has been deleted";
    }

    @PutMapping("/updatepsy/{psyId}")
    ApiResponse<PsychologistResponse> updatePsy(@PathVariable String psyId, @RequestBody PsychologistUpdateRequest request) {
        return ApiResponse.<PsychologistResponse>builder()
                .result(psyService.updatePsy(psyId, request))
                .build();
    }

    @GetMapping("/findpsybyid/{id}")
    public ResponseEntity<UserResponse> getPsychologistById(@PathVariable String id) {
    UserResponse response = psyService.getPsychologistById(id);
    return ResponseEntity.ok(response);
    }

    @GetMapping("/allpsy")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllPsychologists() {
        List<UserResponse> psychologists = psyService.getAllPsychologists();
        return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder()
                .result(psychologists)
                .build());
    }

    //program===========================================================================================================
    @GetMapping("/allsupportprograms")
    public ApiResponse<List<SupportProgramResponse>> getAllSupportPrograms() {
        return ApiResponse.<List<SupportProgramResponse>>builder()
                .result(supportProgramService.getAllSupportPrograms())
                .build();
    }

    //answer - //survey ================================================================================================
    @GetMapping("/result")
    public ResponseEntity<SurveyResultResponse> getSurveyResult(@RequestParam String surveyId, @RequestParam String userId) {
        SurveyResultResponse result = userAnswerService.getSurveyResult(surveyId, userId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/surveyresultsbyid/{userId}")
    public ResponseEntity<List<UserAnswer>> getUserSurveyResults(@PathVariable String userId) {
        return ResponseEntity.ok(surveyService.getUserSurveyResults(userId));
    }
}
