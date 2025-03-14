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
public class SurveyAnswerOption {
    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
    String optionId;

    String optionText;
    int score;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    SurveyQuestion surveyQuestion;

    Boolean active;

    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }
}