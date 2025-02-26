package com.swp.user_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String answerId;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    SurveyQuestion surveyQuestion;

    @ManyToOne
    @JoinColumn(name = "option_id", nullable = false)
    SurveyAnswerOption surveyAnswerOption;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;
}