package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SurveyCreationRequest;
import com.swp.user_service.dto.response.SurveyQuestionResponse;
import com.swp.user_service.dto.response.SurveyResponse;
import com.swp.user_service.entity.Survey;
import com.swp.user_service.entity.SurveyQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SurveyMapper {
    Survey toSurvey(SurveyCreationRequest request);

    @Mapping(source = "questions", target = "questions")
    SurveyResponse toSurveyResponse(Survey survey);

    List<SurveyQuestionResponse> mapQuestions(List<SurveyQuestion> questions);
}
