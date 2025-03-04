package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SubmitUserAnswerRequest;
import com.swp.user_service.dto.response.UserAnswerResponse;
import com.swp.user_service.entity.UserAnswer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserAnswerMapper {
    @Mapping(source = "questionId", target = "surveyQuestion.questionId")
    @Mapping(source = "optionId", target = "surveyAnswerOption.optionId")
    @Mapping(source = "userId", target = "user.id")
    UserAnswer toUserAnswer(SubmitUserAnswerRequest request);

    @Mapping(source = "surveyQuestion.questionId", target = "questionId")
    @Mapping(source = "surveyAnswerOption.optionId", target = "optionId")
    @Mapping(source = "user.id", target = "userId")
    UserAnswerResponse toUserAnswerResponse(UserAnswer userAnswer);
}