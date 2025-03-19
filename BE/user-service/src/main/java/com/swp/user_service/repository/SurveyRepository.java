package com.swp.user_service.repository;

import com.swp.user_service.entity.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, String> {
    List<Survey> findByActiveTrue();
    Optional<Survey> findBySurveyCode(String surveyCode);
    boolean existsBySurveyCode(String surveyCode);

}
