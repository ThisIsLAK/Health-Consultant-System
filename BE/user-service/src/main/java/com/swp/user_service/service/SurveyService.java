package com.swp.user_service.service;

import com.swp.user_service.dto.request.*;
import com.swp.user_service.dto.response.*;
import com.swp.user_service.entity.*;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.SurveyAnswerOptionMapper;
import com.swp.user_service.mapper.SurveyMapper;
import com.swp.user_service.mapper.SurveyQuestionMapper;
import com.swp.user_service.mapper.SurveyResultMapper;
import com.swp.user_service.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SurveyService {

    SurveyRepository surveyRepository;
    SurveyMapper surveyMapper;
    SurveyQuestionMapper surveyQuestionMapper;
    UserAnswerRepository userAnswerRepository;
    SurveyAnswerOptionMapper surveyAnswerOptionMapper;
    SurveyQuestionRepository surveyQuestionRepository;
    SurveyAnswerOptionRepository surveyAnswerOptionRepository;
    SurveyResultMapper surveyResultMapper;
    SurveyResultRepository surveyResultRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public SurveyResponse createSurveyWithQuestions(SurveyCreationRequest request) {
        try {
            // Tạo survey
            Survey survey = new Survey();
            survey.setSurveyCode(request.getSurveyCode());
            survey.setTitle(request.getTitle());
            survey.setDescription(request.getDescription());
            survey.setCreatedDate(new Date());
            survey.setActive(true);

            // Tạo danh sách câu hỏi
            List<SurveyQuestion> questions = new ArrayList<>();

            // Gán các câu hỏi cho survey
            for (SurveyQuestionCreationRequest questionRequest : request.getQuestions()) {
                SurveyQuestion question = new SurveyQuestion();
                question.setQuestionText(questionRequest.getQuestionText());
                question.setActive(true);
                question.setSurvey(survey); // Thiết lập mối quan hệ với survey

                // Tạo các lựa chọn trả lời
                List<SurveyAnswerOption> options = new ArrayList<>();
                for (SurveyAnswerOptionRequest optionRequest : questionRequest.getAnswerOptions()) {
                    SurveyAnswerOption option = new SurveyAnswerOption();
                    option.setOptionText(optionRequest.getOptionText());
                    if (optionRequest.getScore() < 0) {
                        throw new IllegalArgumentException("Score must be a non-negative number.");
                    }
                    option.setScore(optionRequest.getScore());
                    option.setActive(true);
                    option.setSurveyQuestion(question); // Thiết lập mối quan hệ với question
                    options.add(option);
                }

                question.setAnswerOptions(options);
                questions.add(question);
            }

            // Thiết lập mối quan hệ hai chiều
            survey.setQuestions(questions);

            // In ra để kiểm tra mối quan hệ
            for (SurveyQuestion q : questions) {
                log.info("Question: {}, Survey: {}", q.getQuestionText(), q.getSurvey() != null ? q.getSurvey().getSurveyId() : "null");
            }

            // Lưu survey và các thực thể liên quan
            survey = surveyRepository.saveAndFlush(survey);

            log.info("Survey saved with ID: {}", survey.getSurveyId());
            log.info("Number of questions saved: {}", survey.getQuestions().size());

            return surveyMapper.toSurveyResponse(survey);
        } catch (Exception e) {
            log.error("Error creating survey: ", e);
            throw e;
        }
    }

    public SurveyResponse getSurvey(String surveyId) {
        Optional<Survey> surveyOptional = surveyRepository.findById(surveyId);

        if (surveyOptional.isEmpty()) {
            log.warn("Survey not found with ID: {}", surveyId);
            return null;
        }

        Survey survey = surveyOptional.get();
        log.info("Survey retrieved: {}", survey);

        SurveyResponse response = surveyMapper.toSurveyResponse(survey);
        response.setQuestions(survey.getQuestions().stream()
                .map(surveyQuestionMapper::toSurveyQuestionResponse)
                .collect(Collectors.toList()));

        return response;
    }

    public List<AllSurveyResponse> getAllSurveys() {
        List<Survey> surveys = surveyRepository.findByActiveTrue();
        log.info("Retrieved {} active surveys", surveys.size());

        return surveys.stream()
                .map(surveyMapper::toAllSurveyResponse)
                .collect(Collectors.toList());
    }

    public List<SurveyResultResponse> getUserSurveyResults(String userId) {
        List<SurveyResult> surveyResults = surveyResultRepository.findByUser_Id(userId);
        return surveyResults.stream()
                .map(surveyResultMapper::toSurveyResultResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteSurveyById(String surveyId) {
        Optional<Survey> surveyOptional = surveyRepository.findById(surveyId);
        if (surveyOptional.isEmpty()) {
            throw new RuntimeException("Survey not found with ID: " + surveyId);
        }

        Survey survey = surveyOptional.get();
        survey.setActive(false);

        for (SurveyQuestion question : survey.getQuestions()) {
            question.setActive(false);
            for (SurveyAnswerOption option : question.getAnswerOptions()) {
                option.setActive(false);
            }
        }

        surveyRepository.save(survey);
        log.info("Survey with ID {} and its associated questions and answer options have been deactivated.", surveyId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public SurveyResponse updateSurvey(SurveyUpdateRequest request) {
        if (request == null || request.getQuestions() == null) {
            throw new IllegalArgumentException("Invalid request payload");
        }

        String surveyId = request.getSurveyId();
        log.info("Updating survey with ID: {}", surveyId);  

        try {
            Survey survey = surveyRepository.findById(surveyId)
                    .orElseThrow(() -> new RuntimeException("Survey not found with ID: " + surveyId));

            // Chỉ cập nhật nếu trường không null
            Optional.ofNullable(request.getTitle()).ifPresent(survey::setTitle);
            Optional.ofNullable(request.getDescription()).ifPresent(survey::setDescription);
            Optional.ofNullable(request.getActive()).ifPresent(survey::setActive);

            // Xử lý câu hỏi
            for (SurveyQuestionUpdateRequest questionRequest : request.getQuestions()) {
                log.info("Processing question with ID: {}", questionRequest.getQuestionId());

                Survey finalSurvey = survey;
                SurveyQuestion question = Optional.ofNullable(questionRequest.getQuestionId())
                        .flatMap(surveyQuestionRepository::findById)
                        .orElseGet(() -> {
                            SurveyQuestion newQuestion = new SurveyQuestion();
                            newQuestion.setSurvey(finalSurvey);
                            return newQuestion;
                        });

                Optional.ofNullable(questionRequest.getQuestionText()).ifPresent(question::setQuestionText);
                Optional.ofNullable(questionRequest.getActive()).ifPresent(question::setActive);

                // Xử lý câu trả lời
                for (SurveyAnswerOptionUpdateRequest optionRequest : questionRequest.getAnswerOptions()) {
                    log.info("Processing answer option with ID: {}", optionRequest.getOptionId());

                    SurveyAnswerOption option = Optional.ofNullable(optionRequest.getOptionId())
                            .flatMap(surveyAnswerOptionRepository::findById)
                            .orElseGet(() -> {
                                SurveyAnswerOption newOption = new SurveyAnswerOption();
                                newOption.setOptionId(UUID.randomUUID().toString());
                                return newOption;
                            });

                    Optional.ofNullable(optionRequest.getOptionText()).ifPresent(option::setOptionText);

                    // Chỉ cập nhật score nếu score mới không null, nếu null thì giữ nguyên score cũ
                    if (optionRequest.getScore() != -1) { // Chỉ cập nhật nếu không phải giá trị mặc định
                        option.setScore(optionRequest.getScore());
                    }

                    option.setActive(optionRequest.getActive() != null ? optionRequest.getActive() : true);
                    option.setSurveyQuestion(question);

                    question.getAnswerOptions().add(option);
                }

                survey.getQuestions().add(question);
            }

            survey = surveyRepository.save(survey);
            return surveyMapper.toSurveyResponse(survey);

        } catch (Exception e) {
            log.error("Error updating survey with ID: {}", surveyId, e);
            throw e;
        }
    }

    public SurveySummaryResponse getSurveySummary() {
        List<Survey> surveys = surveyRepository.findAll();
        long totalSurveys = surveys.size();
        long activeSurveys = surveys.stream().filter(Survey::getActive).count();


        List<SurveyResult> surveyResults = surveyResultRepository.findAll();
        long totalSurveyResults = surveyResults.size();

        double averageScore = totalSurveyResults > 0
                ? surveyResults.stream().mapToInt(SurveyResult::getScore).average().orElse(0.0)
                : 0.0;

        return SurveySummaryResponse.builder()
                .totalSurveys(totalSurveys)
                .activeSurveys(activeSurveys)
                .totalSurveyResults(totalSurveyResults)
                .averageScore(averageScore)
                .build();
    }
}