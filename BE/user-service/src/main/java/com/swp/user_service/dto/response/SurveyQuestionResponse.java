package com.swp.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyQuestionResponse {
    String questionId;
//    String surveyId;
    String questionText;
    List<SurveyAnswerOptionResponse> answerOptions;
    Boolean active;
}
