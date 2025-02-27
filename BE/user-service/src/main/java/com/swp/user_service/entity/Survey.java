package com.swp.user_service.entity;

import com.swp.user_service.dto.response.SurveyQuestionResponse;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String surveyId;

    String title;
    @Temporal(TemporalType.DATE)
    Date createdDate;
    String description;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    List<SurveyQuestion> questions;
}
