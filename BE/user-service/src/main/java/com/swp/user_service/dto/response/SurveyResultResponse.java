package com.swp.user_service.dto.response;

import com.swp.user_service.entity.SurveyResult;
import com.swp.user_service.entity.Program;
import com.swp.user_service.entity.Appointment;
import com.swp.user_service.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyResultResponse {
    String surveyId;
    User user;
    String result;
    public static SurveyResultResponse fromEntity(SurveyResult surveyResult) {
        return SurveyResultResponse.builder()
                .surveyId(surveyResult.getSurveyId())
                .user(surveyResult.getUser())
                .result(surveyResult.getResult())
                .build();
    }
}