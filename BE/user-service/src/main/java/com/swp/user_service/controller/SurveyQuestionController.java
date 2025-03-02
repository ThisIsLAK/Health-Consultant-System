package com.swp.user_service.controller;

import com.swp.user_service.dto.request.SurveyQuestionCreationRequest;
import com.swp.user_service.dto.response.SurveyQuestionResponse;
import com.swp.user_service.service.SurveyQuestionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/survey-questions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SurveyQuestionController {

    SurveyQuestionService surveyQuestionService;

    @PostMapping
    public ResponseEntity<SurveyQuestionResponse> createSurveyQuestion(@RequestBody SurveyQuestionCreationRequest request) {
        SurveyQuestionResponse question = surveyQuestionService.createSurveyQuestion(request);
        return ResponseEntity.ok(question);
    }
 
    @GetMapping("/{questionId}")
    public ResponseEntity<SurveyQuestionResponse> getSurveyQuestion(@PathVariable String questionId) {
        SurveyQuestionResponse question = surveyQuestionService.getSurveyQuestion(questionId);
        return ResponseEntity.ok(question);
    }
}