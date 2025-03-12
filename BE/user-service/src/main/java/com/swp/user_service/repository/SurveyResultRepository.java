package com.swp.user_service.repository;

import com.swp.user_service.entity.SurveyResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SurveyResultRepository extends JpaRepository<SurveyResult, Long> {
    Optional<SurveyResult> findBySurvey_SurveyIdAndUser_Id(String surveyId, String userId);
}
