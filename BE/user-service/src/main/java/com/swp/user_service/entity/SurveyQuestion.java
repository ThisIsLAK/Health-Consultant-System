package com.swp.user_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyQuestion {
    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
    String questionId;

    @ManyToOne
    @JoinColumn(name = "survey_id", nullable = false)
    Survey survey;

    String questionText;

    @OneToMany(mappedBy = "surveyQuestion", cascade = CascadeType.ALL, orphanRemoval = true)
    List<SurveyAnswerOption> answerOptions;

    Boolean active;

    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }
}