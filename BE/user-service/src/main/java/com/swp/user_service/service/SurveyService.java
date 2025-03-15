package com.swp.user_service.service;

import com.swp.user_service.dto.request.*;
import com.swp.user_service.dto.response.AllSurveyResponse;
import com.swp.user_service.dto.response.SurveyResponse;
import com.swp.user_service.entity.Survey;
import com.swp.user_service.entity.SurveyAnswerOption;
import com.swp.user_service.entity.SurveyQuestion;
import com.swp.user_service.entity.UserAnswer;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.SurveyAnswerOptionMapper;
import com.swp.user_service.mapper.SurveyMapper;
import com.swp.user_service.mapper.SurveyQuestionMapper;
import com.swp.user_service.repository.SurveyAnswerOptionRepository;
import com.swp.user_service.repository.SurveyQuestionRepository;
import com.swp.user_service.repository.SurveyRepository;
import com.swp.user_service.repository.UserAnswerRepository;
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

    @PreAuthorize("hasRole('ADMIN')")
    public SurveyResponse createSurveyWithQuestions(SurveyCreationRequest request) {
        Survey survey = surveyMapper.toSurvey(request);
        survey.setCreatedDate(new Date());
        survey.setActive(true);

        final Survey savedSurvey = surveyRepository.save(survey); // Lưu ngay để có ID

        List<SurveyQuestion> questions = request.getQuestions().stream().map(questionRequest -> {
            SurveyQuestion question = surveyQuestionMapper.toSurveyQuestion(questionRequest);
            question.setSurvey(savedSurvey); // Không cần set UUID ở đây
            return question;
        }).collect(Collectors.toList());

        for (int i = 0; i < request.getQuestions().size(); i++) {
            SurveyQuestion question = questions.get(i);
            List<SurveyAnswerOption> answerOptions = request.getQuestions().get(i).getAnswerOptions().stream()
                    .map(optionRequest -> {
                        SurveyAnswerOption option = surveyAnswerOptionMapper.toSurveyAnswerOption(optionRequest);
                        option.setSurveyQuestion(question); // Không cần set UUID ở đây
                        return option;
                    }).collect(Collectors.toList());
            question.setAnswerOptions(answerOptions);
        }

        savedSurvey.setQuestions(questions);

        surveyRepository.save(savedSurvey);
        return surveyMapper.toSurveyResponse(savedSurvey);
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

    public List<UserAnswer> getUserSurveyResults(String userId) {
        return userAnswerRepository.findUserAnswersByUserId(userId);
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
    public SurveyResponse updateSurvey(SurveyUpdateRequest request) {
        String surveyId = request.getSurveyId(); // Lấy surveyId từ request
        log.info("Updating survey with ID: {}", surveyId);

        try {
            if (request == null || request.getQuestions() == null) {
                throw new IllegalArgumentException("Invalid request payload");
            }

            Survey survey = surveyRepository.findById(surveyId)
                    .orElseThrow(() -> new RuntimeException("Survey not found with ID: " + surveyId));

            survey.setTitle(request.getTitle());
            survey.setDescription(request.getDescription());
            survey.setActive(request.getActive());

            survey.getQuestions().clear();

            for (SurveyQuestionUpdateRequest questionRequest : request.getQuestions()) {
                log.info("Processing question with ID: {}", questionRequest.getQuestionId());

                SurveyQuestion question;
                if (questionRequest.getQuestionId() != null) {
                    question = surveyQuestionRepository.findById(questionRequest.getQuestionId())
                            .orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionRequest.getQuestionId()));
                } else {
                    question = new SurveyQuestion();
                    question.setSurvey(survey);
                }

                question.setQuestionText(questionRequest.getQuestionText());
                question.setActive(questionRequest.getActive());

                question.getAnswerOptions().clear();

                for (SurveyAnswerOptionUpdateRequest optionRequest : questionRequest.getAnswerOptions()) {
                    log.info("Processing answer option with ID: {}", optionRequest.getOptionId());

                    SurveyAnswerOption option;
                    if (optionRequest.getOptionId() != null) {
                        option = surveyAnswerOptionRepository.findById(optionRequest.getOptionId())
                                .orElseThrow(() -> new RuntimeException("Answer option not found with ID: " + optionRequest.getOptionId()));
                    } else {
                        option = new SurveyAnswerOption();
                        option.setOptionId(UUID.randomUUID().toString());
                    }

                    option.setOptionText(optionRequest.getOptionText());
                    option.setScore(optionRequest.getScore());
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

}