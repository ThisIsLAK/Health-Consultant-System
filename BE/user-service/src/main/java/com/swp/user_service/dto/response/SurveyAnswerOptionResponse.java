package com.swp.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyAnswerOptionResponse {
    String optionId;
    String optionText;
    Integer score;
    Boolean active;
}
