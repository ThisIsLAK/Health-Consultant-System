package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SurveyQuestionCreationRequest;
import com.swp.user_service.dto.response.SurveyQuestionResponse;
import com.swp.user_service.entity.SurveyQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SurveyQuestionMapper {
    @Mapping(source = "surveyId", target = "survey.surveyId")
    SurveyQuestion toSurveyQuestion(SurveyQuestionCreationRequest request);

//    @Mapping(source = "survey.surveyId", target = "surveyId")
    SurveyQuestionResponse toSurveyQuestionResponse(SurveyQuestion question);
}

