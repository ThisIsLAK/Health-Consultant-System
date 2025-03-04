package com.swp.user_service.service;

import com.swp.user_service.dto.request.SurveyQuestionCreationRequest;
import com.swp.user_service.dto.response.SurveyQuestionResponse;
import com.swp.user_service.entity.Survey;
import com.swp.user_service.entity.SurveyAnswerOption;
import com.swp.user_service.entity.SurveyQuestion;
import com.swp.user_service.mapper.SurveyAnswerOptionMapper;
import com.swp.user_service.mapper.SurveyQuestionMapper;
import com.swp.user_service.repository.SurveyQuestionRepository;
import com.swp.user_service.repository.SurveyRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SurveyQuestionService {

    SurveyQuestionRepository surveyQuestionRepository;
    SurveyRepository surveyRepository;
    SurveyQuestionMapper surveyQuestionMapper;
    SurveyAnswerOptionMapper surveyAnswerOptionMapper;

    public SurveyQuestionResponse createSurveyQuestion(SurveyQuestionCreationRequest request) {
        Survey survey = surveyRepository.findById(request.getSurveyId())
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        SurveyQuestion question = surveyQuestionMapper.toSurveyQuestion(request);
        question.setSurvey(survey);

        final SurveyQuestion finalQuestion = question;
        List<SurveyAnswerOption> answerOptions = request.getAnswerOptions().stream()
                .map(optionRequest -> {
                    SurveyAnswerOption option = surveyAnswerOptionMapper.toSurveyAnswerOption(optionRequest);
                    option.setSurveyQuestion(finalQuestion);
                    return option;
                })
                .collect(Collectors.toList());

        question.setAnswerOptions(answerOptions);

        question = surveyQuestionRepository.save(question);
        return surveyQuestionMapper.toSurveyQuestionResponse(question);
    }

    public SurveyQuestionResponse getSurveyQuestion(String questionId) {
        SurveyQuestion question = surveyQuestionRepository.findById(questionId).orElse(null);
        return surveyQuestionMapper.toSurveyQuestionResponse(question);
    }

    public SurveyQuestionResponse updateSurveyQuestion(String questionId, SurveyQuestionCreationRequest request) {
        SurveyQuestion existingQuestion = surveyQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Survey Question not found"));

        existingQuestion.setQuestionText(request.getQuestionText());

        // Tạo biến tạm final để sử dụng trong lambda
        final SurveyQuestion finalQuestion = existingQuestion;

        // Cập nhật danh sách đáp án
        List<SurveyAnswerOption> answerOptions = request.getAnswerOptions().stream()
                .map(optionRequest -> {
                    SurveyAnswerOption option = surveyAnswerOptionMapper.toSurveyAnswerOption(optionRequest);
                    option.setSurveyQuestion(finalQuestion);
                    return option;
                })
                .collect(Collectors.toList());

        existingQuestion.setAnswerOptions(answerOptions);

        // Lưu cập nhật vào DB
        existingQuestion = surveyQuestionRepository.save(existingQuestion);
        return surveyQuestionMapper.toSurveyQuestionResponse(existingQuestion);
    }


    public void deleteSurveyQuestion(String questionId) {
        SurveyQuestion existingQuestion = surveyQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Survey Question not found"));

        surveyQuestionRepository.delete(existingQuestion);
    }

}