package com.swp.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AllSurveyResponse {
    String surveyId;
    String title;
    Date createdDate;
    String description;
    Boolean active;
}