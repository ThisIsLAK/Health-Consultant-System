package com.swp.user_service.service;

import com.swp.user_service.dto.request.SubmitUserAnswerRequest;
import com.swp.user_service.dto.response.UserAnswerResponse;
import com.swp.user_service.dto.response.SurveyResultResponse;
import com.swp.user_service.entity.Survey;
import com.swp.user_service.entity.SurveyAnswerOption;
import com.swp.user_service.entity.SurveyResult;
import com.swp.user_service.entity.User;
import com.swp.user_service.entity.UserAnswer;
import com.swp.user_service.mapper.SurveyResultMapper;
import com.swp.user_service.mapper.UserAnswerMapper;
import com.swp.user_service.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserAnswerService {

    UserAnswerRepository userAnswerRepository;
    UserAnswerMapper userAnswerMapper;
    SurveyAnswerOptionRepository surveyAnswerOptionRepository;
    SurveyRepository surveyRepository;
    SurveyResultRepository surveyResultRepository;
    UserRepository userRepository;
    SurveyResultMapper surveyResultMapper;

    @Transactional
    public List<UserAnswerResponse> submitUserAnswers(List<SubmitUserAnswerRequest> requests) {
        if (requests.isEmpty()) {
            throw new IllegalArgumentException("Request list cannot be empty");
        }

        List<UserAnswerResponse> responses = new ArrayList<>();
        String userId = requests.get(0).getUserId();
        String surveyId = requests.get(0).getSurveyId();

        // Kiểm tra User và Survey có tồn tại không
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new IllegalArgumentException("Survey not found: " + surveyId));

        int totalScore = 0;

        for (SubmitUserAnswerRequest request : requests) {
            try {
                log.info("Processing request: {}", request);

                SurveyAnswerOption answerOption = surveyAnswerOptionRepository.findById(request.getOptionId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid answer option ID: " + request.getOptionId()));

                UserAnswer userAnswer = userAnswerMapper.toUserAnswer(request);
                userAnswer.setSurveyAnswerOption(answerOption);
                userAnswer.setUser(user);
                userAnswer = userAnswerRepository.save(userAnswer);
                responses.add(userAnswerMapper.toUserAnswerResponse(userAnswer));

                totalScore += answerOption.getScore();

                log.info("Successfully processed request: {}", request);
            } catch (Exception e) {
                log.error("Error processing request: {}", request, e);
                throw new RuntimeException("Error submitting user answer", e);
            }
        }

        // Cập nhật điểm số vào SurveyResult
        updateSurveyResult(survey, user, totalScore);

        return responses;
    }

    private void updateSurveyResult(Survey survey, User user, int totalScore) {
        SurveyResult surveyResult = surveyResultRepository.findBySurvey_SurveyIdAndUser_Id(survey.getSurveyId(), user.getId())
                .orElse(SurveyResult.builder()
                        .survey(survey)
                        .user(user)
                        .score(0)
                        .build());

        surveyResult.setScore(totalScore);
        surveyResultRepository.save(surveyResult);
    }

    public SurveyResultResponse getSurveyResult(String surveyId, String userId) {
        SurveyResult surveyResult = surveyResultRepository.findBySurvey_SurveyIdAndUser_Id(surveyId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Survey result not found for user: " + userId));

        return surveyResultMapper.toSurveyResultResponse(surveyResult);
    }
}
