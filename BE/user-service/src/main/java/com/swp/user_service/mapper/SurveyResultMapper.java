package com.swp.user_service.mapper;

import com.swp.user_service.dto.response.SurveyResultResponse;
import com.swp.user_service.entity.SurveyResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SurveyResultMapper {
    SurveyResultMapper INSTANCE = Mappers.getMapper(SurveyResultMapper.class);

    @Mapping(source = "survey.surveyId", target = "surveyId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.name", target = "userName")
    @Mapping(source = "score", target = "score")
    SurveyResultResponse toSurveyResultResponse(SurveyResult surveyResult);
}
