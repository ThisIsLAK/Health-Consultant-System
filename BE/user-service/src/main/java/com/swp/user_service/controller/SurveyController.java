package com.swp.user_service.controller;

import com.swp.user_service.dto.request.SurveyCreationRequest;
import com.swp.user_service.dto.response.SurveyResponse;
import com.swp.user_service.service.SurveyService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/surveys")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SurveyController {
    SurveyService surveyService;

    @PostMapping
    public ResponseEntity<SurveyResponse> createSurvey(@RequestBody SurveyCreationRequest request) {
        SurveyResponse survey = surveyService.createSurvey(request);
        return ResponseEntity.ok(survey);
    }

    @GetMapping("/{surveyId}")
    public ResponseEntity<SurveyResponse> getSurvey(@PathVariable String surveyId) {
        SurveyResponse survey = surveyService.getSurvey(surveyId);
        return ResponseEntity.ok(survey);
    }

}