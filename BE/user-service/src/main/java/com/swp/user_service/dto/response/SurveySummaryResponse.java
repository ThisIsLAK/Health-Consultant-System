package com.swp.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveySummaryResponse {
    private Long totalSurveys;
    private Long activeSurveys;
    private Long totalSurveyResults;
    private Double averageScore;
}
