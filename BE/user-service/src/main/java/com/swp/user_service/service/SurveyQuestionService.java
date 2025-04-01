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
                    //Chuyển từng optionRequest thành SurveyAnswerOption
                    //bằng surveyAnswerOptionMapper.toSurveyAnswerOption(optionRequest).
                    SurveyAnswerOption option = surveyAnswerOptionMapper.toSurveyAnswerOption(optionRequest);
                    //liên kết đáp án với câu hỏi
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
        // Tìm SurveyQuestion trong database
        SurveyQuestion existingQuestion = surveyQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Survey Question not found"));

        // Chuyển active thành 0
        existingQuestion.setActive(false);

        // Lưu thay đổi vào database
        surveyQuestionRepository.save(existingQuestion);
    }

}