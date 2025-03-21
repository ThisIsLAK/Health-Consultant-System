package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SurveyQuestionCreationRequest;
import com.swp.user_service.dto.request.SurveyQuestionUpdateRequest;
import com.swp.user_service.dto.response.SurveyQuestionResponse;
import com.swp.user_service.entity.SurveyQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SurveyQuestionMapper {
    @Mapping(target = "active", source = "active")
    @Mapping(target = "survey", ignore = true) // Ignore survey mapping here
    SurveyQuestion toSurveyQuestion(SurveyQuestionCreationRequest request);

    @Mapping(target = "survey", ignore = true) // Tương tự, gán thủ công sau khi ánh xạ
    SurveyQuestion toSurveyQuestion(SurveyQuestionUpdateRequest request);

    SurveyQuestionResponse toSurveyQuestionResponse(SurveyQuestion question);
}