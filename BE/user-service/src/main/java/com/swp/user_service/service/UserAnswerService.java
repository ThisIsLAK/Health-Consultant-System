package com.swp.user_service.service;

import com.swp.user_service.dto.request.SubmitUserAnswerRequest;
import com.swp.user_service.dto.response.UserAnswerResponse;
import com.swp.user_service.dto.response.SurveyResultResponse;
import com.swp.user_service.entity.UserAnswer;
import com.swp.user_service.mapper.UserAnswerMapper;
import com.swp.user_service.repository.UserAnswerRepository;
import com.swp.user_service.repository.SurveyAnswerOptionRepository;
import com.swp.user_service.repository.SurveyRepository;
import com.swp.user_service.repository.SurveyQuestionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserAnswerService {

    UserAnswerRepository userAnswerRepository;
    UserAnswerMapper userAnswerMapper;

    public UserAnswerResponse submitUserAnswer(SubmitUserAnswerRequest request) {
        // Check if the user has already answered this question
        List<UserAnswer> existingAnswers = userAnswerRepository.findBySurveyQuestion_QuestionIdAndUser_Id(request.getQuestionId(), request.getUserId());
        if (!existingAnswers.isEmpty()) {
            throw new IllegalArgumentException("User has already answered this question.");
        }

        UserAnswer userAnswer = userAnswerMapper.toUserAnswer(request);
        userAnswer = userAnswerRepository.save(userAnswer);
        return userAnswerMapper.toUserAnswerResponse(userAnswer);
    }

    public SurveyResultResponse getSurveyResult(String surveyId, String userId) {
        List<UserAnswer> userAnswers = userAnswerRepository.findBySurveyQuestion_Survey_SurveyIdAndUser_Id(surveyId, userId);
        int totalScore = userAnswers.stream()
                .mapToInt(answer -> answer.getSurveyAnswerOption().getScore())
                .sum();

        return SurveyResultResponse.builder()
                .surveyId(surveyId)
                .userId(userId)
                .score(totalScore)
                .build();
    }
}