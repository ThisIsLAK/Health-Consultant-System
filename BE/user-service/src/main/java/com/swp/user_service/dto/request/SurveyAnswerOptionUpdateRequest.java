package com.swp.user_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyAnswerOptionUpdateRequest {
    String optionId;  // Có thể null nếu là lựa chọn mới
    String optionText;
    int score;
    Boolean active;
}