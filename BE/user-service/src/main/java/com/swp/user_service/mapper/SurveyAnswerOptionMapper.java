package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SurveyAnswerOptionRequest;
import com.swp.user_service.dto.request.SurveyAnswerOptionUpdateRequest;
import com.swp.user_service.entity.SurveyAnswerOption;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SurveyAnswerOptionMapper {
    @Mapping(target = "surveyQuestion", ignore = true) // Ignore surveyQuestion mapping here
    SurveyAnswerOption toSurveyAnswerOption(SurveyAnswerOptionRequest request);

    SurveyAnswerOption toSurveyAnswerOption(SurveyAnswerOptionUpdateRequest request);

}