package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SurveyAnswerOptionRequest;
import com.swp.user_service.dto.request.SurveyAnswerOptionUpdateRequest;
import com.swp.user_service.dto.request.SurveyQuestionCreationRequest;
import com.swp.user_service.dto.request.SurveyQuestionUpdateRequest;
import com.swp.user_service.dto.response.SurveyAnswerOptionResponse;
import com.swp.user_service.dto.response.SurveyQuestionResponse;
import com.swp.user_service.entity.SurveyAnswerOption;
import com.swp.user_service.entity.SurveyQuestion;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class SurveyQuestionMapperImpl implements SurveyQuestionMapper {

    @Override
    public SurveyQuestion toSurveyQuestion(SurveyQuestionCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        SurveyQuestion.SurveyQuestionBuilder surveyQuestion = SurveyQuestion.builder();

        surveyQuestion.active( request.getActive() );
        surveyQuestion.questionText( request.getQuestionText() );
        surveyQuestion.answerOptions( surveyAnswerOptionRequestListToSurveyAnswerOptionList( request.getAnswerOptions() ) );

        return surveyQuestion.build();
    }

    @Override
    public SurveyQuestion toSurveyQuestion(SurveyQuestionUpdateRequest request) {
        if ( request == null ) {
            return null;
        }

        SurveyQuestion.SurveyQuestionBuilder surveyQuestion = SurveyQuestion.builder();

        surveyQuestion.questionId( request.getQuestionId() );
        surveyQuestion.questionText( request.getQuestionText() );
        surveyQuestion.answerOptions( surveyAnswerOptionUpdateRequestListToSurveyAnswerOptionList( request.getAnswerOptions() ) );

        return surveyQuestion.build();
    }

    @Override
    public SurveyQuestionResponse toSurveyQuestionResponse(SurveyQuestion question) {
        if ( question == null ) {
            return null;
        }

        SurveyQuestionResponse.SurveyQuestionResponseBuilder surveyQuestionResponse = SurveyQuestionResponse.builder();

        surveyQuestionResponse.questionId( question.getQuestionId() );
        surveyQuestionResponse.questionText( question.getQuestionText() );
        surveyQuestionResponse.answerOptions( surveyAnswerOptionListToSurveyAnswerOptionResponseList( question.getAnswerOptions() ) );
        surveyQuestionResponse.active( question.getActive() );

        return surveyQuestionResponse.build();
    }

    protected SurveyAnswerOption surveyAnswerOptionRequestToSurveyAnswerOption(SurveyAnswerOptionRequest surveyAnswerOptionRequest) {
        if ( surveyAnswerOptionRequest == null ) {
            return null;
        }

        SurveyAnswerOption.SurveyAnswerOptionBuilder surveyAnswerOption = SurveyAnswerOption.builder();

        surveyAnswerOption.optionText( surveyAnswerOptionRequest.getOptionText() );
        surveyAnswerOption.score( surveyAnswerOptionRequest.getScore() );
        surveyAnswerOption.active( surveyAnswerOptionRequest.getActive() );

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

    protected SurveyAnswerOption surveyAnswerOptionUpdateRequestToSurveyAnswerOption(SurveyAnswerOptionUpdateRequest surveyAnswerOptionUpdateRequest) {
        if ( surveyAnswerOptionUpdateRequest == null ) {
            return null;
        }

        SurveyAnswerOption.SurveyAnswerOptionBuilder surveyAnswerOption = SurveyAnswerOption.builder();

        surveyAnswerOption.optionId( surveyAnswerOptionUpdateRequest.getOptionId() );
        surveyAnswerOption.optionText( surveyAnswerOptionUpdateRequest.getOptionText() );

        return surveyAnswerOption.build();
    }

    protected List<SurveyAnswerOption> surveyAnswerOptionUpdateRequestListToSurveyAnswerOptionList(List<SurveyAnswerOptionUpdateRequest> list) {
        if ( list == null ) {
            return null;
        }

        List<SurveyAnswerOption> list1 = new ArrayList<SurveyAnswerOption>( list.size() );
        for ( SurveyAnswerOptionUpdateRequest surveyAnswerOptionUpdateRequest : list ) {
            list1.add( surveyAnswerOptionUpdateRequestToSurveyAnswerOption( surveyAnswerOptionUpdateRequest ) );
        }

        return list1;
    }

    protected SurveyAnswerOptionResponse surveyAnswerOptionToSurveyAnswerOptionResponse(SurveyAnswerOption surveyAnswerOption) {
        if ( surveyAnswerOption == null ) {
            return null;
        }

        SurveyAnswerOptionResponse.SurveyAnswerOptionResponseBuilder surveyAnswerOptionResponse = SurveyAnswerOptionResponse.builder();

        surveyAnswerOptionResponse.optionId( surveyAnswerOption.getOptionId() );
        surveyAnswerOptionResponse.optionText( surveyAnswerOption.getOptionText() );
        surveyAnswerOptionResponse.score( surveyAnswerOption.getScore() );
        surveyAnswerOptionResponse.active( surveyAnswerOption.getActive() );

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
