package com.swp.user_service.repository;

import com.swp.user_service.entity.SurveyAnswerOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyAnswerOptionRepository extends JpaRepository<SurveyAnswerOption, String> {
}