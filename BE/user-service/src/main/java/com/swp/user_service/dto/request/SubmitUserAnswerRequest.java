package com.swp.user_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubmitUserAnswerRequest {
    String surveyId;
    String questionId;
    String optionId;
    String userId;
}
