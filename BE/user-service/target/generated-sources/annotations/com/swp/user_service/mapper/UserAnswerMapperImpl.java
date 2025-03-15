package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SubmitUserAnswerRequest;
import com.swp.user_service.dto.response.UserAnswerResponse;
import com.swp.user_service.entity.SurveyAnswerOption;
import com.swp.user_service.entity.SurveyQuestion;
import com.swp.user_service.entity.User;
import com.swp.user_service.entity.UserAnswer;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class UserAnswerMapperImpl implements UserAnswerMapper {

    @Override
    public UserAnswer toUserAnswer(SubmitUserAnswerRequest request) {
        if ( request == null ) {
            return null;
        }

        UserAnswer.UserAnswerBuilder userAnswer = UserAnswer.builder();

        userAnswer.surveyQuestion( submitUserAnswerRequestToSurveyQuestion( request ) );
        userAnswer.surveyAnswerOption( submitUserAnswerRequestToSurveyAnswerOption( request ) );
        userAnswer.user( submitUserAnswerRequestToUser( request ) );

        return userAnswer.build();
    }

    @Override
    public UserAnswerResponse toUserAnswerResponse(UserAnswer userAnswer) {
        if ( userAnswer == null ) {
            return null;
        }

        UserAnswerResponse.UserAnswerResponseBuilder userAnswerResponse = UserAnswerResponse.builder();

        userAnswerResponse.questionId( userAnswerSurveyQuestionQuestionId( userAnswer ) );
        userAnswerResponse.optionId( userAnswerSurveyAnswerOptionOptionId( userAnswer ) );
        userAnswerResponse.userId( userAnswerUserId( userAnswer ) );
        userAnswerResponse.answerId( userAnswer.getAnswerId() );

        return userAnswerResponse.build();
    }

    protected SurveyQuestion submitUserAnswerRequestToSurveyQuestion(SubmitUserAnswerRequest submitUserAnswerRequest) {
        if ( submitUserAnswerRequest == null ) {
            return null;
        }

        SurveyQuestion.SurveyQuestionBuilder surveyQuestion = SurveyQuestion.builder();

        surveyQuestion.questionId( submitUserAnswerRequest.getQuestionId() );

        return surveyQuestion.build();
    }

    protected SurveyAnswerOption submitUserAnswerRequestToSurveyAnswerOption(SubmitUserAnswerRequest submitUserAnswerRequest) {
        if ( submitUserAnswerRequest == null ) {
            return null;
        }

        SurveyAnswerOption.SurveyAnswerOptionBuilder surveyAnswerOption = SurveyAnswerOption.builder();

        surveyAnswerOption.optionId( submitUserAnswerRequest.getOptionId() );

        return surveyAnswerOption.build();
    }

    protected User submitUserAnswerRequestToUser(SubmitUserAnswerRequest submitUserAnswerRequest) {
        if ( submitUserAnswerRequest == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.id( submitUserAnswerRequest.getUserId() );

        return user.build();
    }

    private String userAnswerSurveyQuestionQuestionId(UserAnswer userAnswer) {
        if ( userAnswer == null ) {
            return null;
        }
        SurveyQuestion surveyQuestion = userAnswer.getSurveyQuestion();
        if ( surveyQuestion == null ) {
            return null;
        }
        String questionId = surveyQuestion.getQuestionId();
        if ( questionId == null ) {
            return null;
        }
        return questionId;
    }

    private String userAnswerSurveyAnswerOptionOptionId(UserAnswer userAnswer) {
        if ( userAnswer == null ) {
            return null;
        }
        SurveyAnswerOption surveyAnswerOption = userAnswer.getSurveyAnswerOption();
        if ( surveyAnswerOption == null ) {
            return null;
        }
        String optionId = surveyAnswerOption.getOptionId();
        if ( optionId == null ) {
            return null;
        }
        return optionId;
    }

    private String userAnswerUserId(UserAnswer userAnswer) {
        if ( userAnswer == null ) {
            return null;
        }
        User user = userAnswer.getUser();
        if ( user == null ) {
            return null;
        }
        String id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
