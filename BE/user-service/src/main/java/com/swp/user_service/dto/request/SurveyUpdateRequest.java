package com.swp.user_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyUpdateRequest {
    String surveyId;
    String surveyCode;
    String title;
    String description;
    Boolean active;
    List<SurveyQuestionUpdateRequest> questions;
}