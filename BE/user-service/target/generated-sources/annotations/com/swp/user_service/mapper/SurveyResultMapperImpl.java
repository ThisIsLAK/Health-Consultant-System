package com.swp.user_service.mapper;

import com.swp.user_service.dto.response.SurveyResultResponse;
import com.swp.user_service.entity.Survey;
import com.swp.user_service.entity.SurveyResult;
import com.swp.user_service.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class SurveyResultMapperImpl implements SurveyResultMapper {

    @Override
    public SurveyResultResponse toSurveyResultResponse(SurveyResult surveyResult) {
        if ( surveyResult == null ) {
            return null;
        }

        SurveyResultResponse.SurveyResultResponseBuilder surveyResultResponse = SurveyResultResponse.builder();

        surveyResultResponse.surveyId( surveyResultSurveySurveyId( surveyResult ) );
        surveyResultResponse.userId( surveyResultUserId( surveyResult ) );
        surveyResultResponse.userName( surveyResultUserName( surveyResult ) );
        surveyResultResponse.surveyTitle( surveyResultSurveyTitle( surveyResult ) );
        if ( surveyResult.getScore() != null ) {
            surveyResultResponse.score( surveyResult.getScore() );
        }

        return surveyResultResponse.build();
    }

    private String surveyResultSurveySurveyId(SurveyResult surveyResult) {
        if ( surveyResult == null ) {
            return null;
        }
        Survey survey = surveyResult.getSurvey();
        if ( survey == null ) {
            return null;
        }
        String surveyId = survey.getSurveyId();
        if ( surveyId == null ) {
            return null;
        }
        return surveyId;
    }

    private String surveyResultUserId(SurveyResult surveyResult) {
        if ( surveyResult == null ) {
            return null;
        }
        User user = surveyResult.getUser();
        if ( user == null ) {
            return null;
        }
        String id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String surveyResultUserName(SurveyResult surveyResult) {
        if ( surveyResult == null ) {
            return null;
        }
        User user = surveyResult.getUser();
        if ( user == null ) {
            return null;
        }
        String name = user.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private String surveyResultSurveyTitle(SurveyResult surveyResult) {
        if ( surveyResult == null ) {
            return null;
        }
        Survey survey = surveyResult.getSurvey();
        if ( survey == null ) {
            return null;
        }
        String title = survey.getTitle();
        if ( title == null ) {
            return null;
        }
        return title;
    }
}
