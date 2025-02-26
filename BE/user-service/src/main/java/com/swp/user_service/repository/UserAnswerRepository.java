package com.swp.user_service.repository;

import com.swp.user_service.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, String> {
    List<UserAnswer> findBySurveyQuestion_Survey_SurveyIdAndUser_Id(String surveyId, String userId);
    List<UserAnswer> findBySurveyQuestion_QuestionIdAndUser_Id(String questionId, String userId);
}