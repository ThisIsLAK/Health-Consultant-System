package com.swp.user_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyQuestionUpdateRequest {
    String questionId;  // Có thể null nếu là câu hỏi mới
    String surveyId;
    String questionText;
    Boolean active;
    List<SurveyAnswerOptionUpdateRequest> answerOptions;
}