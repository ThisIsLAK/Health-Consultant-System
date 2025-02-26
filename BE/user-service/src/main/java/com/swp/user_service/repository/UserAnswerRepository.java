package com.swp.user_service.repository;

import com.swp.user_service.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, String> {
    List<UserAnswer> findBySurveyQuestion_Survey_SurveyIdAndUser_Id(String surveyId, String userId);
    List<UserAnswer> findBySurveyQuestion_QuestionIdAndUser_Id(String questionId, String userId);

    @Query("SELECT ua FROM UserAnswer ua " +
            "JOIN FETCH ua.surveyQuestion sq " +
            "JOIN FETCH sq.survey s " +
            "JOIN FETCH ua.surveyAnswerOption sao " +
            "WHERE ua.user.id = :userId")

    List<UserAnswer> findUserAnswersByUserId(String userId);
}