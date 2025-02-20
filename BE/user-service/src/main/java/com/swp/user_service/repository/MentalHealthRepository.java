package com.swp.user_service.repository;

import com.swp.user_service.entity.SurveyResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MentalHealthRepository extends JpaRepository<SurveyResult, String> {
    List<SurveyResult> findSurveyResultsByUserId(String userId);
//    Program registerUserForProgram(String email, String programId);
}
