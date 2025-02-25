package com.swp.user_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyQuestionCreationRequest {
    String surveyId;
    String questionText;
    List<SurveyAnswerOptionRequest> answerOptions;
}
