package com.swp.user_service.controller;

import com.swp.user_service.dto.request.SubmitUserAnswerRequest;
import com.swp.user_service.dto.response.UserAnswerResponse;
import com.swp.user_service.dto.response.SurveyResultResponse;
import com.swp.user_service.service.UserAnswerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-answers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserAnswerController {
    UserAnswerService userAnswerService;

    @PostMapping
    public ResponseEntity<UserAnswerResponse> submitUserAnswer(@RequestBody SubmitUserAnswerRequest request) {
        UserAnswerResponse answer = userAnswerService.submitUserAnswer(request);
        return ResponseEntity.ok(answer);
    }

    @GetMapping("/result")
    public ResponseEntity<SurveyResultResponse> getSurveyResult(@RequestParam String surveyId, @RequestParam String userId) {
        SurveyResultResponse result = userAnswerService.getSurveyResult(surveyId, userId);
        return ResponseEntity.ok(result);
    }

}