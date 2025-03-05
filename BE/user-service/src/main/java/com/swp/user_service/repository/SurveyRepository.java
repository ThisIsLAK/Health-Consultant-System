package com.swp.user_service.repository;

import com.swp.user_service.entity.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, String> {
    List<Survey> findByActiveTrue();
}
