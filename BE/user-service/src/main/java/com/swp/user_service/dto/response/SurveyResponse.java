package com.swp.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyResponse {
    String surveyId;
    String title;
    Date createdDate;
    String description;
    List<SurveyQuestionResponse> questions;
}