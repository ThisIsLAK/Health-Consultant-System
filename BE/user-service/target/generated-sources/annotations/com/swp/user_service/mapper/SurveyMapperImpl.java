package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SurveyCreationRequest;
import com.swp.user_service.dto.response.AllSurveyResponse;
import com.swp.user_service.dto.response.SurveyAnswerOptionResponse;
import com.swp.user_service.dto.response.SurveyQuestionResponse;
import com.swp.user_service.dto.response.SurveyResponse;
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
public class SurveyMapperImpl implements SurveyMapper {

    @Override
    public Survey toSurvey(SurveyCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Survey.SurveyBuilder survey = Survey.builder();

        survey.title( request.getTitle() );
        survey.description( request.getDescription() );

        return survey.build();
    }

    @Override
    public SurveyResponse toSurveyResponse(Survey survey) {
        if ( survey == null ) {
            return null;
        }

        SurveyResponse.SurveyResponseBuilder surveyResponse = SurveyResponse.builder();

        surveyResponse.questions( mapQuestions( survey.getQuestions() ) );
        surveyResponse.surveyId( survey.getSurveyId() );
        surveyResponse.title( survey.getTitle() );
        surveyResponse.createdDate( survey.getCreatedDate() );
        surveyResponse.description( survey.getDescription() );

        return surveyResponse.build();
    }

    @Override
    public AllSurveyResponse toAllSurveyResponse(Survey survey) {
        if ( survey == null ) {
            return null;
        }

        AllSurveyResponse.AllSurveyResponseBuilder allSurveyResponse = AllSurveyResponse.builder();

        allSurveyResponse.surveyId( survey.getSurveyId() );
        allSurveyResponse.title( survey.getTitle() );
        allSurveyResponse.createdDate( survey.getCreatedDate() );
        allSurveyResponse.description( survey.getDescription() );

        return allSurveyResponse.build();
    }

    @Override
    public List<SurveyQuestionResponse> mapQuestions(List<SurveyQuestion> questions) {
        if ( questions == null ) {
            return null;
        }

        List<SurveyQuestionResponse> list = new ArrayList<SurveyQuestionResponse>( questions.size() );
        for ( SurveyQuestion surveyQuestion : questions ) {
            list.add( surveyQuestionToSurveyQuestionResponse( surveyQuestion ) );
        }

        return list;
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

    protected SurveyQuestionResponse surveyQuestionToSurveyQuestionResponse(SurveyQuestion surveyQuestion) {
        if ( surveyQuestion == null ) {
            return null;
        }

        SurveyQuestionResponse.SurveyQuestionResponseBuilder surveyQuestionResponse = SurveyQuestionResponse.builder();

        surveyQuestionResponse.questionId( surveyQuestion.getQuestionId() );
        surveyQuestionResponse.questionText( surveyQuestion.getQuestionText() );
        surveyQuestionResponse.answerOptions( surveyAnswerOptionListToSurveyAnswerOptionResponseList( surveyQuestion.getAnswerOptions() ) );

        return surveyQuestionResponse.build();
    }
}
