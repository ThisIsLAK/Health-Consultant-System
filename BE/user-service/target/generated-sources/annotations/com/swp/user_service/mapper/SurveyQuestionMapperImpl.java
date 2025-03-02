package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SurveyAnswerOptionRequest;
import com.swp.user_service.dto.request.SurveyQuestionCreationRequest;
import com.swp.user_service.dto.response.SurveyAnswerOptionResponse;
import com.swp.user_service.dto.response.SurveyQuestionResponse;
import com.swp.user_service.entity.Survey;
import com.swp.user_service.entity.SurveyAnswerOption;
import com.swp.user_service.entity.SurveyQuestion;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class SurveyQuestionMapperImpl implements SurveyQuestionMapper {

    @Override
    public SurveyQuestion toSurveyQuestion(SurveyQuestionCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        SurveyQuestion.SurveyQuestionBuilder surveyQuestion = SurveyQuestion.builder();

        surveyQuestion.survey( surveyQuestionCreationRequestToSurvey( request ) );
        surveyQuestion.questionText( request.getQuestionText() );
        surveyQuestion.answerOptions( surveyAnswerOptionRequestListToSurveyAnswerOptionList( request.getAnswerOptions() ) );

        return surveyQuestion.build();
    }

    @Override
    public SurveyQuestionResponse toSurveyQuestionResponse(SurveyQuestion question) {
        if ( question == null ) {
            return null;
        }

        SurveyQuestionResponse.SurveyQuestionResponseBuilder surveyQuestionResponse = SurveyQuestionResponse.builder();

        surveyQuestionResponse.surveyId( questionSurveySurveyId( question ) );
        surveyQuestionResponse.questionId( question.getQuestionId() );
        surveyQuestionResponse.questionText( question.getQuestionText() );
        surveyQuestionResponse.answerOptions( surveyAnswerOptionListToSurveyAnswerOptionResponseList( question.getAnswerOptions() ) );

        return surveyQuestionResponse.build();
    }

    protected Survey surveyQuestionCreationRequestToSurvey(SurveyQuestionCreationRequest surveyQuestionCreationRequest) {
        if ( surveyQuestionCreationRequest == null ) {
            return null;
        }

        Survey.SurveyBuilder survey = Survey.builder();

        survey.surveyId( surveyQuestionCreationRequest.getSurveyId() );

        return survey.build();
    }

    protected SurveyAnswerOption surveyAnswerOptionRequestToSurveyAnswerOption(SurveyAnswerOptionRequest surveyAnswerOptionRequest) {
        if ( surveyAnswerOptionRequest == null ) {
            return null;
        }

        SurveyAnswerOption.SurveyAnswerOptionBuilder surveyAnswerOption = SurveyAnswerOption.builder();

        surveyAnswerOption.optionText( surveyAnswerOptionRequest.getOptionText() );
        surveyAnswerOption.score( surveyAnswerOptionRequest.getScore() );

        return surveyAnswerOption.build();
    }

    protected List<SurveyAnswerOption> surveyAnswerOptionRequestListToSurveyAnswerOptionList(List<SurveyAnswerOptionRequest> list) {
        if ( list == null ) {
            return null;
        }

        List<SurveyAnswerOption> list1 = new ArrayList<SurveyAnswerOption>( list.size() );
        for ( SurveyAnswerOptionRequest surveyAnswerOptionRequest : list ) {
            list1.add( surveyAnswerOptionRequestToSurveyAnswerOption( surveyAnswerOptionRequest ) );
        }

        return list1;
    }

    private String questionSurveySurveyId(SurveyQuestion surveyQuestion) {
        if ( surveyQuestion == null ) {
            return null;
        }
        Survey survey = surveyQuestion.getSurvey();
        if ( survey == null ) {
            return null;
        }
        String surveyId = survey.getSurveyId();
        if ( surveyId == null ) {
            return null;
        }
        return surveyId;
    }

    protected SurveyAnswerOptionResponse surveyAnswerOptionToSurveyAnswerOptionResponse(SurveyAnswerOption surveyAnswerOption) {
        if ( surveyAnswerOption == null ) {
            return null;
        }

        SurveyAnswerOptionResponse.SurveyAnswerOptionResponseBuilder surveyAnswerOptionResponse = SurveyAnswerOptionResponse.builder();

        surveyAnswerOptionResponse.optionId( surveyAnswerOption.getOptionId() );
        surveyAnswerOptionResponse.optionText( surveyAnswerOption.getOptionText() );
        surveyAnswerOptionResponse.score( surveyAnswerOption.getScore() );

        return surveyAnswerOptionResponse.build();
    }

    protected List<SurveyAnswerOptionResponse> surveyAnswerOptionListToSurveyAnswerOptionResponseList(List<SurveyAnswerOption> list) {
        if ( list == null ) {
            return null;
        }

        List<SurveyAnswerOptionResponse> list1 = new ArrayList<SurveyAnswerOptionResponse>( list.size() );
        for ( SurveyAnswerOption surveyAnswerOption : list ) {
            list1.add( surveyAnswerOptionToSurveyAnswerOptionResponse( surveyAnswerOption ) );
        }

        return list1;
    }
}
