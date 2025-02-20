package com.swp.user_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

//@Entity
////@Table(name = "SurveyResult")
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE)
//public class SurveyResult {
//    @Id
//    String resultId;
//    String surveyId;
//    String userId;
//    String result;
//}

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyResult {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String resultId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    String surveyId;
    String result;
}
