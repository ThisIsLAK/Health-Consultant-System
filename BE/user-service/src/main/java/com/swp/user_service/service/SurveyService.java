package com.swp.user_service.service;

import com.swp.user_service.dto.request.SurveyCreationRequest;
import com.swp.user_service.dto.request.SurveyUpdateRequest;
import com.swp.user_service.dto.response.AllSurveyResponse;
import com.swp.user_service.dto.response.SurveyResponse;
import com.swp.user_service.entity.Survey;
import com.swp.user_service.entity.UserAnswer;
import com.swp.user_service.mapper.SurveyMapper;
import com.swp.user_service.mapper.SurveyQuestionMapper;
import com.swp.user_service.repository.SurveyRepository;
import com.swp.user_service.repository.UserAnswerRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    @PreAuthorize("hasRole('ADMIN')")
    public SurveyResponse createSurvey(SurveyCreationRequest request) {
        Survey survey = surveyMapper.toSurvey(request);
        survey.setCreatedDate(new Date());
        survey.setActive(true);
        survey = surveyRepository.save(survey);
        return surveyMapper.toSurveyResponse(survey);
    }

    public SurveyResponse getSurvey(String surveyId) {
        Survey survey = surveyRepository.findById(surveyId).orElse(null);
        if (survey != null) {
            SurveyResponse response = surveyMapper.toSurveyResponse(survey);
            response.setQuestions(survey.getQuestions().stream()
                    .map(surveyQuestionMapper::toSurveyQuestionResponse)
                    .collect(Collectors.toList()));
            return response;
        }
        return null;
    }

    public List<AllSurveyResponse> getAllSurveys() {
        List<Survey> surveys = surveyRepository.findByActiveTrue();
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
        if (surveyOptional.isPresent()) {
            Survey survey = surveyOptional.get();
            survey.setActive(false); // Đánh dấu là không hoạt động thay vì xóa hẳn
            surveyRepository.save(survey);
            log.info("Survey with ID " + surveyId + " has been deleted.");
        } else {
            throw new RuntimeException("Survey not found with ID: " + surveyId);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    public SurveyResponse updateSurvey(String surveyId, SurveyUpdateRequest request) {
        Optional<Survey> surveyOptional = surveyRepository.findById(surveyId);
        if (surveyOptional.isEmpty()) {
            throw new RuntimeException("Survey not found with ID: " + surveyId);
        }

        Survey survey = surveyOptional.get();
        survey.setTitle(request.getTitle());
        survey.setDescription(request.getDescription());
        survey.setActive(request.getActive());

        Survey updatedSurvey = surveyRepository.save(survey);

        return surveyMapper.toSurveyResponse(survey);
    }

}