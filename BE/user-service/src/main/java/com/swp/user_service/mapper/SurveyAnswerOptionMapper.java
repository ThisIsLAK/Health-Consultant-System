package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SurveyAnswerOptionRequest;
import com.swp.user_service.entity.SurveyAnswerOption;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SurveyAnswerOptionMapper {
    SurveyAnswerOption toSurveyAnswerOption(SurveyAnswerOptionRequest request);
}